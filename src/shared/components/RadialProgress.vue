<script setup lang="ts">
interface Props {
  value: number;
}

defineProps<Props>();
</script>

<template>
  <div
    class="radial-progress"
    :style="`--value:${value}; --size:3rem`"
    role="progressbar"
  >
    {{ value.toFixed(0) }}%
  </div>
</template>

<style scoped></style>
