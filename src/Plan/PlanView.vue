<script setup lang="ts">
import { computed, ref } from "vue";
import AppHeader from "@/Plan/AppHeader.vue";
import DayView from "@/Plan/DayView/DayView.vue";
import TimeBlockActivityModal from "@/Plan/TimeBlockActivityModal.vue";
import {
  add,
  eachDayOfInterval,
  endOfDay,
  format,
  lastDayOfWeek,
  startOfDay,
  sub,
  subDays,
} from "date-fns";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { useTimeBlockStore } from "@/Plan/useTimeBlockStore";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";
import type { BudgetActivityWithActivity, TimeBlock } from "@/types";
import { useBudgetPeriodStore } from "@/Budget/useBudgetPeriodStore";
import { useBudgetActivityStore } from "@/Budget/useBudgetActivityStore";
import { msToHours, msToMinutes } from "../Budget/budgetUtils";
import {
  useLocalStorage,
  useScroll,
  useToggle,
  type VueInstance,
} from "@vueuse/core";
import { ChartPieIcon } from "@heroicons/vue/24/outline";
import WeekView from "@/Plan/WeekView/WeekView.vue";
import HourDividerLines from "@/Plan/DayView/HourDividerLines.vue";
import { scaleTime } from "d3";
import TimeAxisLables from "@/Plan/DayView/TimeAxisLables.vue";

const timeBlockStore = useTimeBlockStore();
const budgetPeriodStore = useBudgetPeriodStore();
const showTimeBlockActivityModal = ref(false);
const calendarScrollContainer = ref<HTMLElement | null>(null);
const dayHeightPx = ref(2800);
const navContainer = ref<VueInstance | null>(null);

const { y: calendarScrollContainerScrollOffset } = useScroll(
  calendarScrollContainer,
);

const scrollOffset = computed(() => {
  if (!navContainer.value) {
    return 0;
  }
  const dayLabelHeight = 25;
  return (
    calendarScrollContainerScrollOffset.value -
    navContainer.value.$el.offsetHeight -
    dayLabelHeight
  );
});

const activityStore = useActivitiesStore();

const currentDay = ref<Date>(new Date());

const lastDayOfCurrentWeek = computed(() => {
  return lastDayOfWeek(currentDay.value);
});

const showBudgetPeriodSideBar = ref(false);
const toggleBudgetPeriodSidebar = useToggle(showBudgetPeriodSideBar);

function nextDay() {
  currentDay.value = add(currentDay.value, { days: 1 });
}

function previousDay() {
  currentDay.value = sub(currentDay.value, { days: 1 });
}

function nextWeek() {
  currentDay.value = add(currentDay.value, { weeks: 1 });
}

function previousWeek() {
  currentDay.value = sub(currentDay.value, { weeks: 1 });
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

function createTimeBlockFromGhost(ghost) {
  showTimeBlockActivityModal.value = true;
  selectedTimeBlock.value = {
    start: ghost.time,
    duration: ghost.duration,
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

const budgetActivityStore = useBudgetActivityStore();
const budgetActivities = computed<BudgetActivityWithActivity[]>(() => {
  const budgetId = budgetPeriodStore.activePeriod?.budgetId;
  if (!budgetId) {
    return [];
  }
  return budgetActivityStore.getAllForBudget(budgetId);
});

const view = useLocalStorage<"day" | "week">("plan-view", "week");
// date obj to create time scale
const timeScaleDay = new Date();
const timeScale = computed(() => {
  return scaleTime()
    .domain([startOfDay(timeScaleDay), endOfDay(timeScaleDay)])
    .range([0, 2800]);
});
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
    <AppHeader ref="navContainer">
      <template #left>
        <h1 class="text-base font-semibold leading-6 text-gray-900">
          <time datetime="2022-01-22">
            {{ format(currentDay, "MMM d, yyyy") }}
            <span v-if="view === 'week'">
              - {{ format(lastDayOfCurrentWeek, "MMM d, yyyy") }}</span
            >
          </time>
        </h1>
        <p class="mt-1 h-6 text-sm text-gray-500">
          <span v-if="view === 'day'"> {{ format(currentDay, "eeee") }}</span>
          <span v-if="view === 'week'"> Sunday - Saturday</span>
        </p>
      </template>
      <div class="flex space-x-2 items-center">
        <div class="join">
          <input
            id="day"
            v-model="view"
            name="view"
            class="join-item btn !bg-none btn-sm w-14"
            type="radio"
            value="day"
            aria-label="Day"
          />
          <input
            id="week"
            v-model="view"
            name="view"
            class="join-item btn !bg-none btn-sm w-14"
            type="radio"
            value="week"
            aria-label="Week"
          />
        </div>

        <div
          v-if="view === 'day'"
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
        <div
          v-if="view === 'week'"
          class="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch"
        >
          <button
            type="button"
            class="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
            @click="previousWeek"
          >
            <span class="sr-only">Previous week</span>
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
            @click="nextWeek"
          >
            <span class="sr-only">Next week</span>
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
      <button
        v-if="budgetPeriodStore.activePeriod"
        type="button"
        class="btn btn-sm btn-ghost"
        @click="toggleBudgetPeriodSidebar()"
      >
        <ChartPieIcon class="h-6 w-6" />
      </button>
    </AppHeader>
    <div
      ref="calendarScrollContainer"
      :style="`height: ${dayHeightPx}px`"
      class="w-full relative flex flex-auto overflow-auto bg-white"
    >
      <TimeAxisLables
        :style="`height: ${dayHeightPx}px`"
        class="mt-[18px]"
        :time-scale="timeScale"
      />
      <div class="relative size-full">
        <div class="absolute top-[25px] w-full">
          <HourDividerLines
            class="pointer-events-none"
            :day="timeScaleDay"
            :time-scale="timeScale"
          >
          </HourDividerLines>
        </div>
        <DayView
          v-if="view === 'day'"
          :day="currentDay"
          :scroll-pos="scrollOffset"
          @editTimeBlock="showEditTimeBlockModal"
          @timeline-clicked="createTimeBlockAtTime"
          @createTimeBloclGhostClicked="createTimeBlockFromGhost"
        />
        <WeekView
          v-if="view === 'week'"
          :scroll-pos="scrollOffset"
          :last-day-of-week="lastDayOfCurrentWeek"
          @createTimeBloclGhostClicked="createTimeBlockFromGhost"
          @editTimeBlock="showEditTimeBlockModal"
        />
      </div>

      <div
        v-if="budgetPeriodStore.activePeriod && showBudgetPeriodSideBar"
        class="sticky top-0 border-l p-4 overflow-auto border-gray-100 w-0 md:w-[400px]"
      >
        <h3 class="text-2xl flex items-center">
          Active Budget
          <button class="badge badge-accent ml-4">
            {{ budgetPeriodStore.activePeriod.budget.name }}
          </button>
        </h3>

        <div class="flex flex-col">
          <ul>
            <li
              v-for="budgetActivity in budgetActivities"
              :key="budgetActivity.id"
              class="flex justify-between"
            >
              <div>{{ budgetActivity.activity.name }}</div>
              <div>
                {{
                  msToHours(
                    budgetPeriodStore.totalAllocatedTimeForBudgetActivityInPeriod(
                      budgetActivity,
                    ),
                  )
                }}
                of {{ msToHours(budgetActivity.allocatedTime) }} hours allocated
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
