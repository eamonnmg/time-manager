<script setup lang="ts">
import { ref, computed } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
  ComboboxLabel,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import type { Activity } from "@/types";

interface Props {
  modelValue: Activity[] | Activity;
  activities: Activity[];
  label: string;
  multiple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  activities: () => [],
  label: "Activities",
  multiple: true,
});
const emit = defineEmits(["update:modelValue"]);

const query = ref("");

const filteredActivities = computed(() =>
  query.value === ""
    ? props.activities
    : props.activities.filter((activity) => {
        return activity.name.toLowerCase().includes(query.value.toLowerCase());
      }),
);

const displayValueFn = () => {
  if (props.modelValue.length) {
    return props.modelValue.reduce((acc, activity) => {
      return acc + activity.name + ", ";
    }, "");
  }

  return props.modelValue.name;
};
</script>

<template>
  <Combobox
    :model-value="modelValue"
    as="div"
    by="id"
    :multiple="multiple"
    @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">{{
      label
    }}</ComboboxLabel>
    <div class="relative mt-2">
      <ComboboxInput
        :display-value="displayValueFn"
        class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        @change="query = $event.target.value"
      />
      <ComboboxButton
        class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
      >
        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </ComboboxButton>

      <ComboboxOptions
        v-if="filteredActivities.length > 0"
        class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      >
        <ComboboxOption
          v-for="department in filteredActivities"
          :key="department.id"
          v-slot="{ active, selected }"
          :value="department"
          as="template"
        >
          <li
            :class="[
              'relative cursor-default select-none py-2 pl-3 pr-9',
              active ? 'bg-indigo-600 text-white' : 'text-gray-900',
            ]"
          >
            <div class="flex items-center">
              <div
                :class="[
                  'badge h-6 w-6 flex-shrink-0 rounded-full',
                  department.color,
                ]"
              />
              <span :class="['ml-3 truncate', selected && 'font-semibold']">
                {{ department.name }}
              </span>
            </div>

            <span
              v-if="selected"
              :class="[
                'absolute inset-y-0 right-0 flex items-center pr-4',
                active ? 'text-white' : 'text-indigo-600',
              ]"
            >
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>

<style scoped></style>
