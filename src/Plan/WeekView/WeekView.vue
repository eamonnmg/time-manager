<script setup lang="ts">
import DayView from "@/Plan/DayView/DayView.vue";
import { addDays, eachDayOfInterval, lastDayOfWeek, subDays } from "date-fns";

interface Props {
  scrollPos: number;
}

defineProps<Props>();

const lastDay = lastDayOfWeek(new Date());
const week = eachDayOfInterval({
  start: subDays(lastDay, 6),
  end: lastDay,
});
</script>

<template>
  <div class="flex divide-x divide-gray-100 w-full h-full">
    <DayView
      v-for="(day, index) in week"
      :key="day.toDateString()"
      :day="day"
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
