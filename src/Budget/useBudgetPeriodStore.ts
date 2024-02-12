import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { BudgetPeriod, ModelId } from "@/types";
import { useBudgetStore } from "@/Budget/useBudgetStore";
import { add, addMilliseconds } from "date-fns";

export const useBudgetPeriodStore = defineStore(
  "budgetPeriods",
  () => {
    const budgetStore = useBudgetStore();
    const budgetsPeriods = ref<BudgetPeriod[]>([]);

    function getById(id: string): BudgetPeriod | undefined {
      return budgetsPeriods.value.find((b: BudgetPeriod) => b.id === id);
    }

    function create(budgetPeriod: Omit<BudgetPeriod, "id" | "endDate">) {
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
      if (targetIdx < 0) {
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
    };
  },
  {
    persist: true,
  },
);
