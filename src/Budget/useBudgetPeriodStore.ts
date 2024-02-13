import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type {
  Activity,
  BudgetPeriod,
  BudgetPeriodCreate,
  BudgetPeriodWithBudget,
  ModelId,
  TimeBlockWithActivity,
} from "@/types";
import { useBudgetStore } from "@/Budget/useBudgetStore";
import { add, addMilliseconds } from "date-fns";
import { timeBlocks } from "@/utils/testdata";
import { useTimeBlockStore } from "@/Plan/useTimeBlockStore";
import { useBudgetActivityStore } from "@/Budget/useBudgetActivityStore";
import { useActivitiesStore } from "@/Activities/activitiesStore";

export const useBudgetPeriodStore = defineStore(
  "budgetPeriods",
  () => {
    const budgetStore = useBudgetStore();
    const activitiesStore = useActivitiesStore();
    const budgetActivityStore = useBudgetActivityStore();
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

    function findActivity(activity: Activity, activityId: ModelId): Activity {
      if (activity.id === activityId) {
        return activity;
      }
      if (activity.nestedActivities.length) {
        for (const nestedActivity of activity.nestedActivities) {
          return findActivity(nestedActivity, activityId);
        }
      }
    }
    const timeBlocksForBudgetActivity = computed(() => {
      return (activityId: ModelId) => {
        if (!timeBlocksInActivePeriod.value.length) {
          return [];
        }
        return timeBlocksInActivePeriod.value.filter((tb) => {
          return findActivity(tb.activity, activityId);
        });
      };
    });

    const totalAllocatedTimeForBudgetActivityInPeriod = computed(() => {
      return (budgetActivityId: ModelId): number => {
        const timeBlocks = timeBlocksForBudgetActivity.value(budgetActivityId);
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
