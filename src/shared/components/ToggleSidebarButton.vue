<script setup lang="ts">
import { ChevronRightIcon } from "@heroicons/vue/24/outline";

interface Props {
  open: boolean;
}

defineProps<Props>();
</script>

<template>
  <button class="btn btn-circle text-sm btn-sm">
    <span class="sr-only">Toggle sidebar</span>
    <ChevronRightIcon
      class="size-4"
      :class="{
        'rotate-180': open,
      }"
    />
  </button>
</template>

<style scoped></style>
