<script setup lang="ts">
import { computed, ref } from "vue";
import type { Activity } from "@/types";
import { useBudgetStore } from "@/Budget/useBudgetStore";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

import { ClockIcon } from "@heroicons/vue/24/outline";
import {
  milliseconds,
} from "date-fns";

interface Props {
  open: boolean;
  activity?: Activity;
}

const props = defineProps<Props>();

const emit = defineEmits([
  "update:open",
  "addActivity",
  "editActivity",
  "close",
]);

const budgetName = ref("");

const duration = ref<Duration>({
  days: 0,
  hours: 0,
  minutes: 0,
});

const durationMilliseconds = computed<number>(() => {
  return milliseconds(duration.value);
});

const budgetStore = useBudgetStore();

function submit() {
  budgetStore.add({
    name: budgetName.value,
    duration: durationMilliseconds.value,
  });
  close();
}

function close() {
  emit("update:open", false);
  emit("close");
}
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="close">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full justify-center p-4 text-center items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div>
                <div class="w-full flex justify-center">
                  <ClockIcon class="size-8 text-green-600" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-gray-900"
                    >Add Budget</DialogTitle
                  >
                </div>

                <div class="mt-8">
                  <div>
                    <label
                      for="budget-name"
                      class="block text-sm font-medium leading-6 text-gray-900"
                      >Name</label
                    >
                    <div class="mt-2">
                      <input
                        id="budget-name"
                        v-model="budgetName"
                        type="text"
                        name="budget-name"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Budget name"
                        aria-describedby="name-description"
                      />
                    </div>
                    <p id="name-description" class="mt-2 text-sm text-gray-500">
                      The name of the budget.
                    </p>
                  </div>
                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium leading-6 text-gray-900"
                      >Duration</label
                    >
                    <div class="flex space-x-2">
                      <input
                        id="days"
                        v-model="duration.days"
                        type="number"
                        name="days"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Days"
                        aria-describedby="days-duration"
                      />
                      <input
                        id="hours"
                        v-model="duration.hours"
                        type="number"
                        name="hours"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="hours"
                      />
                      <input
                        id="mins"
                        v-model="duration.minutes"
                        type="number"
                        name="mins"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Minutes"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  @click="submit"
                >
                  Add budget
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped></style>
