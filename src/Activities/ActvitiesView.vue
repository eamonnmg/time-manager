<script setup lang="ts">
import { useActivitiesStore } from "@/Activities/activitiesStore";
import AddActivityModal from "@/Activities/AddEditActivityModal.vue";
import { nextTick, ref } from "vue";
import AppHeader from "@/Plan/AppHeader.vue";
import type { Activity } from "@/shared/types";

const { activities, add, edit } = useActivitiesStore();
const showAddActivityModal = ref(false);

const selectedActivity = ref(undefined);

function editActivity(activity: Activity) {
  selectedActivity.value = activity;
  nextTick(() => {
    showAddActivityModal.value = true;
  });
}
</script>

<template>
  <AddActivityModal
    v-model:open="showAddActivityModal"
    :activity="selectedActivity"
    @add-activity="add"
    @edit-activity="edit"
    @close="selectedActivity = undefined"
  />

  <div class="flex h-full w-full flex-col">
    <AppHeader>
      <template #left>
        <h1 class="text-base font-semibold leading-6 text-gray-900">
          Activities
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all the activities you can timeblock.
        </p>
      </template>
      <button
        type="button"
        class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="showAddActivityModal = true"
      >
        Add activity
      </button>
    </AppHeader>
    <div class="px-4 mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Name
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Nested activites
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Color
                </th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="activity in activities" :key="activity.id">
                <td
                  class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                >
                  {{ activity.name }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{
                    activity.nestedActivities.reduce(
                      (acc: string, i: Activity) =>
                        (acc = acc.concat(i.name + " ")),
                      "",
                    )
                  }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div
                    :class="['badge']"
                    :style="`background-color: ${activity.color}`"
                  ></div>
                </td>
                <td
                  class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                >
                  <button
                    class="btn btn-sm btn-ghost text-indigo-600 hover:text-indigo-900"
                    @click="editActivity(activity)"
                  >
                    Edit<span class="sr-only">, {{ activity.name }}</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
