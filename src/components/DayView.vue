<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

export interface Activity {
  name: string;
  start: string;
  end: string;
  color: string;
}

interface Props {
  activitiesData: Activity[];
}

const props = withDefaults(defineProps<Props>(), {
  activitiesData: () => [
    // {
    //   name: "Breakfast",
    //   start: new Date(2022, 0, 22, 6).toDateString(),
    //   end: new Date(2022, 0, 22, 7),
    //   color: "bg-blue-50",
    // },
    // {
    //   name: "Flight to Paris",
    //   start: new Date(2022, 0, 22, 7, 30),
    //   end: new Date(2022, 0, 22, 8, 20),
    //   color: "bg-pink-50",
    // },
    // {
    //   name: "Sightseeing",
    //   start: new Date(2022, 0, 22, 11),
    //   end: new Date(2022, 0, 22, 15),
    //   color: "bg-indigo-50",
    // },
  ],
});

interface ActivityUi extends Activity {
  row: number;
  span: number;
}

const container = ref(null);
const containerNav = ref(null);
const containerOffset = ref(null);

const rows = 288; // break 24 hour day into 288 5 minute segments

function activityToActivityUi(activity: Activity): ActivityUi {
  const startHour = new Date(activity.start).getHours();
  const startMinute = new Date(activity.start).getMinutes();
  const endHour = new Date(activity.end).getHours();
  const endMinute = new Date(activity.end).getMinutes();

  const startMin = startHour * 60 + startMinute;
  const endMin = endHour * 60 + endMinute;

  const startRow = Math.round(startMin / 5);
  const duration = Math.round((endMin - startMin) / 5);

  return {
    ...activity,
    row: startRow + 2,
    span: duration,
  };
}

const activities = computed(() => {
  return props.activitiesData.map(activityToActivityUi);
});

onMounted(() => {
  // Set the container scroll position based on the current time.
  const currentMinute = new Date().getHours() * 60;
  container.value.scrollTop =
    ((container.value.scrollHeight -
      containerNav.value.offsetHeight -
      containerOffset.value.offsetHeight) *
      currentMinute) /
    1440;
});
</script>

<template>
  <div ref="container" class="flex flex-auto flex-col overflow-auto">
    <div
      ref="containerNav"
      class="sticky top-0 z-10 grid flex-none grid-cols-7 bg-white text-xs text-gray-500 shadow ring-1 ring-black ring-opacity-5 md:hidden"
    >
      <button type="button" class="flex flex-col items-center pb-1.5 pt-3">
        <span>W</span>
        <!-- Default: "text-gray-900", Selected: "bg-gray-900 text-white", Today (Not Selected): "text-indigo-600", Today (Selected): "bg-indigo-600 text-white" -->
        <span
          class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"
          >19</span
        >
      </button>
      <button type="button" class="flex flex-col items-center pb-1.5 pt-3">
        <span>T</span>
        <span
          class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-indigo-600"
          >20</span
        >
      </button>
      <button type="button" class="flex flex-col items-center pb-1.5 pt-3">
        <span>F</span>
        <span
          class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"
          >21</span
        >
      </button>
      <button type="button" class="flex flex-col items-center pb-1.5 pt-3">
        <span>S</span>
        <span
          class="mt-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-base font-semibold text-white"
          >22</span
        >
      </button>
      <button type="button" class="flex flex-col items-center pb-1.5 pt-3">
        <span>S</span>
        <span
          class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"
          >23</span
        >
      </button>
      <button type="button" class="flex flex-col items-center pb-1.5 pt-3">
        <span>M</span>
        <span
          class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"
          >24</span
        >
      </button>
      <button type="button" class="flex flex-col items-center pb-1.5 pt-3">
        <span>T</span>
        <span
          class="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900"
          >25</span
        >
      </button>
    </div>
    <div class="flex w-full flex-auto">
      <div class="w-14 flex-none bg-white ring-1 ring-gray-100" />
      <div class="grid flex-auto grid-cols-1 grid-rows-1">
        <!-- Horizontal lines -->
        <div
          class="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
          style="grid-template-rows: repeat(48, minmax(3.5rem, 1fr))"
        >
          <div ref="containerOffset" class="row-end-1 h-7"></div>
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              12AM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              1AM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              2AM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              3AM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              4AM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              5AM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              6AM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              7AM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              8AM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              9AM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              10AM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              11AM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              12PM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              1PM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              2PM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              3PM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              4PM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              5PM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              6PM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              7PM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              8PM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              9PM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              10PM
            </div>
          </div>
          <div />
          <div>
            <div
              class="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400"
            >
              11PM
            </div>
          </div>
          <div />
        </div>

        <!-- Events -->
        <ol
          class="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
          :style="`grid-template-rows: repeat(${rows}, minmax(0, 1fr)) auto`"
        >
          <li
            v-for="activity in activities"
            :key="activity.name"
            class="relative mt-px flex"
            :style="`grid-row: ${activity.row} / span ${activity.span}`"
          >
            <a
              href="#"
              :class="`group absolute inset-1 flex flex-col overflow-y-auto rounded-lg ${activity.color} p-2 text-xs leading-5`"
            >
              <p class="order-1 font-semibold text-blue-700">
                {{ activity.name }}
              </p>
              <p class="text-blue-500 group-hover:text-blue-700">
                <time datetime="2022-01-22T06:00">6:00 AM</time>
              </p>
            </a>
          </li>
          <!--          <li class="relative mt-px flex" style="grid-row: 74 / span 12">-->
          <!--            <a-->
          <!--              href="#"-->
          <!--              class="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"-->
          <!--            >-->
          <!--              <p class="order-1 font-semibold text-blue-700">Breakfast</p>-->
          <!--              <p class="text-blue-500 group-hover:text-blue-700">-->
          <!--                <time datetime="2022-01-22T06:00">6:00 AM</time>-->
          <!--              </p>-->
          <!--            </a>-->
          <!--          </li>-->
          <!--          <li class="relative mt-px flex" style="grid-row: 92 / span 10">-->
          <!--            <a-->
          <!--              href="#"-->
          <!--              class="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs leading-5 hover:bg-pink-100"-->
          <!--            >-->
          <!--              <p class="order-1 font-semibold text-pink-700">Flight to Paris</p>-->
          <!--              <p class="order-1 text-pink-500 group-hover:text-pink-700">-->
          <!--                John F. Kennedy International Airport-->
          <!--              </p>-->
          <!--              <p class="text-pink-500 group-hover:text-pink-700">-->
          <!--                <time datetime="2022-01-22T07:30">7:30 AM</time>-->
          <!--              </p>-->
          <!--            </a>-->
          <!--          </li>-->
          <!--          <li class="relative mt-px flex" style="grid-row: 134 / span 18">-->
          <!--            <a-->
          <!--              href="#"-->
          <!--              class="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-indigo-50 p-2 text-xs leading-5 hover:bg-indigo-100"-->
          <!--            >-->
          <!--              <p class="order-1 font-semibold text-indigo-700">Sightseeing</p>-->
          <!--              <p class="order-1 text-indigo-500 group-hover:text-indigo-700">-->
          <!--                Eiffel Tower-->
          <!--              </p>-->
          <!--              <p class="text-indigo-500 group-hover:text-indigo-700">-->
          <!--                <time datetime="2022-01-22T11:00">11:00 AM</time>-->
          <!--              </p>-->
          <!--            </a>-->
          <!--          </li>-->
        </ol>
      </div>
    </div>
  </div>
</template>
