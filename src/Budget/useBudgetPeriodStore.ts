import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type {
  Activity,
  BudgetActivityWithActivity,
  BudgetPeriod,
  BudgetPeriodCreate,
  BudgetPeriodWithBudget,
  ModelId,
  TimeBlockWithActivity,
} from "@/shared/types";
import { useBudgetStore } from "@/Budget/useBudgetStore";
import { addMilliseconds, areIntervalsOverlapping } from "date-fns";
import { useTimeBlockStore } from "@/Plan/useTimeBlockStore";

export function findActivity(
  tbActivities: Activity[],
  activityId: ModelId,
): Activity {
  const index = tbActivities.findIndex((tbAct) => tbAct.id === activityId);
  if (index !== -1) {
    return tbActivities[index];
  }

  for (const act of tbActivities) {
    if (act.nestedActivities.length) {
      return findActivity(act.nestedActivities, activityId);
    }
  }

  return undefined;
}

export const useBudgetPeriodStore = defineStore(
  "budgetPeriods",
  () => {
    const budgetStore = useBudgetStore();
    const timeBlocksStore = useTimeBlockStore();
    const budgetsPeriods = ref<BudgetPeriod[]>([]);

    function getById(id: ModelId): BudgetPeriod | undefined {
      return budgetsPeriods.value.find((b: BudgetPeriod) => b.id === id);
    }

    const budgetPeriodsWithinRange = computed(() => {
      return (startDate: Date, endDate: Date): BudgetPeriodWithBudget[] => {
        return budgetsPeriods.value
          .filter((bp) => {
            return areIntervalsOverlapping(
              {
                start: startDate,
                end: endDate,
              },
              {
                start: new Date(bp.startDate),
                end: new Date(bp.endDate),
              },
            );
          })
          .map((bp) => {
            return {
              ...bp,
              budget: budgetStore.getById(bp.budgetId),
            };
          });
      };
    });

    const timeBlocksInPeriod = computed(() => {
      return (periodId: ModelId) => {
        const period = getById(periodId);
        if (!period) {
          return [];
        }
        return timeBlocksStore.timeBlocksWithActivityForDateRange(
          period.startDate,
          period.endDate,
        );
      };
    });

    const timeBlocksForActivityInPeriod = computed(() => {
      return (activityId: ModelId, periodId: ModelId) => {
        const timeBlocks = timeBlocksInPeriod.value(periodId);
        if (!timeBlocks.length) {
          return [];
        }
        const x = timeBlocks.filter((tb) => {
          return Boolean(findActivity([tb.activity], activityId));
        });

        console.log("timeBlocksForBudgetActivity", x);
        return x;
      };
    });

    const totalAllocatedTimeForBudgetActivityInPeriod = computed(() => {
      return (
        budgetActivity: BudgetActivityWithActivity,
        periodId: ModelId,
      ): number => {
        console.log(
          "budgetActivity",
          budgetActivity.activity.name,
          budgetActivity.activity.id,
        );
        const timeBlocks = timeBlocksForActivityInPeriod.value(
          budgetActivity.activity.id,
          periodId,
        );
        console.log("timeBlocks", timeBlocks);
        return timeBlocks.reduce((acc, tb) => {
          return acc + tb.duration;
        }, 0);
      };
    });

    function create(newBudgetPeriod: BudgetPeriodCreate) {
      const id = self.crypto.randomUUID();
      const budget = budgetStore.getById(newBudgetPeriod.budgetId);
      const endDate = addMilliseconds(
        newBudgetPeriod.startDate,
        budget.duration,
      );
      // ensure does not overlap an existing budget period

      const overlapPeriod = budgetsPeriods.value.find((existingPeriod) => {
        const existingPeriodEndDateIsWithinNewPeriod =
          existingPeriod.endDate > newBudgetPeriod.startDate &&
          endDate &&
          existingPeriod.startDate <= endDate;
        const newPeriodEndDateIsWithinExistingPeriod =
          existingPeriod.startDate <= newBudgetPeriod.startDate &&
          existingPeriod.endDate >= endDate;

        const existingPeriodIsWithinNewPeriod =
          existingPeriod.startDate >= newBudgetPeriod.startDate &&
          existingPeriod.endDate <= endDate;
        const existingPeriodStartDateIsWithinNewPeriod =
          existingPeriod.startDate >= newBudgetPeriod.startDate &&
          existingPeriod.startDate <= endDate;
        return (
          existingPeriodEndDateIsWithinNewPeriod ||
          newPeriodEndDateIsWithinExistingPeriod ||
          existingPeriodIsWithinNewPeriod ||
          existingPeriodStartDateIsWithinNewPeriod
        );
      });

      if (overlapPeriod) {
        throw new Error(
          "Budget period overlaps with another active budget period",
        );
      }

      budgetsPeriods.value.push({
        ...newBudgetPeriod,
        endDate,
        id,
      });
    }

    function edit(budgetPeriod: BudgetPeriod) {
      const targetIdx = budgetsPeriods.value.findIndex(
        (b: BudgetPeriod) => b.id === budgetPeriod.id,
      );
      if (targetIdx === -1) {
        console.error("budget not found");
        return;
      }
      budgetsPeriods.value[targetIdx] = budgetPeriod;
    }

    return {
      budgetsPeriods,
      edit,
      getById,
      create,
      timeBlocksForActivityInPeriod,
      totalAllocatedTimeForBudgetActivityInPeriod,
      budgetPeriodsWithinRange,
    };
  },
  {
    persist: true,
  },
);
