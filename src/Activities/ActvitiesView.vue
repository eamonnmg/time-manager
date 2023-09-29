<script setup lang="ts">
interface Activity {
  id: string | number;
  name: string;
  color: string;
  nestedActivities: Activity[];
}

const reading = {
  id: self.crypto.randomUUID(),
  name: "Reading",
  color: "bg-blue-300",
  nestedActivities: [],
};

const philosohy = {
  id: self.crypto.randomUUID(),
  name: "philosohy",
  color: "bg-grey-300",
  nestedActivities: [],
};

const nonFiction = {
  id: self.crypto.randomUUID(),
  name: "Non-fiction",
  color: "bg-green-300",
  nestedActivities: [reading],
};

const crimeAndPunishment = {
  id: self.crypto.randomUUID(),
  name: "Crime and Punishment",
  color: "bg-red-300",
  nestedActivities: [nonFiction, philosohy],
};

const activities: Activity[] = [reading, nonFiction, crimeAndPunishment];
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">
          Activities
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all the users in your account including their name, title,
          email and role.
        </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          type="button"
          class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add user
        </button>
      </div>
    </div>
    <div class="mt-8 flow-root">
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
                  <div :class="['badge', activity.color]"></div>
                </td>
                <td
                  class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                >
                  <a href="#" class="text-indigo-600 hover:text-indigo-900"
                    >Edit<span class="sr-only">, {{ activity.name }}</span></a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
