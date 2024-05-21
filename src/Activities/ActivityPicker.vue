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
import type { Activity } from "@/shared/types";
import { useActivitiesStore } from "@/Activities/activitiesStore";

interface Props {
  modelValue?: Activity[] | Activity;
  activities?: Activity[];
  label?: string;
  multiple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  activities: () => [],
  label: "Activities",
  multiple: true,
});
const emit = defineEmits(["update:modelValue", "create-new-activity"]);

const queryRaw = ref("");

const query = computed(() => {
  // return the last part of the query eg parts before last comma are already selected
  const parts = queryRaw.value.split(",");
  return parts[parts.length - 1].trim();
});

const shouldShowCreateNewOption = computed<boolean>(() => {
  if (props.multiple) {
    return false;
  }
  const exactMatch = props.activities.find((activity) => {
    return activity.name.toLowerCase() === query.value.toLowerCase();
  });
  return query.value !== "" && !exactMatch;
});

const filteredActivities = computed<Activity[]>(() => {
  if (query.value === "") {
    return props.activities;
  }
  let filtered = props.activities.filter((activity) => {
    return activity.name.toLowerCase().includes(query.value.toLowerCase());
  });

  if (shouldShowCreateNewOption.value) {
    const createNewOption = {
      id: "NEW_ACTIVITY",
      value: query.value,
      name: `Create new activity "${query.value}"`,
      color: "bg-gray-200",
    };
    filtered = [createNewOption, ...filtered];
  }

  return filtered;
});

const displayValueFn = () => {
  if (props.modelValue.length) {
    return props.modelValue.reduce((acc, activity) => {
      return acc + activity.name + ", ";
    }, "");
  }

  return props.modelValue.name;
};

const mode = ref<"select" | "new">("select");

const newActivityInitValue = {
  id: "",
  name: "",
  color: "#079AE4",
  nestedActivities: [],
};
const newActivity = ref<Activity>(newActivityInitValue);

function onSelected(activity: Activity) {
  if (activity.id === "NEW_ACTIVITY") {
    // emit("create-new-activity", {
    //   name: query.value,
    // });

    newActivity.value.name = query.value;
    mode.value = "new";
  } else {
    emit("update:modelValue", activity);
    queryRaw.value = "";
    newActivity.value = newActivityInitValue;
  }
}

const { add } = useActivitiesStore();

function saveNewActivity() {
  const activity = add(newActivity.value);
  emit("update:modelValue", activity);
  mode.value = "select";
}
</script>

<template>
  <Combobox
    v-if="mode === 'select'"
    :model-value="modelValue"
    as="div"
    by="id"
    class="w-full"
    :multiple="multiple"
    @update:modelValue="onSelected"
  >
    <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">{{
      label
    }}</ComboboxLabel>
    <div class="relative w-full mt-2">
      <ComboboxInput
        :display-value="displayValueFn"
        class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        @change="queryRaw = $event.target.value"
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
          v-for="activity in filteredActivities"
          :key="activity.id"
          v-slot="{ active, selected }"
          :value="activity"
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
                class="badge h-6 w-6 flex-shrink-0 rounded-full"
                :style="{ backgroundColor: activity.color }"
              />
              <span :class="['ml-3 truncate', selected && 'font-semibold']">
                {{ activity.name }}
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
  <div v-else>
    <div>New activity</div>
    <div class="bg-gray-50 rounded-lg p-4 mt-2">
      <div>
        <label
          for="email"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Name</label
        >
        <div class="mt-2">
          <input
            id="name"
            v-model="newActivity.name"
            type="text"
            name="activity name"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Read Pride and prejudice"
            aria-describedby="name-description"
          />
        </div>
        <p id="name-description" class="mt-2 text-sm text-gray-500">
          The name of the activity.
        </p>
      </div>
      <div>
        <label
          for="email"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Color</label
        >
        <div class="mt-2">
          {{ newActivity.color }}
          <input
            id="color"
            v-model="newActivity.color"
            type="color"
            name="color"
            class="input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder=""
            aria-describedby="start-time-description"
          />
        </div>

        <ActivityPicker
          v-model="newActivity.nestedActivities"
          :activities="activities"
          multiple
        />
      </div>
    </div>
    <button class="btn btn-sm" @click="mode = 'select'">Cancel</button>
    <button class="btn btn-sm" @click="saveNewActivity">
      Save new activity
    </button>
  </div>
</template>

<style scoped></style>
