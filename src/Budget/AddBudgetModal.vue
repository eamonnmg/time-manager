<script setup lang="ts">
import { ref } from "vue";
import { useBudgetStore } from "@/Budget/useBudgetStore";
import BaseModal from "@/shared/components/BaseModal.vue";
import DurationInput from "@/shared/components/DurationInput.vue";
import BaseInput from "@/shared/components/BaseInput.vue";

const emit = defineEmits(["addBudget", "close"]);

const budgetName = ref("");

const durationMilliseconds = ref(0);

const budgetStore = useBudgetStore();

function submit() {
  budgetStore.add({
    name: budgetName.value,
    duration: durationMilliseconds.value,
  });
  close();
}

function close() {
  emit("close");
}
</script>

<template>
  <BaseModal title="Add budget" @close="close">
    <template #default>
      <div class="space-y-2">
        <div>
          <label
            for="budget-name"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Name</label
          >
          <div class="mt-2">
            <BaseInput
              id="budget-name"
              v-model="budgetName"
              type="text"
              name="budget-name"
              placeholder="Budget name"
              aria-describedby="name-description"
            />
          </div>
        </div>
        <div>
          <div class="flex space-x-2">
            <DurationInput v-model:milliseconds="durationMilliseconds" />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="submit"
      >
        Add budget
      </button>
    </template>
  </BaseModal>
</template>
