import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { Budget, BudgetId } from "@/types";
import { hoursToMs } from "@/Budget/budgetUtils";

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
    const budgets = ref<Budget[]>([dayBudget, weekBudget]);

    function getById(id: string): Budget | undefined {
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

    function add(budget: Budget) {
      const timeBlockId = self.crypto.randomUUID();
      budgets.value.push({
        ...budget,
        id: timeBlockId,
      });
    }

    function edit(budget: Budget) {
      const targetIdx = budgets.value.findIndex(
        (b: Budget) => b.id === budget.id,
      );
      if (targetIdx < 0) {
        console.error("budget not found");
        return;
      }
      budgets.value[targetIdx] = budget;
    }

    function setBudgetDurationInHours(budgetId: BudgetId, hours: number) {
      const targetIdx = budgets.value.findIndex(
        (b: Budget) => b.id === budgetId,
      );
      if (targetIdx < 0) {
        console.error("budget not found");
        return;
      }
      budgets.value[targetIdx].duration = hoursToMs(hours);
    }

    function setBudgetOccupiedTimeInHours(budgetId: BudgetId, hours: number) {
      const targetIdx = budgets.value.findIndex(
        (b: Budget) => b.id === budgetId,
      );
      if (targetIdx < 0) {
        console.error("budget not found");
        return;
      }
      budgets.value[targetIdx].occupiedTime = hoursToMs(hours);
    }

    return {
      budgets,
      getById,
      getAvailableTimeForBudget,
      add,
      edit,
      setBudgetDurationInHours,
      setBudgetOccupiedTimeInHours,
    };
  },
  {
    persist: true,
  },
);
