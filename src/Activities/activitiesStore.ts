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
export const useActivitiesStore = defineStore("activities", () => {
  const activities = ref<Activity[]>([reading, nonFiction, crimeAndPunishment]);
  function add(activity: Activity) {
    const activityId = self.crypto.randomUUID();
    activities.value.push({
      ...activity,
      id: activityId,
    });
  }

  return { activities, add };
});
