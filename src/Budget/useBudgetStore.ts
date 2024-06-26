import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { Budget, CreateBudgetArgs, ModelId } from "@/shared/types";
import { hoursToMs } from "@/Budget/budgetUtils";
import { useBudgetPeriodStore } from "@/Budget/useBudgetPeriodStore";

const dayBudget: Budget = {
  id: "1",
  name: "Day",
  duration: 1000 * 60 * 60 * 24,
  occupiedTime: 0,
};

const weekBudget: Budget = {
  id: "2",
  name: "Week",
  duration: 1000 * 60 * 60 * 24 * 7,
  occupiedTime: 0,
};

export const useBudgetStore = defineStore(
  "budgets",
  () => {
    const budgetPeriodStore = useBudgetPeriodStore();
    const budgets = ref<Budget[]>([dayBudget, weekBudget]);

    function getById(id: ModelId): Budget | undefined {
      return budgets.value.find((b: Budget) => b.id === id);
    }

    const getAvailableTimeForBudget = computed(() => {
      return (budgetId: string): number => {
        const budget = getById(budgetId);
        if (!budget) {
          console.error("budget not found");
          return 0;
        }
        return budget.duration - budget.occupiedTime;
      };
    });

    // check budgetPeriods to see is this budget active?
    const isActive = computed(() => {
      return (budgetId: ModelId) => {
        {
          return Boolean(
            budgetPeriodStore.budgetsPeriods.find(
              (bp) => bp.budgetId === budgetId,
            ),
          );
        }
      };
    });

    function add(budget: CreateBudgetArgs) {
      const id = self.crypto.randomUUID();
      budgets.value.push({
        ...budget,
        occupiedTime: 0,
        id,
      });
    }

    function edit(budget: Budget) {
      const targetIdx = budgets.value.findIndex(
        (b: Budget) => b.id === budget.id,
      );
      if (targetIdx === -1) {
        console.error("budget not found");
        return;
      }
      budgets.value[targetIdx] = budget;
    }

    function setBudgetDuration(budgetId: ModelId, milliseconds: number) {
      const targetIdx = budgets.value.findIndex(
        (b: Budget) => b.id === budgetId,
      );
      if (targetIdx === -1) {
        console.error("budget not found");
        return;
      }
      budgets.value[targetIdx].duration = milliseconds;
    }

    function setBudgetOccupiedTime(budgetId: ModelId, milliseconds: number) {
      const targetIdx = budgets.value.findIndex(
        (b: Budget) => b.id === budgetId,
      );
      if (targetIdx === -1) {
        console.error("budget not found");
        return;
      }
      budgets.value[targetIdx].occupiedTime = milliseconds;
    }

    return {
      budgets,
      getById,
      getAvailableTimeForBudget,
      add,
      edit,
      setBudgetDuration,
      setBudgetOccupiedTime,
      isActive,
    };
  },
  {
    persist: true,
  },
);
