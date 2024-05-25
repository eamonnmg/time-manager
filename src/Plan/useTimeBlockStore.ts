import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import type { ModelId, TimeBlock, TimeBlockWithActivity } from "@/shared/types";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { endOfDay, isWithinInterval, startOfDay, subMinutes } from "date-fns";
import { getTimeBlockEnd } from "@/Plan/DayView/utils";
import {
  findActivity,
  useBudgetPeriodStore,
} from "@/Budget/useBudgetPeriodStore";
import { useBudgetActivityStore } from "@/Budget/useBudgetActivityStore";

export const useTimeBlockStore = defineStore(
  "timeBlocks",
  () => {
    const activityStore = useActivitiesStore();
    const budgetPeriodStore = useBudgetPeriodStore();
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
          const isStartWithinDay = isWithinInterval(new Date(tb.start), {
            start: startOfDay(day),
            end: endOfDay(day),
          });
          const isEndWithinDay = isWithinInterval(
            // subtract 1 minute from end to make it inclusive of 12:00am
            subMinutes(getTimeBlockEnd(tb), 1),
            {
              start: startOfDay(day),
              end: endOfDay(day),
            },
          );
          return isStartWithinDay || isEndWithinDay;
        });
      };
    });

    const timeBlocksWithActivityForDateRange = computed(() => {
      return (start: Date, end: Date) => {
        return timeBlocksWithActivity.value.filter((tb: TimeBlock) => {
          const x = isWithinInterval(new Date(tb.start), {
            start: new Date(start),
            end: new Date(end),
          });
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
      if (targetTimeBlockIdx === -1) {
        console.error("timeBlock not found");
        return;
      }
      timeBlocks.value[targetTimeBlockIdx] = timeBlock;
    }

    function remove(id: ModelId) {
      timeBlocks.value = timeBlocks.value.filter(
        (tb: TimeBlock) => tb.id !== id,
      );
    }

    const budgetActivityStore = useBudgetActivityStore();
    function getTimeBlockBudgetPeriod(timeblock: TimeBlockWithActivity) {
      const timeblockEndDate = new Date(
        new Date(timeblock.start).getTime() + timeblock.duration,
      );
      const budgetPeriod = budgetPeriodStore.budgetPeriodsWithinRange(
        new Date(timeblock.start),
        timeblockEndDate,
      )[0];
      if (!budgetPeriod) {
        return null;
      }
      // check if timeblock contributes to the budget period activities
      const activities = budgetActivityStore.getAllForBudget(
        budgetPeriod.budget.id,
      );
      let matchingActivity = null;
      for (const activity of activities) {
        if (Boolean(findActivity([timeblock.activity], activity.activityId))) {
          matchingActivity = activity;
          break;
        }
      }

      return Boolean(matchingActivity) ? budgetPeriod : null;
    }

    return {
      timeBlocks,
      timeBlocksWithActivity,
      timeBlocksWithActivityForDay,
      timeBlocksWithActivityForDateRange,
      add,
      edit,
      remove,
      getTimeBlockBudgetPeriod,
    };
  },
  {
    persist: true,
  },
);
