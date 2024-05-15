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
import type { Activity, TimeBlock, TimeBlockCreate } from "@/types";
import ActivityPicker from "@/Activities/ActivityPicker.vue";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { minutesToMs, msToMinutes } from "@/Budget/budgetUtils";
import { formatDate, useCloned } from "@vueuse/core";

interface Props {
  open: boolean;
  activities: Activity[];
  timeBlock?: TimeBlock;
}
const props = defineProps<Props>();
const emit = defineEmits([
  "update:open",
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
function close() {
  emit("update:open", false);
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
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="close">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full justify-center p-4 text-center items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div>
                <div
                  class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
                >
                  <ClockIcon
                    class="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-gray-900"
                    >Time block an activity</DialogTitle
                  >
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Allocate time to an activity you intend to do.
                    </p>
                  </div>
                </div>

                <div class="mt-8">
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
              </div>
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
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
