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
import { addMilliseconds } from "date-fns";
import { useTimeBlockStore } from "@/Plan/useTimeBlockStore";

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
      // if (activity.name === "golf") {
      //   console.log("social", activity);
      // }
      // case 1: Timeblock activity matches the budget activity directly
      // if (activity.id === activityId) {
      //   return [activity];
      // }

      const index = tbActivities.findIndex((tbAct) => tbAct.id === activityId);
      if (index !== -1) {
        return tbActivities[index];
      }
      // case 2 timeBlock activity matches budget activity indirectly via nested activities
      // if (tbActivities.nestedActivities.length) {
      //   // for (const nestedActivity of activity.nestedActivities) {
      //   //   return findActivity(nestedActivity, activityId);
      //   // }
      //
      //     findActivity(activity.nestedActivities, activityId);
      // }

      for (const act of tbActivities) {
        if (act.nestedActivities.length) {
          return findActivity(act.nestedActivities, activityId);
        }
      }
      //   return findActivity(nestedActivity, activityId);
      // }

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

    function create(budgetPeriod: BudgetPeriodCreate) {
      const id = self.crypto.randomUUID();
      const budget = budgetStore.getById(budgetPeriod.budgetId);
      budgetsPeriods.value.push({
        ...budgetPeriod,
        endDate: addMilliseconds(budgetPeriod.startDate, budget.duration),
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
      activePeriod,
      edit,
      getById,
      create,
      timeBlocksInActivePeriod,
      totalAllocatedTimeForBudgetActivityInPeriod,
    };
  },
  {
    persist: true,
  },
);
