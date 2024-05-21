<script setup lang="ts">
import AppHeader from "@/Plan/AppHeader.vue";
import { useBudgetStore } from "@/Budget/useBudgetStore";
import { useRoute } from "vue-router";
import ActivityPicker from "@/Activities/ActivityPicker.vue";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { useBudgetActivityStore } from "@/Budget/useBudgetActivityStore";
import { computed } from "vue";
import { calcPercentageOfTimeAllocated, msToHours } from "@/Budget/budgetUtils";
import { useBudgetPeriodStore } from "@/Budget/useBudgetPeriodStore";
import DurationInput from "@/shared/components/DurationInput.vue";
import BaseInput from "@/shared/components/BaseInput.vue";
import BudgetActivityStackedBarChart from "@/Budget/BudgetActivityStackedBarChart.vue";
import RadialProgress from "@/shared/components/RadialProgress.vue";

const budgetId = useRoute().params.budgetId;

const budgetStore = useBudgetStore();
const activityStore = useActivitiesStore();
const budgetActivityStore = useBudgetActivityStore();

const budget = budgetStore.getById(budgetId.toString());

const budgetActivities = computed(() => {
  return budgetActivityStore.getAllForBudget(budgetId.toString());
});

const totalBudgetTime = computed(() => {
  return budgetStore.getAvailableTimeForBudget(budgetId);
});

const remainingTime = computed(() => {
  return budgetActivityStore.remainingTimeForBudget(budgetId.toString());
});

const totalPercentageOfBudgetTimeAllocated = computed(() => {
  return (
    ((budget.duration - remainingTime.value) /
      (budget.duration - budget.occupiedTime)) *
    100
  ).toFixed(0);
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

const budgetPeriodStore = useBudgetPeriodStore();
function apply() {
  if (budgetPeriodStore.activePeriod) {
    alert("Another budget is currently active");
  }
  budgetPeriodStore.create({
    budgetId: budgetId.toString(),
    startDate: new Date(),
  });
}
</script>

<template>
  <div class="flex h-full w-full flex-col">
    <AppHeader>
      <template #left>
        <div class="flex items-center space-x-2">
          <RouterLink
            class="text-xl hover:underline"
            :to="{ name: 'budgetIndex' }"
          >
            Budgets
          </RouterLink>
          <span>/</span>
          <h1 class="text-xl font-semibold leading-6 text-gray-900">
            {{ budgetStore.getById(budgetId.toString()).name }}
          </h1>
        </div>
        <p class="mt-2 text-sm text-gray-700">
          A budget defines how you want to allocate your time for a period
        </p>
      </template>
      <template #default>
        <button
          v-if="!budgetStore.isActive(budgetId)"
          class="btn btn-primary"
          @click="apply"
        >
          Activate
        </button>
        <span v-else class="badge badge-info">Active</span>
      </template>
    </AppHeader>
    <!--    // activies-->
    <div class="px-4 relative h-full divide-x space-x-4 flex">
      <div class="w-2/3 relative flex flex-col divide-y space-y-4">
        <div class="w-full py-4 flex items-center">
          <div class="w-full">
            <p>
              {{ totalPercentageOfBudgetTimeAllocated }}% total time allocated
            </p>
            <BudgetActivityStackedBarChart
              :total-time-ms="totalBudgetTime"
              :budget-activities="budgetActivities"
            />
          </div>
        </div>
        <div class="w-full py-4 flex items-center">
          <ActivityPicker
            class=""
            label="Add activity"
            :activities="activityStore.activities"
            :multiple="false"
            @update:model-value="onActivitySelected"
          />
        </div>
        <table class="table">
          <tbody>
            <!-- row 1 -->
            <tr v-for="activity in budgetActivities" :key="activity.id">
              <td>{{ activity.activity.name }}</td>
              <td>
                <RadialProgress
                  class=""
                  :value="
                    calcPercentageOfTimeAllocated(
                      activity.allocatedTime,
                      totalBudgetTime,
                    )
                  "
                />
              </td>
              <td class="">
                <input
                  :value="msToHours(activity.allocatedTime)"
                  type="range"
                  class="range range-xs"
                  :style="`--range-shdw: ${activity.activity.color}`"
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
                <!--                todo add plus and neg buttons beside-->
                <BaseInput
                  :value="msToHours(activity.allocatedTime)"
                  type="number"
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
          <div class="space-y-2">
            <label for="budgetName">Name</label>
            <BaseInput id="budgetName" v-model="budget.name" type="text" />
          </div>
          <br />
          <!--                    Duration Hours:-->
          <!--                    <input-->
          <!--                      :value="msToHours(budget.duration)"-->
          <!--                      type="number"-->
          <!--                      @input="-->
          <!--                        budgetStore.setBudgetDurationInHours(-->
          <!--                          budget.id,-->
          <!--                          $event.target.value,-->
          <!--                        )-->
          <!--                      "-->
          <!--                    />-->
          <DurationInput
            label="Duration"
            :milliseconds="budget.duration"
            @update:milliseconds="
              budgetStore.setBudgetDuration(budget.id, $event)
            "
          />
          <br />

          <DurationInput
            label="Occupied time"
            :milliseconds="budget.occupiedTime"
            @update:milliseconds="
              budgetStore.setBudgetOccupiedTime(budget.id, $event)
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
