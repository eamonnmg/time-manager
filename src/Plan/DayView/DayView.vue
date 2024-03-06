<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { TimeBlockWithActivity } from "@/types";
import HourDividerLines from "@/Plan/DayView/HourDividerLines.vue";
import TimeBlocks from "@/Plan/DayView/TimeBlocks.vue";
import { scaleTime } from "d3";
import { endOfDay, format, isWithinInterval, startOfDay } from "date-fns";
import { useTimeBlockStore } from "@/Plan/useTimeBlockStore";
import { usePointer, watchThrottled } from "@vueuse/core";
import { hoursToMs, msToHours, msToMinutes } from "@/Budget/budgetUtils";
import {
  getTimeBlockEnd,
  roundToNearest15Minutes,
  timeblocksBetweenDates,
} from "@/Plan/DayView/utils";

interface Props {
  day: Date;
  showTimesInMargin?: boolean;
  scrollPos: number;
}

const props = withDefaults(defineProps<Props>(), {
  showTimesInMargin: true,
});
const emit = defineEmits([
  "editTimeBlock",
  "timelineClicked",
  "createTimeBloclGhostClicked",
]);

const container = ref(null);
const containerOffset = ref(null);
const nowLine = ref(null);
const timeBlockStore = useTimeBlockStore();
const navHeight = 81;
const dayHeightPx = 2800;

const timeBlocks = computed<TimeBlockWithActivity[]>(() => {
  return timeBlockStore.timeBlocksWithActivityForDay(props.day);
});

onMounted(() => {
  if (nowLine.value) {
    setTimeout(() => {
      nowLine.value.scrollIntoView({ block: "center" });
    }, 200);
  }
});

const timeScale = computed(() => {
  // console.log("timeScale", [startOfDay(props.day), endOfDay(props.day)]);
  return scaleTime()
    .domain([startOfDay(props.day), endOfDay(props.day)])
    .range([0, dayHeightPx]);
});

//create timeblock at position
function onTimelineClick(e) {
  const time = timeScale.value.invert(e.offsetY + props.scrollPos);

  emit("timelineClicked", time);
  // timeBlockStore.add(timeBlock);
}

const ghostY = ref(0);
const ghostTime = ref(new Date());
const ghostStartLabel = computed(() => {
  return ghostTime.value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
});
const ghostEndLabel = computed(() => {
  return timeScale.value
    .invert(ghostY.value + ghostHeight.value)
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
});
const ghostHeight = ref(0);

const targetGhostTime = computed(() => {
  if (!container.value) {
    return new Date();
  }

  // if use clicking and dragging then we lock time and extend duration of block
  if (isPointerDown.value) {
    // return targetGhostTime.value;
    return ghostTime.value;
  }

  const ghostPxHeight =
    timeScale.value(new Date()) -
    timeScale.value(new Date(new Date().getTime() - hoursToMs(1)));
  const time = roundToNearest15Minutes(
    timeScale.value.invert(
      pointer.y.value + props.scrollPos - ghostPxHeight / 2,
    ),
  );

  return time;
});
const targetGhostY = computed(() => {
  return timeScale.value(targetGhostTime.value);
});

const targetGhostHeight = computed(function calculateGhostHeight() {
  let height =
    timeScale.value(new Date(targetGhostTime.value.getTime() + hoursToMs(1))) -
    timeScale.value(targetGhostTime.value);

  // click and drag behavior
  if (isPointerDown.value) {
    const pointerTimeDelta =
      roundToNearest15Minutes(
        timeScale.value.invert(pointerPos.value),
      ).getTime() - roundToNearest15Minutes(targetGhostTime.value).getTime();
    console.log("delta", pointerTimeDelta);

    height =
      timeScale.value(
        new Date(targetGhostTime.value.getTime() + pointerTimeDelta),
      ) - timeScale.value(targetGhostTime.value);
  }

  return height;
});

const targetGhostEndTime = computed(() => {
  return timeScale.value.invert(targetGhostY.value + targetGhostHeight.value);
});

const isHoveringTimeBlock = computed(() => {
  const pointerYDate = timeScale.value.invert(
    pointer.y.value + props.scrollPos,
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

const nearestTimeBlockAbovePointer = computed(() => {
  const pointerYDate = timeScale.value.invert(
    pointer.y.value + props.scrollPos,
  );
  const timeBlockAbove = timeBlocks.value
    .slice()
    .sort((tb1, tb2) => {
      return new Date(tb2.start) - new Date(tb1.start);
    })
    .find((timeBlock) => {
      return pointerYDate > getTimeBlockEnd(timeBlock);
    });

  console.log(
    "nearestTimeBlockAbovePointer",
    timeBlockAbove ? timeBlockAbove.activity.name : "none",
  );

  return timeBlockAbove;
});

const nearestTimeBlockBelowPointer = computed(() => {
  const pointerYDate = timeScale.value.invert(
    pointer.y.value + props.scrollPos,
  );
  const timeBlockBelow = timeBlocks.value
    .slice()
    .sort((tb1, tb2) => {
      return new Date(tb1.start) - new Date(tb2.start);
    })
    .find((timeBlock) => {
      return pointerYDate < new Date(timeBlock.start);
    });

  console.log(
    "nearestTimeBlockBelowPointer",
    timeBlockBelow ? timeBlockBelow.activity.name : "none",
  );

  return timeBlockBelow;
});

// find distance between nearest timeblocks above and below the pointer y position
// and determine if ghost can fit between them
const canTargetGhostFitBetweenTimeBlocks = computed(() => {
  if (
    nearestTimeBlockAbovePointer.value &&
    nearestTimeBlockBelowPointer.value
  ) {
    const distance = Math.abs(
      getTimeBlockEnd(nearestTimeBlockAbovePointer.value) -
        new Date(nearestTimeBlockBelowPointer.value.start),
    );
    return distance > hoursToMs(1);
  }

  return true;
});
const collisionBlockBelow = computed<TimeBlockWithActivity | undefined>(() => {
  return timeBlocks.value.find((timeBlock) => {
    const targetGhostEndDate = timeScale.value.invert(
      targetGhostY.value + targetGhostHeight.value,
    );

    return isWithinInterval(targetGhostEndDate, {
      start: new Date(timeBlock.start),
      end: getTimeBlockEnd(timeBlock),
    });
  });
});

const collisionBlockAbove = computed<TimeBlockWithActivity | undefined>(() => {
  return timeBlocks.value.find((timeBlock) => {
    const targetGhostStartDate = timeScale.value.invert(targetGhostY.value);

    return isWithinInterval(targetGhostStartDate, {
      start: new Date(timeBlock.start),
      end: getTimeBlockEnd(timeBlock),
    });
  });
});

const ghostDurationMs = computed<number>(() => {
  return (
    timeScale.value.invert(ghostY.value + ghostHeight.value).getTime() -
    ghostTime.value.getTime()
  );
});

const newTimeBlockGhost = computed(() => {
  return {
    y: ghostY.value,
    height: ghostHeight.value,
    startTimeLabel: ghostStartLabel.value,
    endTimeLabel: ghostEndLabel.value,
    durationLabel: calcDurationLable(ghostDurationMs.value),
    duration: ghostDurationMs.value,
    time: ghostTime.value,
  };
});

const shouldShowNewTimeBlockGhosts = computed(() => {
  return (
    pointer.isInside.value &&
    (!isHoveringTimeBlock.value || isPointerDown.value)
  );
});

const pointer = usePointer({
  target: container,
});

const isPointerDown = computed(() => pointer.pressure.value > 0);

function calcDurationLable(duration: number) {
  const mins = msToMinutes(duration);
  if (mins > 60) {
    return `${msToHours(duration)} hrs`;
  }

  return `${mins} mins`;
}

// watch ghostTime
watchThrottled(pointer.y, () => {
  updateGhost();
});

const pointerPos = computed(() => {
  return pointer.y.value + props.scrollPos;
});

const updateGhost = () => {
  if (isPointerDown.value) {
    const overlappedTimeBlocks = timeblocksBetweenDates(
      targetGhostTime.value,
      targetGhostEndTime.value,
      timeBlocks.value,
    );
    if (overlappedTimeBlocks.length > 0) {
      console.log("overlappedTimeBlocks", overlappedTimeBlocks.length);
      // time always stays the same - ie its lock at where drag started
      ghostTime.value = ghostTime.value;
      ghostY.value = ghostY.value;
      // height must be set to distance from targetGhostY to first timeblock start date inside the target
      ghostHeight.value =
        timeScale.value(new Date(overlappedTimeBlocks[0].start)) - ghostY.value;
      return;
    }

    ghostTime.value = targetGhostTime.value;
    ghostY.value = targetGhostY.value;
    ghostHeight.value = targetGhostHeight.value;

    return;
  }

  // if colliding with time block above and below
  // i.e. stuck between two time blocks
  // then the ghost time block should fill the space
  // if (collisionBlockBelow.value && collisionBlockAbove.value) {
  if (!canTargetGhostFitBetweenTimeBlocks.value) {
    ghostTime.value = getTimeBlockEnd(nearestTimeBlockAbovePointer.value);
    ghostY.value = timeScale.value(ghostTime.value);
    ghostHeight.value =
      timeScale.value(new Date(nearestTimeBlockBelowPointer.value.start)) -
      ghostY.value;

    return;
  }

  // if colliding with a time block below
  if (collisionBlockBelow.value) {
    ghostTime.value = new Date(
      new Date(collisionBlockBelow.value.start).getTime() - hoursToMs(1),
    );
    ghostY.value = timeScale.value(ghostTime.value);
    ghostHeight.value = targetGhostHeight.value;

    return;
  }

  // if colliding with a time block above
  if (collisionBlockAbove.value) {
    ghostTime.value = getTimeBlockEnd(collisionBlockAbove.value);
    ghostY.value = timeScale.value(ghostTime.value);
    ghostHeight.value = targetGhostHeight.value;

    return;
  }

  // if not colliding with another time block use target values
  ghostTime.value = targetGhostTime.value;
  ghostY.value = targetGhostY.value;

  ghostHeight.value = targetGhostHeight.value;
};

function clickGhost() {
  emit("createTimeBloclGhostClicked", newTimeBlockGhost.value);
}
</script>

<template>
  <div
    ref="container"
    class="flex test h-full flex-auto flex-col"
    :style="`height: ${dayHeightPx}px`"
    @click="onTimelineClick"
  >
    <div
      class="sticky flex z-50 justify-center border-b border-gray-100 top-0 bg-white z-10"
    >
      <time>
        {{ format(day, "EEEE") }}
      </time>
    </div>
    <div class="flex w-full flex-auto">
      <div
        class="flex-none bg-white"
        :class="{
          'w-14': showTimesInMargin,
        }"
      />
      <!--      <div class="grid flex-auto grid-cols-1 grid-rows-1">-->
      <!-- Horizontal lines -->

      <div class="relative w-full h-full">
        <HourDividerLines
          class="pointer-events-none"
          :day="day"
          :time-scale="timeScale"
          :show-times="showTimesInMargin"
        >
          <template #offset>
            <div ref="containerOffset" class="row-end-1 h-7"></div>
          </template>
        </HourDividerLines>

        <!--        only show if is within view-->
        <div
          v-if="
            timeScale(new Date()) < dayHeightPx && timeScale(new Date()) > 0
          "
          ref="nowLine"
          data-now-line
          class="absolute pointer-events-none z-10 h-[1px] w-full bg-red-500"
          :style="{
            transform: `translateY(${timeScale(new Date())}px)`,
          }"
        ></div>

        <!--        debug pointer position line-->
        <div
          v-if="false"
          data-pointer-line
          class="absolute pointer-events-none z-[100] h-[1px] w-full bg-blue-500"
          :style="{
            transform: `translateY(${pointerPos}px)`,
          }"
        ></div>

        <TimeBlocks
          :time-blocks="timeBlocks"
          :time-scale="timeScale"
          @edit-time-block="$emit('editTimeBlock', $event)"
        />
        <div
          v-show="shouldShowNewTimeBlockGhosts"
          class="absolute cursor-pointer transition-transform duration-100 left-0 z-40 w-full right-0 top-0 bottom-0 mt-px flex"
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
                <p class="font-semibold">Click to create new time block</p>
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
        <!--        debug ghost-->
        <div
          v-if="false"
          ref="createTimeBlockGhost"
          class="absolute opacity-70 z-50 transition-transform duration-100 left-0 w-full right-0 top-0 bottom-0 mt-px flex"
          :style="{
            height: `${targetGhostHeight}px`,
            transform: `translateY(${targetGhostY}px)`,
          }"
        >
          <div
            class="group border bg-white absolute inset-1 flex flex-col overflow-y-auto rounded-lg p-2 text-xs leading-5"
          >
            <!--            target ghost {{ targetGhostEndTime }}-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
