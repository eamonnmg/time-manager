<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { TimeBlock, TimeBlockWithActivity } from "@/types";
import HourDividerLines from "@/Plan/DayView/HourDividerLines.vue";
import { scaleTime } from "d3";
import { endOfDay, startOfDay } from "date-fns";
import { useTimeBlockStore } from "@/Plan/useTimeBlockStore";
// import { useElementSize } from "@vueuse/core";

interface Props {
  day: Date;
}

const props = defineProps<Props>();

/**
 * The data structure for an activity in the day view.
 */
interface DayViewTimeBlock extends TimeBlock {
  y: number;
  height: number;
  startTimeLabel: string;
}

const container = ref(null);
const containerNav = ref(null);
const containerOffset = ref(null);
const nowLine = ref(null);
const timeBlockStore = useTimeBlockStore();

const timeBlocks = computed<TimeBlockWithActivity[]>(() => {
  return timeBlockStore.timeBlocksWithActivityForDay(props.day);
});

const startGridOffsetRows = 3;
// const rows = 288 + startGridOffsetRows; // break 24 hour day into 288 5 minute segments

// function timeBlockToDayViewTimeBlock(timeBlock: TimeBlock): DayViewTimeBlock {
//   const startHour = new Date(timeBlock.start).getHours();
//   const startMinute = new Date(timeBlock.start).getMinutes();
//   const endHour = new Date(timeBlock.end).getHours();
//   const endMinute = new Date(timeBlock.end).getMinutes();
//
//   const startMin = startHour * 60 + startMinute;
//   const endMin = endHour * 60 + endMinute;
//
//   const startRow = Math.round(startMin / 5);
//   const duration = Math.round((endMin - startMin) / 5);
//
//   return {
//     ...timeBlock,
//     row: startRow + startGridOffsetRows,
//     span: duration,
//     startTimeLabel: new Date(timeBlock.start).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     }),
//   };
// }

function timeBlockToDayViewTimeBlock(timeBlock: TimeBlock): DayViewTimeBlock {
  // const startHour = new Date(timeBlock.start).getHours();
  // const startMinute = new Date(timeBlock.start).getMinutes();
  // const endHour = new Date(timeBlock.end).getHours();
  // const endMinute = new Date(timeBlock.end).getMinutes();
  //
  // const startMin = startHour * 60 + startMinute;
  // const endMin = endHour * 60 + endMinute;
  //
  // const startRow = Math.round(startMin / 5);
  // const duration = Math.round((endMin - startMin) / 5);

  console.log(timeScale.value(new Date()));

  return {
    ...timeBlock,
    y: timeScale.value(new Date(timeBlock.start)),
    height:
      timeScale.value(new Date(timeBlock.end)) -
      timeScale.value(new Date(timeBlock.start)),
    startTimeLabel: new Date(timeBlock.start).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

const dayViewTimeBlocks = computed(() => {
  return timeBlocks.value.map(timeBlockToDayViewTimeBlock);
});

onMounted(() => {
  nowLine.value.scrollIntoView({ block: "center" });
});

// const scrollHeight = computed(() => {
//   if (!container.value) {
//     return 0;
//   }
//   return container.value?.clientHeight;
// });

// const { height } = useElementSize(container);

const timeScale = computed(() => {
  console.log("timeScale", [startOfDay(props.day), endOfDay(props.day)]);
  return scaleTime()
    .domain([startOfDay(props.day), endOfDay(props.day)])
    .range([0, 2800]);
});
</script>

<template>
  <div ref="container" class="flex test flex-auto flex-col overflow-auto">
    <div
      ref="containerNav"
      class="sticky top-0 z-10 grid flex-none grid-cols-7 bg-white text-xs text-gray-500 shadow ring-1 ring-black ring-opacity-5 md:hidden"
    >
      <!--      <button type="button" class="flex flex-col items-center pb-1.5 pt-3">-->
      <!--        <span>W</span>-->
      <!--        &lt;!&ndash; Default: "text-gray-900", Selected: "bg-gray-900 text-white", Today (Not Selected): "text-indigo-600", Today (Selected): "bg-indigo-600 text-white" &ndash;&gt;-->
      <!--        <span-->
      <!--          class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"-->
      <!--          >19</span-->
      <!--        >-->
      <!--      </button>-->
      <!--      <button type="button" class="flex flex-col items-center pb-1.5 pt-3">-->
      <!--        <span>T</span>-->
      <!--        <span-->
      <!--          class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-indigo-600"-->
      <!--          >20</span-->
      <!--        >-->
      <!--      </button>-->
      <!--      <button type="button" class="flex flex-col items-center pb-1.5 pt-3">-->
      <!--        <span>F</span>-->
      <!--        <span-->
      <!--          class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"-->
      <!--          >21</span-->
      <!--        >-->
      <!--      </button>-->
      <!--      <button type="button" class="flex flex-col items-center pb-1.5 pt-3">-->
      <!--        <span>S</span>-->
      <!--        <span-->
      <!--          class="mt-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-base font-semibold text-white"-->
      <!--          >22</span-->
      <!--        >-->
      <!--      </button>-->
      <!--      <button type="button" class="flex flex-col items-center pb-1.5 pt-3">-->
      <!--        <span>S</span>-->
      <!--        <span-->
      <!--          class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"-->
      <!--          >23</span-->
      <!--        >-->
      <!--      </button>-->
      <!--      <button type="button" class="flex flex-col items-center pb-1.5 pt-3">-->
      <!--        <span>M</span>-->
      <!--        <span-->
      <!--          class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"-->
      <!--          >24</span-->
      <!--        >-->
      <!--      </button>-->
      <!--      <button type="button" class="flex flex-col items-center pb-1.5 pt-3">-->
      <!--        <span>T</span>-->
      <!--        <span-->
      <!--          class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"-->
      <!--          >25</span-->
      <!--        >-->
      <!--      </button>-->
    </div>
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
          class="absolute h-[1px] w-full bg-red-500"
          :style="{
            transform: `translateY(${timeScale(new Date())}px)`,
          }"
        ></div>

        <!-- Events -->
        <ol class="relative w-full">
          <li
            v-for="timeBlock in dayViewTimeBlocks"
            :key="timeBlock.activity.name"
            :class="[
              'absolute left-0 w-full right-0 top-0 bottom-0 mt-px flex',
              timeBlock.activity.color,
            ]"
            :style="{
              height: `${timeBlock.height}px`,
              transform: `translateY(${timeBlock.y}px)`,
            }"
          >
            <a
              href="#"
              :class="`group absolute inset-1 flex flex-col overflow-y-auto rounded-lg ${timeBlock.activity.color} p-2 text-xs leading-5`"
            >
              <p class="order-1 font-semibold text-blue-700">
                {{ timeBlock.activity.name }}
              </p>
              <p class="text-blue-500 group-hover:text-blue-700">
                <time datetime="2022-01-22T06:00">{{
                  timeBlock.startTimeLabel
                }}</time>
              </p>
            </a>
          </li>
        </ol>
      </div>

      <!--        <ol-->
      <!--          class="col-start-1 col-end-2 row-start-1 grid grid-cols-1"-->
      <!--          :style="`grid-template-rows: repeat(${rows}, minmax(0, 1fr)) auto`"-->
      <!--        >-->
      <!--          <li-->
      <!--            v-for="timeBlock in dayViewTimeBlocks"-->
      <!--            :key="timeBlock.name"-->
      <!--            class="relative mt-px flex"-->
      <!--            :style="`grid-row: ${timeBlock.row} / span ${timeBlock.span}; grid-column: 1;`"-->
      <!--          >-->
      <!--            <a-->
      <!--              href="#"-->
      <!--              :class="`group absolute inset-1 flex flex-col overflow-y-auto rounded-lg ${timeBlock.color} p-2 text-xs leading-5`"-->
      <!--            >-->
      <!--              <p class="order-1 font-semibold text-blue-700">-->
      <!--                {{ timeBlock.name }}-->
      <!--              </p>-->
      <!--              <p class="text-blue-500 group-hover:text-blue-700">-->
      <!--                <time datetime="2022-01-22T06:00">{{-->
      <!--                  timeBlock.startTimeLabel-->
      <!--                }}</time>-->
      <!--              </p>-->
      <!--            </a>-->
      <!--          </li>-->
      <!--        </ol>-->
      <!--      </div>-->
    </div>
  </div>
</template>
