<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { TimeBlock, TimeBlockWithActivity } from "@/types";
import HourDividerLines from "@/Plan/DayView/HourDividerLines.vue";
import TimeBlocks from "@/Plan/DayView/TimeBlocks.vue";
import { scaleTime } from "d3";
import { endOfDay, startOfDay } from "date-fns";
import { useTimeBlockStore } from "@/Plan/useTimeBlockStore";
import chroma from "chroma-js";

import { msToHours, msToMinutes } from "@/Budget/budgetUtils";
// import { useElementSize } from "@vueuse/core";

interface Props {
  day: Date;
}

const props = defineProps<Props>();
const emit = defineEmits(["editTimeBlock", "timelineClicked"]);

/**
 * The data structure for an activity in the day view.
 */
interface DayViewTimeBlock extends TimeBlock {
  y: number;
  height: number;
  startTimeLabel: string;
  endTimeLabel: string;
  durationLabel: string;
}

const container = ref(null);
const containerNav = ref(null);
const containerOffset = ref(null);
const nowLine = ref(null);
const timeBlockStore = useTimeBlockStore();

const timeBlocks = computed<TimeBlockWithActivity[]>(() => {
  return timeBlockStore.timeBlocksWithActivityForDay(props.day);
});

function timeBlockToDayViewTimeBlock(timeBlock: TimeBlock): DayViewTimeBlock {
  console.log(timeScale.value(new Date()));

  function calcHeight() {
    let height =
      timeScale.value(
        new Date(new Date(timeBlock.start).getTime() + timeBlock.duration),
      ) - timeScale.value(new Date(timeBlock.start));

    // cut off height if exceeds container
    if (height + timeScale.value(new Date(timeBlock.start)) > 2800) {
      height = 2800 - timeScale.value(new Date(timeBlock.start));
    }

    return height;
  }

  function calcDurationLable() {
    const mins = msToMinutes(timeBlock.duration);
    if (mins > 60) {
      return `${msToHours(timeBlock.duration)} hrs`;
    }

    return `${mins} mins`;
  }

  return {
    ...timeBlock,
    y: timeScale.value(new Date(timeBlock.start)),
    height: calcHeight(),
    startTimeLabel: new Date(timeBlock.start).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    endTimeLabel: new Date(
      new Date(timeBlock.start).getTime() + timeBlock.duration,
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    durationLabel: calcDurationLable(),
  };
}

const dayViewTimeBlocks = computed(() => {
  return timeBlocks.value.map(timeBlockToDayViewTimeBlock);
});

onMounted(() => {
  nowLine.value.scrollIntoView({ block: "center" });
});

const timeScale = computed(() => {
  console.log("timeScale", [startOfDay(props.day), endOfDay(props.day)]);
  return scaleTime()
    .domain([startOfDay(props.day), endOfDay(props.day)])
    .range([0, 2800]);
});

//create timeblock at position
function onTimelineClick(e) {
  const time = timeScale.value.invert(e.offsetY + e.target.scrollTop);

  emit("timelineClicked", time);
  // timeBlockStore.add(timeBlock);
}

function calcIdealTextColor(color: string) {
  if (!color) return "#000";
  // chroma throws error if color is not valid
  try {
    const contrast = chroma.contrast("#fff", color);
    return Math.abs(4.5 - contrast) < 2 ? "white" : "black";
  } catch {
    return "black";
  }
}
</script>

<template>
  <div
    ref="container"
    class="flex test flex-auto flex-col overflow-auto"
    @click="onTimelineClick"
  >
    <div
      ref="containerNav"
      class="sticky top-0 z-10 grid flex-none grid-cols-7 bg-white text-xs text-gray-500 shadow ring-1 ring-black ring-opacity-5 md:hidden"
    ></div>
    <div class="flex w-full flex-auto">
      <div class="w-14 flex-none bg-white ring-1 ring-gray-100" />
      <!--      <div class="grid flex-auto grid-cols-1 grid-rows-1">-->
      <!-- Horizontal lines -->

      <div class="relative w-full h-full">
        <HourDividerLines :day="day" :time-scale="timeScale">
          <template #offset>
            <div ref="containerOffset" class="row-end-1 h-7"></div>
          </template>
        </HourDividerLines>

        <div
          ref="nowLine"
          class="absolute z-10 h-[1px] w-full bg-red-500"
          :style="{
            transform: `translateY(${timeScale(new Date())}px)`,
          }"
        ></div>

        <TimeBlocks :time-blocks="timeBlocks" :time-scale="timeScale" />
      </div>
    </div>
  </div>
</template>
