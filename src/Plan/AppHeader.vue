<script setup lang="ts"></script>

<template>
  <header
    class="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4"
  >
    <div>
      <slot name="left"></slot>
    </div>
    <div class="flex items-center">
      <slot> </slot>

      <div
        class="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch"
      >
        <!--        <button-->
        <!--          type="button"-->
        <!--          class="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"-->
        <!--        >-->
        <!--          <span class="sr-only">Previous day</span>-->
        <!--          <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />-->
        <!--        </button>-->
        <!--        <button-->
        <!--          type="button"-->
        <!--          class="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"-->
        <!--        >-->
        <!--          Today-->
        <!--        </button>-->
        <!--        <span class="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />-->
        <!--        <button-->
        <!--          type="button"-->
        <!--          class="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"-->
        <!--        >-->
        <!--          <span class="sr-only">Next day</span>-->
        <!--          <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />-->
        <!--        </button>-->
      </div>
      <div class="hidden md:ml-4 md:flex md:items-center">
        <!--        <Menu as="div" class="relative">-->
        <!--          <MenuButton-->
        <!--            type="button"-->
        <!--            class="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"-->
        <!--          >-->
        <!--            Day view-->
        <!--            <ChevronDownIcon-->
        <!--              class="-mr-1 h-5 w-5 text-gray-400"-->
        <!--              aria-hidden="true"-->
        <!--            />-->
        <!--          </MenuButton>-->

        <!--          <transition-->
        <!--            enter-active-class="transition ease-out duration-100"-->
        <!--            enter-from-class="transform opacity-0 scale-95"-->
        <!--            enter-to-class="transform opacity-100 scale-100"-->
        <!--            leave-active-class="transition ease-in duration-75"-->
        <!--            leave-from-class="transform opacity-100 scale-100"-->
        <!--            leave-to-class="transform opacity-0 scale-95"-->
        <!--          >-->
        <!--            <MenuItems-->
        <!--              class="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"-->
        <!--            >-->
        <!--              <div class="py-1">-->
        <!--                <MenuItem v-slot="{ active }">-->
        <!--                  <a-->
        <!--                    href="#"-->
        <!--                    :class="[-->
        <!--                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',-->
        <!--                      'block px-4 py-2 text-sm',-->
        <!--                    ]"-->
        <!--                    >Day view</a-->
        <!--                  >-->
        <!--                </MenuItem>-->
        <!--                <MenuItem v-slot="{ active }">-->
        <!--                  <a-->
        <!--                    href="#"-->
        <!--                    :class="[-->
        <!--                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',-->
        <!--                      'block px-4 py-2 text-sm',-->
        <!--                    ]"-->
        <!--                    >Week view</a-->
        <!--                  >-->
        <!--                </MenuItem>-->
        <!--                <MenuItem v-slot="{ active }">-->
        <!--                  <a-->
        <!--                    href="#"-->
        <!--                    :class="[-->
        <!--                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',-->
        <!--                      'block px-4 py-2 text-sm',-->
        <!--                    ]"-->
        <!--                    >Month view</a-->
        <!--                  >-->
        <!--                </MenuItem>-->
        <!--                <MenuItem v-slot="{ active }">-->
        <!--                  <a-->
        <!--                    href="#"-->
        <!--                    :class="[-->
        <!--                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',-->
        <!--                      'block px-4 py-2 text-sm',-->
        <!--                    ]"-->
        <!--                    >Year view</a-->
        <!--                  >-->
        <!--                </MenuItem>-->
        <!--              </div>-->
        <!--            </MenuItems>-->
        <!--          </transition>-->
        <!--        </Menu>-->
        <!--        <div class="ml-6 h-6 w-px bg-gray-300" />-->
      </div>
      <!--      <Menu as="div" class="relative ml-6 md:hidden">-->
      <!--        <MenuButton-->
      <!--          class="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500"-->
      <!--        >-->
      <!--          <span class="sr-only">Open menu</span>-->
      <!--          <EllipsisHorizontalIcon class="h-5 w-5" aria-hidden="true" />-->
      <!--        </MenuButton>-->

      <!--        <transition-->
      <!--          enter-active-class="transition ease-out duration-100"-->
      <!--          enter-from-class="transform opacity-0 scale-95"-->
      <!--          enter-to-class="transform opacity-100 scale-100"-->
      <!--          leave-active-class="transition ease-in duration-75"-->
      <!--          leave-from-class="transform opacity-100 scale-100"-->
      <!--          leave-to-class="transform opacity-0 scale-95"-->
      <!--        >-->
      <!--          <MenuItems-->
      <!--            class="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"-->
      <!--          >-->
      <!--            <div class="py-1">-->
      <!--              <MenuItem v-slot="{ active }">-->
      <!--                <a-->
      <!--                  href="#"-->
      <!--                  :class="[-->
      <!--                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',-->
      <!--                    'block px-4 py-2 text-sm',-->
      <!--                  ]"-->
      <!--                  >Create event</a-->
      <!--                >-->
      <!--              </MenuItem>-->
      <!--            </div>-->
      <!--            <div class="py-1">-->
      <!--              <MenuItem v-slot="{ active }">-->
      <!--                <a-->
      <!--                  href="#"-->
      <!--                  :class="[-->
      <!--                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',-->
      <!--                    'block px-4 py-2 text-sm',-->
      <!--                  ]"-->
      <!--                  >Go to today</a-->
      <!--                >-->
      <!--              </MenuItem>-->
      <!--            </div>-->
      <!--            <div class="py-1">-->
      <!--              <MenuItem v-slot="{ active }">-->
      <!--                <a-->
      <!--                  href="#"-->
      <!--                  :class="[-->
      <!--                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',-->
      <!--                    'block px-4 py-2 text-sm',-->
      <!--                  ]"-->
      <!--                  >Day view</a-->
      <!--                >-->
      <!--              </MenuItem>-->
      <!--              <MenuItem v-slot="{ active }">-->
      <!--                <a-->
      <!--                  href="#"-->
      <!--                  :class="[-->
      <!--                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',-->
      <!--                    'block px-4 py-2 text-sm',-->
      <!--                  ]"-->
      <!--                  >Week view</a-->
      <!--                >-->
      <!--              </MenuItem>-->
      <!--              <MenuItem v-slot="{ active }">-->
      <!--                <a-->
      <!--                  href="#"-->
      <!--                  :class="[-->
      <!--                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',-->
      <!--                    'block px-4 py-2 text-sm',-->
      <!--                  ]"-->
      <!--                  >Month view</a-->
      <!--                >-->
      <!--              </MenuItem>-->
      <!--              <MenuItem v-slot="{ active }">-->
      <!--                <a-->
      <!--                  href="#"-->
      <!--                  :class="[-->
      <!--                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',-->
      <!--                    'block px-4 py-2 text-sm',-->
      <!--                  ]"-->
      <!--                  >Year view</a-->
      <!--                >-->
      <!--              </MenuItem>-->
      <!--            </div>-->
      <!--          </MenuItems>-->
      <!--        </transition>-->
      <!--      </Menu>-->
    </div>
  </header>
</template>
