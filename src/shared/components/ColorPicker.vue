<script setup lang="ts">
import { ref } from "vue";
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import activityColorPalatte from "@/shared/utils/activityColorPalatte";

interface Props {
  modelValue: string;
}

const colors = ref(activityColorPalatte);

defineProps<Props>();

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <Listbox
    horizontal
    :model-value="modelValue"
    @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <div class="relative flex items-center space-x-2 mt-1">
      <ListboxLabel class="block text-sm font-medium leading-6 text-gray-900"
        >Color:</ListboxLabel
      >
      <ListboxButton
        class="w-full rounded-md border-0 bg-white py-1.5 pl-2 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        <div
          class="h-6 w-full rounded-md"
          :style="{ backgroundColor: modelValue }"
        ></div>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          as="div"
          class="absolute mt-1 p-2 z-50 gap-2 grid grid-cols-7 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="color in colors"
            v-slot="{ active, selected }"
            :key="color.value"
            :value="color.value"
            as="template"
          >
            <button
              class="rounded-lg size-6 border-2"
              :class="{
                'border-2 scale-110': active || selected,
              }"
              :style="{
                backgroundColor: color.value,
                borderColor: color.value,
              }"
            ></button>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
<style scoped></style>
