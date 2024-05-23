import { defineStore } from "pinia";
import { ref } from "vue";

export const useLayoutStore = defineStore(
  "layout",
  () => {
    const sidebarOpen = ref(false);

    function openSidebar() {
      sidebarOpen.value = true;
    }

    function closeSidebar() {
      sidebarOpen.value = false;
    }

    function toggleSidebar() {
      sidebarOpen.value = !sidebarOpen.value;
    }

    return {
      sidebarOpen,
      openSidebar,
      closeSidebar,
      toggleSidebar,
    };
  },
  {
    persist: true,
  },
);
