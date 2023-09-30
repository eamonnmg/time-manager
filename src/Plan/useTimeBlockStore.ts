import { ref } from "vue";
import { defineStore } from "pinia";
import type { TimeBlock } from "@/types";

export const useTimeBlockStore = defineStore("timeBlocks", () => {
  const timeBlocks = ref<TimeBlock[]>([]);
  function add(timeBlock: TimeBlock) {
    const timeBlockId = self.crypto.randomUUID();
    timeBlocks.value.push({
      ...timeBlock,
      id: timeBlockId,
    });
  }

  function edit(timeBlock: TimeBlock) {
    const targetTimeBlockIdx = timeBlocks.value.findIndex(
      (tb: TimeBlock) => tb.id === timeBlock.id,
    );
    if (!targetTimeBlockIdx) {
      console.error("timeBlock not found");
      return;
    }
    timeBlocks.value[targetTimeBlockIdx] = timeBlock;
  }

  return { timeBlocks, add, edit };
});
