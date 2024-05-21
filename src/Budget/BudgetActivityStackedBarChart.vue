<script setup lang="ts">
import type { BudgetActivityWithActivity, ModelId } from "@/shared/types";
import { computed, ref } from "vue";
import { scaleLinear } from "d3";
import { useElementSize } from "@vueuse/core";
import { calcPercentageOfTimeAllocated } from "@/Budget/budgetUtils";

interface Props {
  totalTimeMs: number;
  budgetActivities: BudgetActivityWithActivity[];
}

const props = defineProps<Props>();

const rootEl = ref();

const { width } = useElementSize(rootEl);

const hoveredActivityId = ref<ModelId>(null);

const scale = computed(() => {
  const start = 0;
  const end = props.totalTimeMs;
  return scaleLinear().domain([start, end]).range([0, width.value]);
});

const data = computed(() => {
  let offset = 0;
  return props.budgetActivities
    .map((item) => {
      const x = {
        ...item,
        width: scale.value(item.allocatedTime),
        x: offset,
      };
      offset = offset + scale.value(item.allocatedTime);
      console.log(offset);
      return x;
    })
    .filter((i) => i.allocatedTime > 0);
});
</script>

<template>
  <div
    ref="rootEl"
    class="relative size-full rounded-full border h-4 flex items-center"
  >
    <div
      v-for="item in data"
      :key="item.id"
      :class="{
        'opacity-60':
          hoveredActivityId !== null && hoveredActivityId !== item.id,
      }"
      class="absolute first:rounded-l-full last:rounded-r-full cursor-pointer tooltip h-4 hover:scale-125"
      :data-tip="`${item.activity.name} - ${calcPercentageOfTimeAllocated(
        item.allocatedTime,
        totalTimeMs,
      ).toFixed(0)}%`"
      :style="{
        width: `${item.width}px`,
        transform: `translateX(${item.x}px)`,
        background: item.activity.color,
      }"
      @mouseover="hoveredActivityId = item.id"
      @mouseleave="hoveredActivityId = null"
    ></div>
  </div>
</template>

<style scoped></style>
