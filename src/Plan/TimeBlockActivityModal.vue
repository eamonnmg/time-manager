<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ClockIcon } from "@heroicons/vue/24/outline";
import type { Activity, TimeBlock, TimeBlockCreate } from "@/shared/types";
import ActivityPicker from "@/Activities/ActivityPicker.vue";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { minutesToMs, msToMinutes } from "@/Budget/budgetUtils";
import { formatDate, useCloned } from "@vueuse/core";
import BaseModal from "@/shared/components/BaseModal.vue";

interface Props {
  activities: Activity[];
  timeBlock?: TimeBlock;
}
const props = defineProps<Props>();
const emit = defineEmits([
  "close",
  "addTimeBlock",
  "editTimeBlock",
  "removeTimeBlock",
]);

const activityStore = useActivitiesStore();
const editMode = computed<boolean>(() => {
  return Boolean(props.timeBlock && props.timeBlock.id);
});

const activity = ref<Activity>(undefined);
const start = ref(new Date().toISOString().slice(0, 19));
const duration = ref(minutesToMs(60));

if (props.timeBlock && props.timeBlock.start) {
  start.value = formatDate(new Date(props.timeBlock.start), "YYYY-MM-DDThh:mm");
}

if (props.timeBlock && props.timeBlock.duration) {
  duration.value = props.timeBlock.duration;
}

if (editMode.value) {
  activity.value = activityStore.getById(props.timeBlock.activityId);
  start.value = new Date(props.timeBlock.start).toISOString().slice(0, 19);
  duration.value = props.timeBlock.duration;
}

const activityTimeBlock = computed<TimeBlockCreate>(() => {
  return {
    activityId: activity.value.id,
    start: new Date(start.value),
    duration: duration.value,
    color: "bg-green-50",
  };
});

const titleText = computed(() => {
  return editMode.value ? "Edit time block" : "Add time block";
});

function close() {
  emit("close");
}

function addTimeBlock() {
  emit("addTimeBlock", activityTimeBlock.value);
}

function editTimeBlock() {
  emit("editTimeBlock", {
    ...activityTimeBlock.value,
    id: props.timeBlock.id,
  });
}

function submit() {
  if (!activity.value?.id) {
    alert("Please select an activity");
    return;
  }
  if (editMode.value) {
    editTimeBlock();
  } else {
    addTimeBlock();
  }
  close();
}

function remove() {
  emit("removeTimeBlock", props.timeBlock.id);
  close();
}
</script>
<template>
  <BaseModal :title="titleText" @close="close">
    <template #default>
      <div class="">
        <div>
          <div class="mt-2">
            <activity-picker
              v-model="activity"
              label="Activity"
              :multiple="false"
              :activities="activities"
            />
          </div>
          <p id="name-description" class="mt-2 text-sm text-gray-500">
            The name of the time block.
          </p>
        </div>
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Start</label
          >
          <div class="mt-2">
            <input
              id="start-time"
              v-model="start"
              type="datetime-local"
              name="start-time"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder=""
              aria-describedby="start-time-description"
            />
          </div>

          <div class="mt-2">
            <label
              for="duration"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Duration</label
            >
            <input
              id="duration"
              :value="msToMinutes(duration)"
              type="number"
              name="duration"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter duration in minutes"
              aria-describedby="end-time-description"
              @input="duration = minutesToMs($event.target.value)"
            />
          </div>
          <p id="name-description" class="mt-2 text-sm text-gray-500">
            The duration of the time block.
          </p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between mt-5 sm:mt-6">
        <button
          v-if="editMode"
          type="button"
          class="btn btn-warning"
          @click="remove"
        >
          Delete
        </button>
        <button type="button" class="btn btn-primary" @click="submit">
          {{ editMode ? "Edit" : "Add" }} time block
        </button>
      </div>
    </template>
  </BaseModal>
</template>
