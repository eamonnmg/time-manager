<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { milliseconds } from "date-fns";
import { milliSecondsToDuration } from "@/shared/utils/dateTimeHelpers";
import BaseInput from "@/shared/components/BaseInput.vue";

interface Props {
  milliseconds: number;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Duration",
});
const emit = defineEmits(["update:milliseconds"]);

const duration = ref<Duration>(milliSecondsToDuration(props.milliseconds));

watch(
  duration,
  (val) => {
    emit("update:milliseconds", milliseconds(val));
  },
  { deep: true },
);
</script>

<template>
  <div>
    <label class="block text-sm font-medium leading-6 text-gray-900">
      {{ label }}
    </label>
    <div class="flex items-center space-x-2">
      <label for="days">Days</label>
      <BaseInput
        id="days"
        v-model="duration.days"
        type="number"
        name="days"
        placeholder="Days"
      />
      <label for="hours">Hours</label>

      <BaseInput
        id="hours"
        v-model="duration.hours"
        type="number"
        name="hours"
        placeholder="hours"
      />
      <label for="mins">Mins</label>
      <BaseInput
        id="mins"
        v-model="duration.minutes"
        type="number"
        name="mins"
        placeholder="Minutes"
      />
    </div>
  </div>
</template>
