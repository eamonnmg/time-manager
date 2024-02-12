<script setup lang="ts">
import { ref } from "vue";
import AppHeader from "@/Plan/AppHeader.vue";
import DayView from "@/Plan/DayView/DayView.vue";
import TimeBlockActivityModal from "@/Plan/TimeBlockActivityModal.vue";
import { add, format, sub } from "date-fns";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { useTimeBlockStore } from "@/Plan/useTimeBlockStore";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";
import type { TimeBlock } from "@/types";

const timeBlockStore = useTimeBlockStore();
const showTimeBlockActivityModal = ref(false);

const activityStore = useActivitiesStore();

const currentDay = ref<Date>(new Date());

function nextDay() {
  currentDay.value = add(currentDay.value, { days: 1 });
}

function previousDay() {
  currentDay.value = sub(currentDay.value, { days: 1 });
}

function resetDay() {
  currentDay.value = new Date();
}
const selectedTimeBlock = ref<TimeBlock>(undefined);
function showEditTimeBlockModal(timeBlock: TimeBlock) {
  showTimeBlockActivityModal.value = true;
  selectedTimeBlock.value = timeBlock;
}
function roundToNearest15Minutes(date) {
  const minutes = date.getMinutes();
  const roundedMinutes = Math.round(minutes / 15) * 15;
  date.setMinutes(roundedMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}
function createTimeBlockAtTime(time: Date) {
  showTimeBlockActivityModal.value = true;
  selectedTimeBlock.value = {
    start: roundToNearest15Minutes(time),
    duration: 60 * 60 * 1000,
    activityId: "",
    color: "",
  };
}

function editTimeBlock(timeBlock: TimeBlock) {
  timeBlockStore.edit(timeBlock);
  selectedTimeBlock.value = undefined;
}

function removeTimeBlock(timeBlock: TimeBlock) {
  timeBlockStore.remove(timeBlock);
  selectedTimeBlock.value = undefined;
}
</script>

<template>
  <TimeBlockActivityModal
    v-if="showTimeBlockActivityModal"
    v-model:open="showTimeBlockActivityModal"
    :activities="activityStore.activities"
    :time-block="selectedTimeBlock"
    @add-time-block="timeBlockStore.add"
    @edit-time-block="editTimeBlock"
    @remove-time-block="removeTimeBlock"
  />
  <div class="flex h-full w-full flex-col">
    <AppHeader>
      <template #left>
        <h1 class="text-base font-semibold leading-6 text-gray-900">
          <time datetime="2022-01-22" class="sm:hidden">
            {{ format(currentDay, "MMM d, yyyy") }}
          </time>
          <time datetime="2022-01-22" class="hidden sm:inline"
            >{{ format(currentDay, "MMMM d, yyyy") }}
          </time>
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ format(currentDay, "eeee") }}
        </p>
      </template>
      <div class="flex items-center">
        <div
          class="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch"
        >
          <button
            type="button"
            class="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
            @click="previousDay"
          >
            <span class="sr-only">Previous day</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
            @click="resetDay"
          >
            Today
          </button>
          <span class="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
          <button
            type="button"
            class="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
            @click="nextDay"
          >
            <span class="sr-only">Next day</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <button
        type="button"
        class="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        @click="showTimeBlockActivityModal = true"
      >
        Add timeblock
      </button>
    </AppHeader>
    <div class="isolate flex flex-auto overflow-hidden bg-white">
      <DayView
        :day="currentDay"
        @editTimeBlock="showEditTimeBlockModal"
        @timeline-clicked="createTimeBlockAtTime"
      />
      <div v-if="true" class="border-l border-gray-100 w-0 md:w-[300px]">
        Active Budget Period info here
      </div>
    </div>
  </div>
</template>
