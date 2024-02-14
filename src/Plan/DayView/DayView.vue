<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { TimeBlockWithActivity } from "@/types";
import HourDividerLines from "@/Plan/DayView/HourDividerLines.vue";
import TimeBlocks from "@/Plan/DayView/TimeBlocks.vue";
import { scaleTime } from "d3";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
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
const navHeight = 81;

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
const ghostHeight = ref(0);
function calculateGhostHeight() {
  let height =
    timeScale.value(new Date(ghostTime.value.getTime() + hoursToMs(1))) -
    timeScale.value(ghostTime.value);

  const overlappingBottomTimeBlock = timeBlocks.value.find((timeBlock) => {
    return isWithinInterval(new Date(timeBlock.start), {
      start: ghostTime.value,
      end: new Date(ghostTime.value.getTime() + hoursToMs(1)),
    });
  });
  if (overlappingBottomTimeBlock) {
    height =
      timeScale.value(new Date(overlappingBottomTimeBlock.start)) -
      ghostY.value;
  }

  return height;
}

function getTimeBlockEnd(timeBlock) {
  return new Date(new Date(timeBlock.start).getTime() + timeBlock.duration);
}

function calculateGhostY() {
  let y = timeScale.value(ghostTime.value);
  const overlappingTopTimeBlock = timeBlocks.value.find((timeBlock) => {
    return isWithinInterval(getTimeBlockEnd(timeBlock), {
      start: ghostTime.value,
      end: new Date(ghostTime.value.getTime() + hoursToMs(1)),
    });
  });

  if (overlappingTopTimeBlock) {
    y = timeScale.value(getTimeBlockEnd(overlappingTopTimeBlock));
  }

  return y;
}

const isHoveringTimeBlock = computed(() => {
  const pointerYDate = timeScale.value.invert(
    pointer.y.value + container.value.scrollTop - navHeight,
  );
  const res = timeBlocks.value.some((timeBlock) => {
    return isWithinInterval(pointerYDate, {
      start: new Date(timeBlock.start),
      end: getTimeBlockEnd(timeBlock),
    });
  });
  console.log("isHoveringTimeBlock", res);
  return res;
});

// const ghostHeight = computed(() => {
//   let height =
//     timeScale.value(ghostTime.value.getTime() + hoursToMs(1)) -
//     timeScale.value(ghostTime.value);
//
//   // overlaps another timeblock reduce height to fit
//   console.log("test", new Date(ghostTime.value.getTime() + hoursToMs(1)));
//   const overlappingBottomTimeBlock = timeBlocks.value.find((timeBlock) => {
//     return (
//       new Date(timeBlock.start) <
//       new Date(ghostTime.value.getTime() + hoursToMs(1))
//     );
//   });
//   // timeBlockStore.timeBlocksWithActivityForDateRange(
//   //   ghostTime.value,
//   //   new Date(ghostTime.value.getTime() + hoursToMs(1) - 1),
//   // );
//
//   if (overlappingBottomTimeBlock) {
//     console.log(
//       "overlappingTimeBlock",
//       overlappingBottomTimeBlock.activity.name,
//     );
//     height =
//       timeScale.value(new Date(overlappingBottomTimeBlock.start)) -
//       ghostY.value;
//   }
//
//   return height;
// });

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

const shouldShowNewTimeBlockGhosts = computed(() => {
  return pointer.isInside.value && !isHoveringTimeBlock.value;
});

const pointer = usePointer({
  target: container,
});

watchThrottled(pointer.y, () => {
  updateGhost();
});

const updateGhost = () => {
  console.log("updateGhost");
  ghostTime.value = roundToNearest15Minutes(
    timeScale.value.invert(
      pointer.y.value + container.value.scrollTop - navHeight - 40,
    ),
  );
  ghostY.value = calculateGhostY();

  ghostHeight.value = calculateGhostHeight();

  ghostStartLabel.value = ghostTime.value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  ghostEndLabel.value = timeScale.value
    .invert(ghostY.value + ghostHeight.value)
    .toLocaleTimeString([], {
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
          v-show="shouldShowNewTimeBlockGhosts"
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
