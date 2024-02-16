<script setup lang="ts">
import { add, format, startOfDay } from "date-fns";
import { computed } from "vue";

interface Props {
  timeScale: any;
  day: Date;
  showTimes: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTimes: true,
});

// const timeScale = scaleTime()
//   .domain([startOfToday(), endOfToday()])
//   .range([0, 1800]);

const hourLabels = computed(() => {
  return Array.from({ length: 24 }).map((div, i) => {
    const dateTime = add(startOfDay(props.day), { hours: i });
    return {
      dateTime,
      label: format(dateTime, "h a"),
      y: props.timeScale(dateTime),
    };
  });
});

const halfHourDividerLines = computed(() => {
  return Array.from({ length: 48 }).map((div, i) => {
    const dateTime = add(startOfDay(props.day), { minutes: i * 30 });
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
  <div v-if="showTimes" class="relative">
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
</template>
