<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { milliseconds } from "date-fns";
import { milliSecondsToDuration } from "@/shared/utils/dateTimeHelpers";

interface Props {
  // days: number;
  // hours: number;
  // minutes: number;
  milliseconds: number;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:milliseconds"]);

const duration = ref<Duration>(milliSecondsToDuration(props.milliseconds));
// const days = initDuration.days;
// const hours = initDuration.hours;
// const mins = initDuration.minutes;

// const duration = computed<Duration>(()=>{
//   return milliSecondsToDuration(props.milliseconds)
// })

watch(
  duration,
  (val) => {
    // console.log(milliseconds(val));
    emit("update:milliseconds", milliseconds(val));
  },
  { deep: true },
);
</script>

<template>
  <div>
    <label class="block text-sm font-medium leading-6 text-gray-900"
      >Duration</label
    >
    <div class="flex items-center space-x-2">
      <label for="days">Days</label>
      <input
        id="days"
        v-model="duration.days"
        type="number"
        name="days"
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="Days"
      />
      <label for="hours">Hours</label>

      <input
        id="hours"
        v-model="duration.hours"
        type="number"
        name="hours"
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="hours"
      />
      <label for="mins">Mins</label>
      <input
        id="mins"
        v-model="duration.minutes"
        type="number"
        name="mins"
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="Minutes"
      />
    </div>
  </div>
</template>

<style scoped></style>
