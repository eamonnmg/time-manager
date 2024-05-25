import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlanUiStore = defineStore(
  "planUi",
  () => {
    const budgetPeriodSidebarOpen = ref(false);

    function openBudgetPeriodSidebar() {
      budgetPeriodSidebarOpen.value = true;
    }

    function closeBudgetPeriodSidebar() {
      budgetPeriodSidebarOpen.value = false;
    }

    function toggleBudgetPeriodSidebar() {
      budgetPeriodSidebarOpen.value = !budgetPeriodSidebarOpen.value;
    }

    return {
      budgetPeriodSidebarOpen,
      openBudgetPeriodSidebar,
      closeBudgetPeriodSidebar,
      toggleBudgetPeriodSidebar,
    };
  },
  {
    persist: true,
  },
);
