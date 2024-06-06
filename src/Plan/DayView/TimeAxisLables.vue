<script setup lang="ts">
import { add, format, startOfDay } from "date-fns";
import { computed } from "vue";

interface Props {
  timeScale: any;
}

const props = withDefaults(defineProps<Props>(), {});

const day = new Date();

const hourLabels = computed(() => {
  return Array.from({ length: 24 }).map((div, i) => {
    const dateTime = add(startOfDay(day), { hours: i });
    return {
      dateTime,
      label: format(dateTime, "h a"),
      y: props.timeScale(dateTime),
    };
  });
});
</script>

<template>
  <div class="relative w-12">
    <div
      v-for="divider in hourLabels"
      :key="divider.dateTime.toDateString()"
      class="absolute text-xs text-right w-full pr-2 text-gray-400"
      :style="{ transform: `translateY(${divider.y}px)` }"
    >
      {{ divider.label }}
    </div>
  </div>
</template>
