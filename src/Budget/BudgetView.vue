<script setup lang="ts">
import AppHeader from "@/Plan/AppHeader.vue";
import { useBudgetStore } from "@/Budget/useBudgetStore";
import { useRoute } from "vue-router";
import ActivityPicker from "@/Activities/ActivityPicker.vue";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { useBudgetActivityStore } from "@/Budget/useBudgetActivityStore";
import { computed } from "vue";
import { msToHours } from "@/Budget/budgetUtils";

const budgetId = useRoute().params.budgetId;

console.log(budgetId);

const budgetStore = useBudgetStore();
const activityStore = useActivitiesStore();
const budgetActivityStore = useBudgetActivityStore();

const budget = budgetStore.getById(budgetId.toString());

const budgetActivities = computed(() => {
  return budgetActivityStore.getAllForBudget(budgetId.toString());
});

const remainingTime = computed(() => {
  return budgetActivityStore.remainingTimeForBudget(budgetId.toString());
});

function onActivitySelected(e) {
  budgetActivityStore.add(budgetId.toString(), e.id);
}

function onActivityTimeChanged(activity, e) {
  budgetActivityStore.setAllocatedTime(
    activity.activityId,
    Number(e.target.value),
  );
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
      <div class="w-2/3 flex flex-col mt-6">
        <div>
          <progress
            class="progress"
            :value="
              msToHours(
                budgetActivityStore.totalAllocatedTimeForBudget(
                  budgetId.toString(),
                ),
              )
            "
            :max="msToHours(budgetStore.getAvailableTimeForBudget(budgetId))"
          ></progress>
        </div>
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
              <td class="flex space-x-2">
                <input
                  :value="msToHours(activity.allocatedTime)"
                  type="range"
                  class="range"
                  min="0"
                  :max="msToHours(remainingTime + activity.allocatedTime)"
                  @input="
                    budgetActivityStore.setAllocatedTime(
                      activity.id,
                      $event.target.value,
                    )
                  "
                />
              </td>
              <td>
                <input
                  :value="msToHours(activity.allocatedTime)"
                  type="number"
                  class="input input-bordered"
                  min="0"
                  :max="msToHours(remainingTime + activity.allocatedTime)"
                  @input="
                    budgetActivityStore.setAllocatedTime(
                      activity.id,
                      $event.target.value,
                    )
                  "
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--      config-->
      <div class="w-1/3">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          Name: <input v-model="budget.name" type="text" />
          <br />
          Duration Hours:
          <input
            :value="msToHours(budget.duration)"
            type="number"
            @input="
              budgetStore.setBudgetDurationInHours(
                budget.id,
                $event.target.value,
              )
            "
          />
          <br />
          Occupied time (sleep, work etc):
          <input
            :value="msToHours(budget.occupiedTime)"
            type="number"
            @input="
              budgetStore.setBudgetOccupiedTimeInHours(
                budget.id,
                $event.target.value,
              )
            "
          />
          <br />
          Activities:
          <ActivityPicker
            :activities="activityStore.activities"
            :multiple="false"
            @update:model-value="onActivitySelected"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
