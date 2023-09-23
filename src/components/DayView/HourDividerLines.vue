<script setup lang="ts">
import { scaleTime } from "d3";
import { endOfToday, startOfToday, add, format } from "date-fns";
import { computed } from "vue";

interface Props {
  timeScale: any;
}

const props = defineProps<Props>();

// const timeScale = scaleTime()
//   .domain([startOfToday(), endOfToday()])
//   .range([0, 1800]);

const hourLabels = computed(() => {
  return Array.from({ length: 24 }).map((div, i) => {
    const dateTime = add(startOfToday(), { hours: i });
    return {
      dateTime,
      label: format(dateTime, "h a"),
      y: props.timeScale(dateTime),
    };
  });
});

const halfHourDividerLines = computed(() => {
  return Array.from({ length: 48 }).map((div, i) => {
    const dateTime = add(startOfToday(), { minutes: i * 30 });
    return {
      dateTime,
      label: format(dateTime, "h a"),
      y: props.timeScale(dateTime),
    };
  });
});

// console.log(hourDividerLines);
</script>

<template>
  <div class="relative">
    <div
      v-for="divider in hourLabels"
      :key="divider.dateTime"
      class="absolute -left-10 -top-2 border-0 top-0 bottom-0 text-right text-xs leading-5 text-gray-400"
      :style="{ transform: `translateY(${divider.y}px)` }"
    >
      {{ divider.label }}
    </div>
  </div>
  <div class="relative w-full divide-y divide-gray-100">
    <div
      v-for="divider in halfHourDividerLines"
      :key="divider.dateTime"
      class="absolute left-0 w right-0 top-0 bottom-0"
      :style="{ transform: `translateY(${divider.y}px)` }"
    ></div>
  </div>
  <!--  <div-->
  <!--    class="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"-->
  <!--    style="grid-template-rows: repeat(48, minmax(3.5rem, 1fr))"-->
  <!--  >-->
  <!--    <slot name="offset"> </slot>-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        12AM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        1AM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        2AM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        3AM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        4AM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        5AM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        6AM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        7AM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        8AM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        9AM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        10AM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        11AM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        12PM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        1PM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        2PM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        3PM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        4PM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        5PM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        6PM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        7PM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        8PM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        9PM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        10PM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--    <div>-->
  <!--      <div-->
  <!--        class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"-->
  <!--      >-->
  <!--        11PM-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div />-->
  <!--  </div>-->
</template>
