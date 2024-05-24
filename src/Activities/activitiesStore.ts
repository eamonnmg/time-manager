import { ref } from "vue";
import { defineStore } from "pinia";
import type { Activity, ModelId } from "@/shared/types";

export const useActivitiesStore = defineStore(
  "activities",
  () => {
    const activities = ref<Activity[]>([]);

    function getById(id: ModelId): Activity | undefined {
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
