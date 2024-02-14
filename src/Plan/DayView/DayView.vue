<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { TimeBlockWithActivity } from "@/types";
import HourDividerLines from "@/Plan/DayView/HourDividerLines.vue";
import TimeBlocks from "@/Plan/DayView/TimeBlocks.vue";
import { scaleTime } from "d3";
import { endOfDay, startOfDay } from "date-fns";
import { useTimeBlockStore } from "@/Plan/useTimeBlockStore";
import {
  useDebounceFn,
  usePointer,
  useRafFn,
  useThrottleFn,
  watchThrottled,
} from "@vueuse/core";
import { hoursToMs } from "@/Budget/budgetUtils";

interface Props {
  day: Date;
}

const props = defineProps<Props>();
const emit = defineEmits(["editTimeBlock", "timelineClicked"]);

const container = ref(null);
const containerOffset = ref(null);
const nowLine = ref(null);
const timeBlockStore = useTimeBlockStore();

const timeBlocks = computed<TimeBlockWithActivity[]>(() => {
  return timeBlockStore.timeBlocksWithActivityForDay(props.day);
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

function roundToNearest15Minutes(date) {
  const minutes = date.getMinutes();
  const roundedMinutes = Math.round(minutes / 15) * 15;
  date.setMinutes(roundedMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

const ghostY = ref(0);
const ghostTime = ref(new Date());
const ghostStartLabel = ref("");
const ghostEndLabel = ref("");

const ghostHeight = computed(() => {
  return (
    timeScale.value(ghostTime.value.getTime() + hoursToMs(1)) -
    timeScale.value(ghostTime.value)
  );
});

const newTimeBlockGhost = computed(() => {
  // console.log(
  //   "pointerPosition",
  //   timeScale.value.invert(pointerPosition.y.value),
  // );
  return {
    y: ghostY.value,
    height: ghostHeight.value,
    startTimeLabel: ghostStartLabel.value,
    endTimeLabel: ghostEndLabel.value,
    durationLabel: "1 hr",
  };
});

const shouldShowNewTimeBlockGhosts = ref(false);

const pointer = usePointer({
  target: container,
});

watchThrottled(pointer.y, () => {
  updateGhost();
});

const updateGhost = () => {
  console.log("updateGhost");
  shouldShowNewTimeBlockGhosts.value = true;
  ghostTime.value = roundToNearest15Minutes(
    timeScale.value.invert(
      pointer.y.value + container.value.scrollTop - ghostHeight.value,
    ),
  );
  ghostY.value = timeScale.value(ghostTime.value);
  ghostStartLabel.value = ghostTime.value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  ghostEndLabel.value = new Date(
    ghostTime.value.getTime() + 60 * 60 * 1000,
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
// function onPointerOver(e) {
//   shouldShowNewTimeBlockGhosts.value = true;
//   const time = roundToNearest15Minutes(
//     timeScale.value.invert(e.offsetY + e.target.scrollTop),
//   );
//   ghostY.value = timeScale.value(time);
//
//   console.log("onPointerOver", time);
// }

function onPointerOut(e) {
  console.log("onPointerOut");
  shouldShowNewTimeBlockGhosts.value = false;
}

function clickGhost() {
  alert("clickGhost");
}
</script>

<template>
  <div
    ref="container"
    class="flex test flex-auto flex-col overflow-auto"
    @click="onTimelineClick"
  >
    <div class="flex w-full flex-auto">
      <div class="w-14 flex-none bg-white ring-1 ring-gray-100" />
      <!--      <div class="grid flex-auto grid-cols-1 grid-rows-1">-->
      <!-- Horizontal lines -->

      <div class="relative w-full h-full">
        <HourDividerLines
          class="pointer-events-none"
          :day="day"
          :time-scale="timeScale"
        >
          <template #offset>
            <div ref="containerOffset" class="row-end-1 h-7"></div>
          </template>
        </HourDividerLines>

        <div
          ref="nowLine"
          class="absolute pointer-events-none z-10 h-[1px] w-full bg-red-500"
          :style="{
            transform: `translateY(${timeScale(new Date())}px)`,
          }"
        ></div>

        <TimeBlocks :time-blocks="timeBlocks" :time-scale="timeScale" />
        <div
          v-show="pointer.isInside.value"
          :class="[
            'absolute  transition-transform duration-100  left-0 z-50 w-full right-0 top-0 bottom-0 mt-px flex',
          ]"
          :style="{
            height: `${newTimeBlockGhost.height}px`,
            transform: `translateY(${newTimeBlockGhost.y}px)`,
          }"
          @click.stop="clickGhost"
        >
          <div
            class="group bg-gray-50 absolute inset-1 flex flex-col overflow-y-auto rounded-lg p-2 text-xs leading-5"
          >
            <div class="flex justify-between w-full h-full">
              <div class="flex-col flex">
                <p class="order-1 font-semibold">
                  Click to create new time block
                </p>
                <p class="">
                  <time datetime="2022-01-22T06:00"
                    >{{ newTimeBlockGhost.startTimeLabel }} -
                    {{ newTimeBlockGhost.endTimeLabel }}</time
                  >
                </p>
              </div>

              <div>
                {{ newTimeBlockGhost.durationLabel }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
