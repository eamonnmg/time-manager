<script setup lang="ts">
import { ref } from "vue";
import AppHeader from "@/Plan/AppHeader.vue";
import DayView from "@/Plan/DayView/DayView.vue";
import TimeBlockActivityModal from "@/Plan/TimeBlockActivityModal.vue";
import type { TimeBlock } from "@/types";
import { timeBlocks } from "@/utils/testdata";
import { format } from "date-fns";

const timeblocks = ref<TimeBlock[]>(timeBlocks);
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
  <div class="flex h-full w-full flex-col">
    <AppHeader>
      <template #left>
        <h1 class="text-base font-semibold leading-6 text-gray-900">
          <time datetime="2022-01-22" class="sm:hidden">
            {{ format(new Date(), "MMM d, yyyy") }}
          </time>
          <time datetime="2022-01-22" class="hidden sm:inline"
            >{{ format(new Date(), "MMMM d, yyyy") }}
          </time>
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ format(new Date(), "eeee") }}
        </p>
      </template>
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
