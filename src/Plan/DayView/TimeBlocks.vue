<script setup lang="ts">
import chroma from "chroma-js";
import type { TimeBlockWithActivity } from "@/types";
import { msToHours, msToMinutes } from "@/Budget/budgetUtils";
import type { ScaleTime } from "d3";
import { computed } from "vue";

interface Props {
  timeBlocks: TimeBlockWithActivity[];
  timeScale: ScaleTime<number, number>;
}

const emit = defineEmits([
  "editTimeBlock",
  "pointerLeaveTimeBlock",
  "pointerOverTimeBlock",
]);

/**
 * The data structure for an activity in the day view.
 */
interface TimeBlockViewObj extends TimeBlockWithActivity {
  y: number;
  height: number;
  startTimeLabel: string;
  endTimeLabel: string;
  durationLabel: string;
}

const props = defineProps<Props>();

const timeBlockViewObjs = computed<TimeBlockViewObj[]>(() => {
  return props.timeBlocks.map((timeBlock) =>
    timeBlockToDayViewTimeBlock(timeBlock),
  );
});

function timeBlockToDayViewTimeBlock(
  timeBlock: TimeBlockWithActivity,
): TimeBlockViewObj {
  console.log(props.timeScale(new Date()));

  function calcHeight() {
    let height =
      props.timeScale(
        new Date(new Date(timeBlock.start).getTime() + timeBlock.duration),
      ) - props.timeScale(new Date(timeBlock.start));

    // cut off height if exceeds container
    if (height + props.timeScale(new Date(timeBlock.start)) > 2800) {
      height = 2800 - props.timeScale(new Date(timeBlock.start));
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
    y: props.timeScale(new Date(timeBlock.start)),
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

function calcIdealTextColor(color: string) {
  if (!color) return "#000";
  // chroma throws error if color is not valid
  try {
    // use white text if contrast acceptable
    const contrast = chroma.contrast("#fff", color);
    return contrast - 4.5 >= 0 ? "white" : "black";
  } catch {
    return "black";
  }
}
</script>

<template>
  <!-- TimeBlocks -->
  <ol class="relative w-full">
    <li
      v-for="timeBlock in timeBlockViewObjs"
      :key="timeBlock.activity.name"
      :class="['absolute left-0 w-full right-0 top-0 bottom-0 mt-px flex']"
      :style="{
        height: `${timeBlock.height}px`,
        transform: `translateY(${timeBlock.y}px)`,
      }"
      @click.stop="() => $emit('editTimeBlock', timeBlock)"
    >
      <a
        href="#"
        :style="`background-color: ${
          timeBlock.activity.color
        }; color: ${calcIdealTextColor(timeBlock.activity.color)}`"
        :class="`group absolute inset-1 flex flex-col overflow-y-auto rounded-lg p-2 text-xs leading-5`"
      >
        <div class="flex justify-between w-full h-full">
          <div class="flex-col flex">
            <p class="order-1 font-semibold">
              {{ timeBlock.activity.name }}
            </p>
            <p class="">
              <time datetime="2022-01-22T06:00"
                >{{ timeBlock.startTimeLabel }} -
                {{ timeBlock.endTimeLabel }}</time
              >
            </p>
          </div>

          <div>
            {{ timeBlock.durationLabel }}
          </div>
        </div>
      </a>
    </li>
  </ol>
</template>

<style scoped></style>
