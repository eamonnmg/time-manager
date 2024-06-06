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
</script>

<template>
  <div class="relative w-full divide-y divide-gray-100">
    <div
      v-for="divider in halfHourDividerLines"
      :key="divider.dateTime.toDateString()"
      class="absolute left-0 w right-0 top-0 bottom-0"
      :style="{ transform: `translateY(${divider.y}px)` }"
    ></div>
  </div>
</template>
