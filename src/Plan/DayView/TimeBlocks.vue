<script setup lang="ts">
import type { BudgetPeriod, TimeBlockWithActivity } from "@/shared/types";
import { msToHours, msToMinutes } from "@/Budget/budgetUtils";
import type { ScaleTime } from "d3";
import { computed } from "vue";
import { calcIdealTextColorFromBg } from "@/shared/utils/colors";
import { useTimeBlockStore } from "@/Plan/useTimeBlockStore";

interface Props {
  timeBlocks: TimeBlockWithActivity[];
  timeScale: ScaleTime<number, number>;
}

const emit = defineEmits([
  "editTimeBlock",
  "pointerLeaveTimeBlock",
  "pointerOverTimeBlock",
]);

const timeblockStore = useTimeBlockStore();

/**
 * The data structure for an activity in the day view.
 */
interface TimeBlockViewObj extends TimeBlockWithActivity {
  y: number;
  height: number;
  startTimeLabel: string;
  endTimeLabel: string;
  durationLabel: string;
  budgetPeriod?: BudgetPeriod;
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
  function calcHeight() {
    let height =
      props.timeScale(
        new Date(new Date(timeBlock.start).getTime() + timeBlock.duration),
      ) - props.timeScale(new Date(timeBlock.start));

    // cut off height if exceeds container. eg start time is 23:30 and goes on into the A.M.
    if (height + props.timeScale(new Date(timeBlock.start)) > 2800) {
      height = 2800 - props.timeScale(new Date(timeBlock.start));
    }

    // if timeblocks starts yesterday, then subtract the overflowing y from height
    if (props.timeScale(new Date(timeBlock.start)) < 0) {
      height = height + props.timeScale(new Date(timeBlock.start));
    }

    return height;
  }

  function calcY() {
    const y = props.timeScale(new Date(timeBlock.start));
    return y < 0 ? 0 : y;
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
    y: calcY(),
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
    budgetPeriod: timeblockStore.getTimeBlockBudgetPeriod(timeBlock),
  };
}
</script>

<template>
  <!-- TimeBlocks -->
  <ol class="relative w-full">
    <li
      v-for="timeBlock in timeBlockViewObjs"
      :key="timeBlock.activity.name"
      class="absolute cursor-pointer py-[1px] px-0.5 left-0 w-full right-0 top-0 bottom-0 mt-px flex"
      :style="{
        height: `${timeBlock.height}px`,
        transform: `translateY(${timeBlock.y}px)`,
      }"
      @click="() => $emit('editTimeBlock', timeBlock)"
    >
      <div
        :style="`background-color: ${
          timeBlock.activity.color
        }; color: ${calcIdealTextColorFromBg(timeBlock.activity.color)}`"
        class="group relative size-full flex flex-col overflow-y-auto rounded-lg text-xs leading-5"
      >
        <div
          v-if="timeBlock.budgetPeriod"
          data-tip="test"
          class="bg-blue-300 px-1 text-[0.7rem] rounded-t-lg w-full border-b border-white"
        >
          {{ timeBlock.budgetPeriod.budget.name }}
        </div>
        <div class="flex flex-col justify-between p-2 w-full h-full">
          <div class="flex-col flex">
            <p class="font-semibold">
              {{ timeBlock.activity.name }}
            </p>
            <p class="">
              <time datetime="2022-01-22T06:00"
                >{{ timeBlock.startTimeLabel }} -
                {{ timeBlock.endTimeLabel }}</time
              >
            </p>
            <div>
              {{ timeBlock.durationLabel }}
            </div>
          </div>
        </div>
      </div>
    </li>
  </ol>
</template>

<style scoped></style>
