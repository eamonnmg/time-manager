<script setup lang="ts">
import { computed, ref } from "vue";
import { useBudgetStore } from "@/Budget/useBudgetStore";
import BaseModal from "@/shared/components/BaseModal.vue";
import BaseInput from "@/shared/components/BaseInput.vue";
import type { Budget } from "@/shared/types";
import { useBudgetPeriodStore } from "@/Budget/useBudgetPeriodStore";
import { format } from "date-fns";

interface Props {
  budget: Budget;
}

const props = defineProps<Props>();

const emit = defineEmits(["addBudget", "close"]);

const startDateTime = ref("");

const endDateText = computed(() => {
  if (!startDateTime.value) {
    return "";
  }

  const startDate = new Date(startDateTime.value);
  const endDate = new Date(startDate.getTime() + props.budget.duration);

  return format(endDate, "dd/MM/yyyy HH:mm");
});

const budgetPeriodStore = useBudgetPeriodStore();

function activate() {
  try {
    budgetPeriodStore.create({
      budgetId: props.budget.id,
      startDate: new Date(startDateTime.value),
    });
  } catch (e) {
    alert(e.message);
  }

  close();
}

function close() {
  emit("close");
}
</script>

<template>
  <BaseModal title="Activate budget period" @close="close">
    <template #default>
      <div class="space-y-2">
        <div>
          <label
            for="budget-name"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Start date</label
          >
          <div class="mt-2">
            <BaseInput
              id="budget-name"
              v-model="startDateTime"
              class=""
              type="datetime-local"
              name="budget-name"
              placeholder="Budget name"
              aria-describedby="name-description"
            />
          </div>
        </div>
        <p v-if="endDateText" class="text-sm text-gray-400">
          Budget period will end on {{ endDateText }}
        </p>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="activate"
      >
        Activate
      </button>
    </template>
  </BaseModal>
</template>
