<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { TimeBlock } from "@/types";
import HourDividerLines from "@/components/DayView/HourDividerLines.vue";

interface Props {
  timeBlocks: TimeBlock[];
}

const props = withDefaults(defineProps<Props>(), {
  timeBlocks: () => [
    // {
    //   name: "Breakfast",
    //   start: new Date(2022, 0, 22, 6).toDateString(),
    //   end: new Date(2022, 0, 22, 7),
    //   color: "bg-blue-50",
    // },
    // {
    //   name: "Flight to Paris",
    //   start: new Date(2022, 0, 22, 7, 30),
    //   end: new Date(2022, 0, 22, 8, 20),
    //   color: "bg-pink-50",
    // },
    // {
    //   name: "Sightseeing",
    //   start: new Date(2022, 0, 22, 11),
    //   end: new Date(2022, 0, 22, 15),
    //   color: "bg-indigo-50",
    // },
  ],
});

/**
 * The data structure for an activity in the day view.
 */
interface DayViewTimeBlock extends TimeBlock {
  row: number;
  span: number;
}

const container = ref(null);
const containerNav = ref(null);
const containerOffset = ref(null);

const rows = 288; // break 24 hour day into 288 5 minute segments

function timeBlockToDayViewTimeBlock(timeBlock: TimeBlock): DayViewTimeBlock {
  const startHour = new Date(timeBlock.start).getHours();
  const startMinute = new Date(timeBlock.start).getMinutes();
  const endHour = new Date(timeBlock.end).getHours();
  const endMinute = new Date(timeBlock.end).getMinutes();

  const startMin = startHour * 60 + startMinute;
  const endMin = endHour * 60 + endMinute;

  const startRow = Math.round(startMin / 5);
  const duration = Math.round((endMin - startMin) / 5);

  return {
    ...timeBlock,
    row: startRow + 2,
    span: duration,
  };
}

const dayViewTimeBlocks = computed(() => {
  return props.timeBlocks.map(timeBlockToDayViewTimeBlock);
});

onMounted(() => {
  // Set the container scroll position based on the current time.
  const currentMinute = new Date().getHours() * 60;
  container.value.scrollTop =
    ((container.value.scrollHeight -
      containerNav.value.offsetHeight -
      containerOffset.value.offsetHeight) *
      currentMinute) /
    1440;
});
</script>

<template>
  <div ref="container" class="flex flex-auto flex-col overflow-auto">
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
      <div class="grid flex-auto grid-cols-1 grid-rows-1">
        <!-- Horizontal lines -->
        <HourDividerLines>
          <template #offset>
            <div ref="containerOffset" class="row-end-1 h-7"></div>
          </template>
        </HourDividerLines>

        <!-- Events -->
        <ol
          class="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
          :style="`grid-template-rows: repeat(${rows}, minmax(0, 1fr)) auto`"
        >
          <li
            v-for="timeBlock in dayViewTimeBlocks"
            :key="timeBlock.name"
            class="relative mt-px flex"
            :style="`grid-row: ${timeBlock.row} / span ${timeBlock.span}`"
          >
            <a
              href="#"
              :class="`group absolute inset-1 flex flex-col overflow-y-auto rounded-lg ${timeBlock.color} p-2 text-xs leading-5`"
            >
              <p class="order-1 font-semibold text-blue-700">
                {{ timeBlock.name }}
              </p>
              <p class="text-blue-500 group-hover:text-blue-700">
                <time datetime="2022-01-22T06:00">6:00 AM</time>
              </p>
            </a>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
