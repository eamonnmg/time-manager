import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type {
  Activity,
  Budget,
  BudgetActivity,
  BudgetActivityWithActivity,
} from "@/types";
import { useActivitiesStore } from "@/Activities/activitiesStore";

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
    const budgetActivities = ref<BudgetActivity[]>([]);

    function getById(id: string): BudgetActivity | undefined {
      return budgetActivities.value.find((ba: BudgetActivity) => ba.id === id);
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

    const getAllForBudget = computed<BudgetActivityWithActivity[]>(() => {
      return (budgetId: string): BudgetActivityWithActivity[] => {
        return budgetActivitiesWithActivity.value.filter(
          (ba: BudgetActivity) => ba.budgetId === budgetId,
        );
      };
    });

    return { budgetActivities, getAllForBudget, getById, add };
  },
  {
    persist: true,
  },
);
