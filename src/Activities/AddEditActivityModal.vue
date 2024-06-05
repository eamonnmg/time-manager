<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Activity } from "@/shared/types";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { storeToRefs } from "pinia";
import ActivityPicker from "@/Activities/ActivityPicker.vue";
import BaseModal from "@/shared/components/BaseModal.vue";
import { useCloned } from "@vueuse/core";
import ColorPicker from "@/shared/components/ColorPicker.vue";
import activityColorPalatte from "@/shared/utils/activityColorPalatte";

interface Props {
  activity?: Activity;
  initialName?: string;
}
const props = withDefaults(defineProps<Props>(), {
  activity: undefined,
  initialName: "",
});
const emit = defineEmits(["addActivity", "editActivity", "close"]);

const activitiesStore = useActivitiesStore();

const { activities } = storeToRefs(activitiesStore);

const editMode = computed(() => {
  return Boolean(props.activity);
});

const randomInitColor =
  activityColorPalatte[Math.floor(Math.random() * activityColorPalatte.length)];
const localActivityObject = ref<Activity>({
  id: "",
  name: props.initialName,
  color: randomInitColor.value,
  nestedActivities: [],
});

if (editMode.value) {
  const { cloned } = useCloned<Activity>(props.activity);

  console.log("cloned", cloned.value);
  localActivityObject.value = cloned.value;
}

const titleText = computed(() => {
  return editMode.value ? "Edit activity" : "Add activity";
});

const submitText = computed(() => {
  return editMode.value ? "Edit activity" : "Add activity";
});

function close() {
  emit("close");
}

function addActvity() {
  emit("addActivity", localActivityObject.value);
}

function editActivity() {
  emit("editActivity", localActivityObject.value);
}

function submit() {
  if (editMode.value) {
    editActivity();
  } else {
    addActvity();
  }
  close();
}
</script>
<template>
  <BaseModal :title="titleText" @close="close">
    <template #default>
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
      </div>
      <div class="space-y-2">
        <div class="mt-2">
          <ColorPicker v-model="localActivityObject.color" />
          <!--          <input-->
          <!--            id="color"-->
          <!--            v-model="localActivityObject.color"-->
          <!--            type="color"-->
          <!--            name="color"-->
          <!--            class="block input w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"-->
          <!--            placeholder=""-->
          <!--            aria-describedby="start-time-description"-->
          <!--          />-->
        </div>

        <ActivityPicker
          v-model="localActivityObject.nestedActivities"
          :activities="activities"
          label="Nested activities"
          multiple
        />
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="submit"
      >
        {{ submitText }}
      </button>
    </template>
  </BaseModal>
</template>
