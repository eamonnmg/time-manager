<script setup lang="ts">
import DayView from "@/Plan/DayView/DayView.vue";
import { addDays, eachDayOfInterval, lastDayOfWeek, subDays } from "date-fns";
import { computed } from "vue";

interface Props {
  lastDayOfWeek: Date;
  scrollPos: number;
  dayLabelHeight: number;
}

const props = defineProps<Props>();

const week = computed(() => {
  return eachDayOfInterval({
    start: subDays(props.lastDayOfWeek, 6),
    end: props.lastDayOfWeek,
  });
});
</script>

<template>
  <div class="flex divide-x divide-gray-100 w-full h-full">
    <DayView
      v-for="(day, index) in week"
      :key="day.toDateString()"
      :day="day"
      :day-label-height="dayLabelHeight"
      :scroll-pos="scrollPos"
      :show-times-in-margin="index < 1"
      @edit-time-block="$emit('editTimeBlock', $event)"
      @create-time-blocl-ghost-clicked="
        $emit('create-time-blocl-ghost-clicked', $event)
      "
    />
  </div>
</template>

<style scoped></style>
