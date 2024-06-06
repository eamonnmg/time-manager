import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type {
  BudgetActivity,
  BudgetActivityWithActivity,
  ModelId,
} from "@/shared/types";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { useBudgetStore } from "@/Budget/useBudgetStore";
import { hoursToMs } from "@/Budget/budgetUtils";

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

    // decrement by one hour
    function decrementAllocatedTime(budgetActivityId: ModelId) {
      const targetIdx = budgetActivities.value.findIndex(
        (ba: BudgetActivity) => ba.id === budgetActivityId,
      );
      if (targetIdx === -1) {
        console.error("budget activity not found");
        return;
      }
      if (budgetActivities.value[targetIdx].allocatedTime < hoursToMs(1)) {
        console.error("cannot allocate less than 1 hour");
        return;
      }
      budgetActivities.value[targetIdx].allocatedTime -= hoursToMs(1);
    }

    //increment by one hour
    function incrementAllocatedTime(budgetActivityId: ModelId) {
      const targetIdx = budgetActivities.value.findIndex(
        (ba: BudgetActivity) => ba.id === budgetActivityId,
      );
      if (targetIdx === -1) {
        console.error("budget activity not found");
        return;
      }
      if (
        remainingTimeForBudget.value(
          budgetActivities.value[targetIdx].budgetId,
        ) < hoursToMs(1)
      ) {
        console.error("cant allocate another hour, not enough time left");
        return;
      }
      budgetActivities.value[targetIdx].allocatedTime += hoursToMs(1);
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

    function remove(id: ModelId) {
      budgetActivities.value = budgetActivities.value.filter(
        (ba) => ba.id !== id,
      );
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
      return (budgetId: ModelId): number => {
        return getAllForBudget
          .value(budgetId)
          .reduce((acc: number, ba: BudgetActivityWithActivity) => {
            return acc + ba.allocatedTime;
          }, 0);
      };
    });

    const remainingTimeForBudget = computed(() => {
      return (budgetId: ModelId): number => {
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
      decrementAllocatedTime,
      incrementAllocatedTime,
      getById,
      add,
      remove,
    };
  },
  {
    persist: true,
  },
);
