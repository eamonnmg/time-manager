<script setup lang="ts">
import {
  CalendarIcon,
  ChartPieIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/vue/24/outline";
const navigation = [
  { name: "Plan", href: "/", icon: CalendarIcon, current: true },
  {
    name: "Activities",
    href: "/activities",
    icon: WrenchScrewdriverIcon,
    current: false,
  },
  { name: "Budget", href: "/budgets", icon: ChartPieIcon, current: false },
];
</script>

<template>
  <div class="h-screen flex">
    <div class="h-full w-[330px] border-r border-gray-200">
      <nav class="flex flex-1 flex-col p-4">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" class="-mx-2 space-y-1">
              <li v-for="item in navigation" :key="item.name">
                <router-link v-slot="{ isActive }" :to="item.href">
                  <div
                    :class="[
                      isActive
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    ]"
                  >
                    <component
                      :is="item.icon"
                      :class="[
                        isActive
                          ? 'text-indigo-600'
                          : 'text-gray-400 group-hover:text-indigo-600',
                        'h-6 w-6 shrink-0',
                      ]"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </div>
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
    <div class="h-full w-full">
      <slot></slot>
    </div>
  </div>
</template>