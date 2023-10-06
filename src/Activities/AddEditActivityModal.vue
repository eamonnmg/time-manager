<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import type { Activity } from "@/types";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { storeToRefs } from "pinia";
import ActivityPicker from "@/Activities/ActivityPicker.vue";

interface Props {
  open: boolean;
  activity?: Activity;
}
const props = defineProps<Props>();
const emit = defineEmits([
  "update:open",
  "addActivity",
  "editActivity",
  "close",
]);

const activitiesStore = useActivitiesStore();

const { activities } = storeToRefs(activitiesStore);

const editMode = computed(() => {
  return !!props.activity;
});

const localActivityObject = ref<Activity>({
  id: "",
  name: "",
  color: "",
  nestedActivities: [],
});

watch(
  () => props.activity,
  (val) => {
    if (val) {
      localActivityObject.value = JSON.parse(JSON.stringify(props.activity));
    } else {
      localActivityObject.value = {
        id: "",
        name: "",
        color: "",
        nestedActivities: [],
      };
    }
  },
  { deep: true },
);

watch(editMode, (val) => {
  if (val) {
    localActivityObject.value = JSON.parse(JSON.stringify(props.activity));
  }
});

const name = ref("");
const color = ref("bg-green-300");

function close() {
  emit("update:open", false);
  emit("close");
}
// const selectedActivities = ref([]);

// const newActivity = computed<Activity>(() => {
//   return {
//     id: "",
//     name: name.value,
//     color: color.value,
//     nestedActivities: [...selectedActivities.value],
//   };
// });

//
function addActvity() {
  emit("addActivity", localActivityObject.value);
}

function editActivity() {
  emit("editActivity", localActivityObject.value);
}

//
function submit() {
  console.log("submitting", localActivityObject.value);
  if (editMode.value) {
    editActivity();
  } else {
    addActvity();
  }
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
                  <!--                  <ClockIcon-->
                  <!--                    class="h-6 w-6 text-green-600"-->
                  <!--                    aria-hidden="true"-->
                  <!--                  />-->
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-gray-900"
                    >Add Activity</DialogTitle
                  >
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">Add new activity.</p>
                  </div>
                </div>

                <div class="mt-8">
                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium leading-6 text-gray-900"
                      >Name</label
                    >
                    <div class="mt-2">
                      <input
                        id="name"
                        v-model="localActivityObject.name"
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
                      <input
                        id="color"
                        v-model="localActivityObject.color"
                        type="text"
                        name="color"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder=""
                        aria-describedby="start-time-description"
                      />
                    </div>

                    <ActivityPicker
                      v-model="localActivityObject.nestedActivities"
                      :activities="activities"
                      multiple
                    />
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  @click="submit"
                >
                  {{ editMode ? "Edit activity" : "Add activity" }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
