<script setup lang="ts">
import { ref } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import DayView from "@/components/DayView/DayView.vue";
import TimeBlockActivityModal from "@/components/TimeBlockActivityModal.vue";
import type { TimeBlock } from "@/types";

const timeblocks = ref<TimeBlock>([]);
const showTimeBlockActivityModal = ref(false);

function addTimeBlock(timeblock: TimeBlock) {
  timeblocks.value.push(timeblock);
}
</script>

<template>
  <TimeBlockActivityModal
    v-if="showTimeBlockActivityModal"
    v-model:open="showTimeBlockActivityModal"
    @add-time-block="addTimeBlock"
  />
  <div class="flex h-full flex-col">
    <AppHeader>
      <button
        type="button"
        class="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        @click="showTimeBlockActivityModal = true"
      >
        Add timeblock
      </button>
    </AppHeader>
    <div class="isolate flex flex-auto overflow-hidden bg-white">
      <DayView :time-blocks="timeblocks" />
    </div>
  </div>
</template>
