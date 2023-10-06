<script setup lang="ts">
import AppHeader from "@/Plan/AppHeader.vue";
import { useBudgetStore } from "@/Budget/useBudgetStore";
import { useRoute } from "vue-router";
import ActivityPicker from "@/Activities/ActivityPicker.vue";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { useBudgetActivityStore } from "@/Budget/useBudgetActivityStore";
import { computed } from "vue";

const budgetId = useRoute().params.budgetId;

console.log(budgetId);

const budgetStore = useBudgetStore();
const activityStore = useActivitiesStore();
const budgetActivityStore = useBudgetActivityStore();

const budget = budgetStore.getById(budgetId.toString());

const budgetActivities = computed(() => {
  return budgetActivityStore.getAllForBudget(budgetId.toString());
});

function onActivitySelected(e) {
  budgetActivityStore.add(budgetId.toString(), e[0].id);
  console.log("activity selected", e);
}
</script>

<template>
  <div class="flex h-full w-full flex-col">
    <AppHeader>
      <template #left>
        <h1 class="text-base font-semibold leading-6 text-gray-900">
          Edit Budget
          <span class="badge badge-primary">{{
            budgetStore.getById(budgetId.toString()).name
          }}</span>
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          A budget defines how you want to allocate your time for a period
        </p>
      </template>
    </AppHeader>
    <!--    // activies-->
    <div class="px-4 h-full divide-x space-x-4 flex">
      <div class="w-1/2 flex flex-col mt-6">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th>Name</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="activity in budgetActivities" :key="activity.id">
              <td>{{ activity.activity.name }}</td>
              <td>
                <input
                  type="range"
                  min="0"
                  max="100"
                  class="range"
                  :value="activity.allocatedTime"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--      config-->
      <div class="w-1/2">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          Name: <input v-model="budget.name" type="text" />
          <br />
          Duration: <input v-model="budget.duration" type="text" />
          <br />
          Activities:
          <ActivityPicker
            :activities="activityStore.activities"
            @update:model-value="onActivitySelected"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
