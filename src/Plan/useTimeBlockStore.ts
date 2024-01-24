import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { TimeBlock } from "@/types";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";

export const useTimeBlockStore = defineStore(
  "timeBlocks",
  () => {
    const activityStore = useActivitiesStore();
    const timeBlocks = ref<TimeBlock[]>([]);

    const timeBlocksWithActivity = computed(() => {
      return timeBlocks.value.map((tb: TimeBlock) => {
        return {
          ...tb,
          activity: activityStore.getById(tb.activityId),
        };
      });
    });

    const timeBlocksWithActivityForDay = computed(() => {
      return (day: Date) => {
        return timeBlocksWithActivity.value.filter((tb: TimeBlock) => {
          const x = isWithinInterval(new Date(tb.start), {
            start: startOfDay(day),
            end: endOfDay(day),
          });
          console.log("test", x);
          return x;
        });
      };
    });

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
      if (targetTimeBlockIdx > 0) {
        console.error("timeBlock not found");
        return;
      }
      timeBlocks.value[targetTimeBlockIdx] = timeBlock;
    }

    return {
      timeBlocks,
      timeBlocksWithActivity,
      timeBlocksWithActivityForDay,
      add,
      edit,
    };
  },
  {
    persist: true,
  },
);
