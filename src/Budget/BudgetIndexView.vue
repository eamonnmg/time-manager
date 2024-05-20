<script setup lang="ts">
import AppHeader from "@/Plan/AppHeader.vue";
import { useBudgetStore } from "@/Budget/useBudgetStore";
import { formatDuration } from "date-fns";
import AddBudgetModal from "@/Budget/AddBudgetModal.vue";
import { ref } from "vue";
import { milliSecondsToDuration } from "@/shared/utils/dateTimeHelpers";

const budgetStore = useBudgetStore();

const showAddBudgetModal = ref(false);
</script>

<template>
  <AddBudgetModal v-model:open="showAddBudgetModal"></AddBudgetModal>
  <div class="flex h-full w-full flex-col">
    <AppHeader>
      <template #left>
        <h1 class="text-base font-semibold leading-6 text-gray-900">Budget</h1>
        <p class="mt-2 text-sm text-gray-700">
          A budget defines how you want to allocate your time for a period
        </p>
      </template>
      <button
        type="button"
        class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="showAddBudgetModal = true"
      >
        Add budget
      </button>
    </AppHeader>
    <div class="px-4 mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <!--            <thead>-->
            <!--              <tr>-->
            <!--                <th-->
            <!--                  scope="col"-->
            <!--                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"-->
            <!--                >-->
            <!--                  Name-->
            <!--                </th>-->
            <!--                <th-->
            <!--                  scope="col"-->
            <!--                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"-->
            <!--                >-->
            <!--                  Duration-->
            <!--                </th>-->
            <!--              </tr>-->
            <!--            </thead>-->
            <tbody class="divide-y divide-gray-200">
              <tr v-for="budget in budgetStore.budgets" :key="budget.id">
                <td
                  class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                >
                  <RouterLink
                    :to="{
                      name: 'budget',
                      params: { budgetId: budget.id },
                    }"
                    class="hover:underline"
                  >
                    {{ budget.name }}
                  </RouterLink>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <!--                  {{ millisecondsToHours(budget.duration) }} hours-->
                  {{
                    formatDuration(milliSecondsToDuration(budget.duration), {
                      format: ["days", "hours", "minutes"],
                      delimiter: ", ",
                    })
                  }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span
                    v-if="budgetStore.isActive(budget.id)"
                    class="badge badge-info"
                    >Active</span
                  >
                </td>
                <td
                  class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                >
                  <RouterLink
                    :to="{
                      name: 'budget',
                      params: { budgetId: budget.id },
                    }"
                    class="btn btn-sm btn-ghost text-indigo-600 hover:text-indigo-900"
                  >
                    Edit<span class="sr-only">, {{ budget.name }}</span>
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
