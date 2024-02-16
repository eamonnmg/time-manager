<script setup lang="ts">
import DayView from "@/Plan/DayView/DayView.vue";
import { addDays, eachDayOfInterval } from "date-fns";

interface Props {
  scrollPos: number;
}

defineProps<Props>();

const week = eachDayOfInterval({
  start: new Date(),
  end: addDays(new Date(), 6),
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
