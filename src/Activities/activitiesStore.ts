import { ref } from "vue";
import { defineStore } from "pinia";
import type { Activity } from "@/types";

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
export const useActivitiesStore = defineStore(
  "activities",
  () => {
    const activities = ref<Activity[]>([
      reading,
      nonFiction,
      crimeAndPunishment,
    ]);

    function getById(id: string | number): Activity | undefined {
      return activities.value.find((a: Activity) => a.id === id);
    }

    function add(activity: Activity): Activity {
      const activityId = self.crypto.randomUUID();
      const newActivity = {
        ...activity,
        id: activityId,
      };
      activities.value.push(newActivity);
      return newActivity;
    }

    function edit(activity: Activity) {
      const targetActivityIdx = activities.value.findIndex(
        (a: Activity) => a.id === activity.id,
      );
      if (targetActivityIdx === -1) {
        console.error("activity not found");
        return;
      }
      activities.value[targetActivityIdx] = activity;
    }

    return { activities, getById, add, edit };
  },
  {
    persist: true,
  },
);
