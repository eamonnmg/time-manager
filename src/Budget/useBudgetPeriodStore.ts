import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type {
  BudgetPeriod,
  BudgetPeriodCreate,
  BudgetPeriodWithBudget,
  ModelId,
  TimeBlockWithActivity,
} from "@/types";
import { useBudgetStore } from "@/Budget/useBudgetStore";
import { add, addMilliseconds } from "date-fns";
import { timeBlocks } from "@/utils/testdata";
import { useTimeBlockStore } from "@/Plan/useTimeBlockStore";
import { useBudgetActivityStore } from "@/Budget/useBudgetActivityStore";

export const useBudgetPeriodStore = defineStore(
  "budgetPeriods",
  () => {
    const budgetStore = useBudgetStore();
    const budgetActivityStore = useBudgetActivityStore();
    const timeBlocksStore = useTimeBlockStore();
    const budgetsPeriods = ref<BudgetPeriod[]>([]);

    function getById(id: string): BudgetPeriod | undefined {
      return budgetsPeriods.value.find((b: BudgetPeriod) => b.id === id);
    }

    // there should only be one active period at a time
    const activePeriod = computed<BudgetPeriodWithBudget | undefined>(() => {
      const now = new Date();
      const bp = budgetsPeriods.value.find((bp) => {
        return new Date(bp.startDate) <= now && new Date(bp.endDate) > now;
      });

      if (!bp) {
        return;
      }

      return {
        ...bp,
        budget: budgetStore.getById(bp.budgetId),
      };
    });

    const timeBlocksInActivePeriod = computed<TimeBlockWithActivity[]>(() => {
      if (!activePeriod.value) {
        return [];
      }

      return timeBlocksStore.timeBlocksWithActivityForDateRange(
        activePeriod.value.startDate,
        activePeriod.value.endDate,
      );
    });

    const timeBlocksForBudgetActivity = computed<TimeBlockWithActivity[]>(
      () => {
        return (activityId: ModelId) => {
          if (!timeBlocksInActivePeriod.value.length) {
            return [];
          }
          return timeBlocksInActivePeriod.value.filter((tb) => {
            // dont worry about nested activities for now
            return tb.activityId === activityId;
          });
        };
      },
    );

    const totalAllocatedTimeForBudgetActivityInPeriod = computed<
      TimeBlockWithActivity[]
    >(() => {
      return (budgetActivityId: ModelId): number => {
        const timeBlocks = timeBlocksForBudgetActivity.value(budgetActivityId);
        console.log("timeBlocks", timeBlocks);
        return timeBlocks.reduce((acc, tb) => {
          return acc + tb.duration;
        }, 0);
      };
    });

    function create(budgetPeriod: BudgetPeriodCreate) {
      const id = self.crypto.randomUUID();
      const budget = budgetStore.getById(budgetPeriod.budgetId);
      budgetsPeriods.value.push({
        ...budgetPeriod,
        endDate: addMilliseconds(budgetPeriod.startDate, budget.duration),
        id,
      });
    }

    function edit(budgetPeriod: BudgetPeriod) {
      const targetIdx = budgetsPeriods.value.findIndex(
        (b: BudgetPeriod) => b.id === budgetPeriod.id,
      );
      if (targetIdx === -1) {
        console.error("budget not found");
        return;
      }
      budgetsPeriods.value[targetIdx] = budgetPeriod;
    }

    return {
      budgetsPeriods,
      activePeriod,
      edit,
      getById,
      create,
      timeBlocksInActivePeriod,
      totalAllocatedTimeForBudgetActivityInPeriod,
    };
  },
  {
    persist: true,
  },
);
