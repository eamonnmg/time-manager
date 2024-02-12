import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { BudgetPeriod, BudgetPeriodCreate, ModelId } from "@/types";
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

    // there should only be one active period at a time
    const activePeriod = computed<BudgetPeriod | undefined>(() => {
      const now = new Date();
      return budgetsPeriods.value.find((bp) => {
        return new Date(bp.startDate) <= now && new Date(bp.endDate) > now;
      });
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
      if (targetIdx < 0) {
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
    };
  },
  {
    persist: true,
  },
);
