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

// function doesBudgetPeriodOverlapDateRange(budgetPeriod: BudgetPeriod, range) {
//   const endDateIsWithinPeriod =
//     endDate > budgetPeriod.startDate &&
//     endDate &&
//     budgetPeriod.startDate <= endDate;
//   const newPeriodEndDateIsWithinExistingPeriod =
//     budgetPeriod.startDate <= startDate && budgetPeriod.endDate >= endDate;
//
//   const existingPeriodIsWithinNewPeriod =
//     budgetPeriod.startDate >= startDate && budgetPeriod.endDate <= endDate;
//   const existingPeriodStartDateIsWithinNewPeriod =
//     budgetPeriod.startDate >= startDate && budgetPeriod.startDate <= endDate;
//   return (
//     existingPeriodEndDateIsWithinNewPeriod ||
//     newPeriodEndDateIsWithinExistingPeriod ||
//     existingPeriodIsWithinNewPeriod ||
//     existingPeriodStartDateIsWithinNewPeriod
//   );
// }

export const useBudgetPeriodStore = defineStore(
  "budgetPeriods",
  () => {
    const budgetStore = useBudgetStore();
    const timeBlocksStore = useTimeBlockStore();
    const budgetsPeriods = ref<BudgetPeriod[]>([]);

    function getById(id: string): BudgetPeriod | undefined {
      return budgetsPeriods.value.find((b: BudgetPeriod) => b.id === id);
    }

    // there should only be one active period at a time
    const activePeriod = computed<BudgetPeriodWithBudget | undefined>(() => {
      const now = new Date();
      const bp = budgetsPeriods.value.find((bp) => {
        return new Date(bp.startDate) <= now && new Date(bp.endDate) > now;
      });

      if (!bp) {
        return;
      }

      return {
        ...bp,
        budget: budgetStore.getById(bp.budgetId),
      };
    });

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

    const timeBlocksInActivePeriod = computed<TimeBlockWithActivity[]>(() => {
      if (!activePeriod.value) {
        return [];
      }

      return timeBlocksStore.timeBlocksWithActivityForDateRange(
        activePeriod.value.startDate,
        activePeriod.value.endDate,
      );
    });

    function findActivity(
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
    const timeBlocksForBudgetActivity = computed(() => {
      return (activityId: ModelId) => {
        if (!timeBlocksInActivePeriod.value.length) {
          return [];
        }
        const x = timeBlocksInActivePeriod.value.filter((tb) => {
          return Boolean(findActivity([tb.activity], activityId));
        });

        console.log("timeBlocksForBudgetActivity", x);
        return x;
      };
    });

    const totalAllocatedTimeForBudgetActivityInPeriod = computed(() => {
      return (budgetActivity: BudgetActivityWithActivity): number => {
        console.log(
          "budgetActivity",
          budgetActivity.activity.name,
          budgetActivity.activity.id,
        );
        const timeBlocks = timeBlocksForBudgetActivity.value(
          budgetActivity.activity.id,
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

    function endActivePeriod() {
      if (!activePeriod.value) {
        console.info("No active period");
        return;
      }

      const targetIdx = budgetsPeriods.value.findIndex(
        (bp) => bp.id === activePeriod.value.id,
      );
      if (targetIdx === -1) {
        console.info("budget period not found");
        return;
      }

      budgetsPeriods.value[targetIdx].endDate = new Date();
    }

    return {
      budgetsPeriods,
      activePeriod,
      edit,
      getById,
      create,
      timeBlocksInActivePeriod,
      totalAllocatedTimeForBudgetActivityInPeriod,
      endActivePeriod,
      budgetPeriodsWithinRange,
    };
  },
  {
    persist: true,
  },
);
