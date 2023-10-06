import { ref } from "vue";
import { defineStore } from "pinia";
import type { Budget } from "@/types";

const dayBudget: Budget = {
  id: "1",
  name: "Day",
  duration: 1000 * 60 * 60 * 24,
};

const weekBudget: Budget = {
  id: "2",
  name: "Week",
  duration: 1000 * 60 * 60 * 24 * 7,
};

export const useBudgetStore = defineStore(
  "budgets",
  () => {
    const budgets = ref<Budget[]>([dayBudget, weekBudget]);

    function getById(id: string): Budget | undefined {
      return budgets.value.find((b: Budget) => b.id === id);
    }

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
      if (!targetIdx) {
        console.error("budget not found");
        return;
      }
      budget.value[targetIdx] = budget;
    }

    return { budgets, getById, add, edit };
  },
  {
    persist: true,
  },
);
