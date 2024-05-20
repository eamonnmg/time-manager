import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type {
  Activity,
  Budget,
  BudgetActivity,
  BudgetActivityWithActivity,
  ModelId,
} from "@/shared/types";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { useBudgetStore } from "@/Budget/useBudgetStore";
import { hoursToMs } from "@/Budget/budgetUtils";

// const dayBudget: Budget = {
//   id: "1",
//   name: "Day",
//   duration: 1000 * 60 * 60 * 24,
// };
//
// const weekBudget: Budget = {
//   id: "2",
//   name: "Week",
//   duration: 1000 * 60 * 60 * 24 * 7,
// };

export const useBudgetActivityStore = defineStore(
  "budgetActivities",
  () => {
    const activityStore = useActivitiesStore();
    const budgetStore = useBudgetStore();
    const budgetActivities = ref<BudgetActivity[]>([]);

    function getById(id: string): BudgetActivity | undefined {
      return budgetActivities.value.find((ba: BudgetActivity) => ba.id === id);
    }

    function setAllocatedTime(budgetActivityId: string, hours: number) {
      const targetIdx = budgetActivities.value.findIndex(
        (ba: BudgetActivity) => ba.id === budgetActivityId,
      );
      if (targetIdx === -1) {
        console.error("budget activity not found");
        return;
      }
      budgetActivities.value[targetIdx].allocatedTime = hoursToMs(hours);
    }

    function add(budgetId: string, activityId: string) {
      const id = self.crypto.randomUUID();
      budgetActivities.value.push({
        id,
        budgetId,
        activityId,
        allocatedTime: 0,
      });
    }

    const budgetActivitiesWithActivity = computed(() => {
      return budgetActivities.value.map((ba: BudgetActivity) => {
        return {
          ...ba,
          activity: activityStore.getById(ba.activityId),
        };
      });
    });

    const getAllForBudget = computed<
      (budgetId: ModelId) => BudgetActivityWithActivity[]
    >(() => {
      return (budgetId: string): BudgetActivityWithActivity[] => {
        return budgetActivitiesWithActivity.value.filter(
          (ba: BudgetActivity) => ba.budgetId === budgetId,
        );
      };
    });

    const totalAllocatedTimeForBudget = computed(() => {
      return (budgetId: string): number => {
        return getAllForBudget
          .value(budgetId)
          .reduce((acc: number, ba: BudgetActivityWithActivity) => {
            return acc + ba.allocatedTime;
          }, 0);
      };
    });

    const remainingTimeForBudget = computed(() => {
      return (budgetId: string): number => {
        const budget = budgetStore.getById(budgetId);
        if (!budget) {
          console.error("budget not found");
          return 0;
        }
        return (
          budget.duration -
          budget.occupiedTime -
          totalAllocatedTimeForBudget.value(budgetId)
        );
      };
    });

    return {
      budgetActivities,
      getAllForBudget,
      totalAllocatedTimeForBudget,
      remainingTimeForBudget,
      setAllocatedTime,
      getById,
      add,
    };
  },
  {
    persist: true,
  },
);
