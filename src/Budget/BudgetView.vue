<script setup lang="ts">
import AppHeader from "@/Plan/AppHeader.vue";
import { useBudgetStore } from "@/Budget/useBudgetStore";
import { useRoute } from "vue-router";
import ActivityPicker from "@/Activities/ActivityPicker.vue";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { useBudgetActivityStore } from "@/Budget/useBudgetActivityStore";
import { computed, ref } from "vue";
import { calcPercentageOfTimeAllocated, msToHours } from "@/Budget/budgetUtils";
import { useBudgetPeriodStore } from "@/Budget/useBudgetPeriodStore";
import DurationInput from "@/shared/components/DurationInput.vue";
import BaseInput from "@/shared/components/BaseInput.vue";
import BudgetActivityAllocationChart from "@/Budget/BudgetActivityAllocationChart.vue";
import RadialProgress from "@/shared/components/RadialProgress.vue";
import ActivateBudgetPeriodModal from "@/Budget/ActivateBudgetPeriodModal.vue";
import { calcIdealTextColorFromBg } from "@/shared/utils/colors";

const budgetId = useRoute().params.budgetId as string;

const budgetStore = useBudgetStore();
const activityStore = useActivitiesStore();
const budgetActivityStore = useBudgetActivityStore();

const hoveredActivityId = ref(null);

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
    ((budget.duration - remainingTime.value) / budget.duration) *
    100
  ).toFixed(0);
});

function onActivitySelected(e) {
  budgetActivityStore.add(budgetId.toString(), e.id);
}

const budgetPeriodStore = useBudgetPeriodStore();
const showActivateBudgetModal = ref(false);
function activateBudgetPeriod() {
  showActivateBudgetModal.value = true;
  // if (budgetPeriodStore.activePeriod) {
  //   alert("Another budget is currently active");
  // }
  // budgetPeriodStore.create({
  //   budgetId: budgetId.toString(),
  //   startDate: new Date(),
  // });
}

const endBudgetPeriod = () => {
  budgetPeriodStore.endActivePeriod();
};
</script>

<template>
  <ActivateBudgetPeriodModal
    v-if="showActivateBudgetModal"
    :budget="budget"
    @close="showActivateBudgetModal = false"
  />
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
          <span v-if="budgetStore.isActive(budgetId)" class="badge badge-info"
            >Active
          </span>
        </div>
        <p class="mt-2 text-sm text-gray-700">
          A budget defines how you want to allocate your time for a period
        </p>
      </template>
      <template #default>
        <button class="btn btn-primary" @click="activateBudgetPeriod">
          Activate
        </button>
      </template>
    </AppHeader>
    <!--    // activies-->
    <div class="px-4 relative h-full divide-x space-x-4 flex">
      <div class="w-2/3 relative flex flex-col divide-y space-y-4">
        <div
          v-if="budgetActivities.length"
          class="w-full py-4 flex items-center"
        >
          <div class="w-full">
            <p>
              {{ totalPercentageOfBudgetTimeAllocated }}% total time allocated
            </p>
            <BudgetActivityAllocationChart
              :total-time-ms="totalBudgetTime"
              :budget-activities="budgetActivities"
              :active-activity-id="hoveredActivityId"
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
            <tr
              v-for="activity in budgetActivities"
              :key="activity.id"
              @mouseover="hoveredActivityId = activity.id"
              @mouseleave="hoveredActivityId = null"
            >
              <td>{{ activity.activity.name }}</td>
              <td>
                <RadialProgress
                  class="radial-progress border-4"
                  :style="{
                    color: calcIdealTextColorFromBg(activity.activity.color),
                    background: activity.activity.color,
                    borderColor: activity.activity.color,
                    '--size': '3rem',
                  }"
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
                <div class="flex w-36 items-center space-x-2">
                  <button
                    class="btn btn-sm btn-ghost btn-circle"
                    :disabled="activity.allocatedTime === 0"
                    @click="
                      budgetActivityStore.decrementAllocatedTime(activity.id)
                    "
                  >
                    -
                  </button>

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
                  <button
                    class="btn btn-sm btn-ghost btn-circle"
                    :disabled="remainingTime < msToHours(1)"
                    @click="
                      budgetActivityStore.incrementAllocatedTime(activity.id)
                    "
                  >
                    +
                  </button>
                </div>
              </td>
              <td class="text-end">
                <button
                  data-tip="Remove activity"
                  class="btn btn-sm btn-ghost tooltip"
                  @click="budgetActivityStore.remove(activity.id)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
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
