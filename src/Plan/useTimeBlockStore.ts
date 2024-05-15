import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import type { ModelId, TimeBlock } from "@/types";
import { useActivitiesStore } from "@/Activities/activitiesStore";
import { endOfDay, isWithinInterval, startOfDay, subMinutes } from "date-fns";
import { getTimeBlockEnd } from "@/Plan/DayView/utils";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebrtcProvider } from "y-webrtc";
import { supabase } from "@/lib/supabase";
import { fromUint8Array, toUint8Array } from "js-base64";

async function getYjsUpdatesFromSupabase() {
  const { data } = await supabase
    .from("yjs-updates")
    .select()
    .order("created_at", { ascending: false })
    .limit(1);
  return data;
}

async function insertYjsUpdateToSupabase(yDoc) {
  const documentState = Y.encodeStateAsUpdate(yDoc); // is a Uint8Array
  // Transform Uint8Array to a Base64-String
  const base64Encoded = fromUint8Array(documentState);
  const { data, error } = await supabase
    .from("yjs-updates")
    .upsert({ id: 1, value: base64Encoded });

  return { data, error };
}

export const useTimeBlockStore = defineStore(
  "timeBlocks",
  () => {
    const activityStore = useActivitiesStore();
    const timeBlocks = ref<TimeBlock[]>([]);

    const ydoc = new Y.Doc();
    const roomName = "test-room";
    const persistence = new IndexeddbPersistence(roomName, ydoc);
    // const provider = new WebrtcProvider(roomName, ydoc, {
    //   filterBcConns: false,
    // });

    ydoc.on("update", (update, origin) => {
      console.log("origin", origin);
      // dont push updates from IndexDB provider to Supabase
      if (origin !== null) {
        return;
      }
      // insert entire doc every time for now
      insertYjsUpdateToSupabase(ydoc);
    });

    getYjsUpdatesFromSupabase().then((test) => {
      const yUpdate = toUint8Array(test[0].value);
      Y.applyUpdate(ydoc, yUpdate);
    });

    persistence.once("synced", () => {
      console.log("initial content loaded");
      timeBlocks.value = yTimeBlocks.toArray().map((i) => {
        return {
          ...i,
          start: new Date(i.start),
        };
      });
    });
    const yTimeBlocks = ydoc.getArray();

    yTimeBlocks.observe(() => {
      timeBlocks.value = yTimeBlocks.toArray().map((i) => {
        return {
          ...i,
          start: new Date(i.start),
        };
      });
    });

    const timeBlocksWithActivity = computed(() => {
      return timeBlocks.value.map((tb: TimeBlock) => {
        return {
          ...tb,
          activity: activityStore.getById(tb.activityId),
        };
      });
    });

    const timeBlocksWithActivityForDay = computed(() => {
      return (day: Date) => {
        return timeBlocksWithActivity.value.filter((tb: TimeBlock) => {
          const isStartWithinDay = isWithinInterval(new Date(tb.start), {
            start: startOfDay(day),
            end: endOfDay(day),
          });
          const isEndWithinDay = isWithinInterval(
            // subtract 1 minute from end to make it inclusive of 12:00am
            subMinutes(getTimeBlockEnd(tb), 1),
            {
              start: startOfDay(day),
              end: endOfDay(day),
            },
          );
          return isStartWithinDay || isEndWithinDay;
        });
      };
    });

    const timeBlocksWithActivityForDateRange = computed(() => {
      return (start: Date, end: Date) => {
        return timeBlocksWithActivity.value.filter((tb: TimeBlock) => {
          const x = isWithinInterval(new Date(tb.start), {
            start: new Date(start),
            end: new Date(end),
          });

          if (x) {
            console.log("XXX", new Date(tb.start), start, end);
          }
          // console.log("timeBlocksWithActivityForDateRange", x);
          return x;
        });
      };
    });

    function add(timeBlock: TimeBlock) {
      const timeBlockId = self.crypto.randomUUID();
      // timeBlocks.value.push({
      //   ...timeBlock,
      //   id: timeBlockId,
      // });

      yTimeBlocks.push([
        {
          ...timeBlock,
          id: timeBlockId,
          start: timeBlock.start.toUTCString(),
        },
      ]);

      // insertYjsUpdateToSupabase(ydoc);
    }

    function edit(timeBlock: TimeBlock) {
      const targetTimeBlockIdx = timeBlocks.value.findIndex(
        (tb: TimeBlock) => tb.id === timeBlock.id,
      );
      if (targetTimeBlockIdx === -1) {
        console.error("timeBlock not found");
        return;
      }
      timeBlocks.value[targetTimeBlockIdx] = timeBlock;
    }

    function remove(id: ModelId) {
      timeBlocks.value = timeBlocks.value.filter(
        (tb: TimeBlock) => tb.id !== id,
      );
    }

    return {
      timeBlocks,
      timeBlocksWithActivity,
      timeBlocksWithActivityForDay,
      timeBlocksWithActivityForDateRange,
      add,
      edit,
      remove,
    };
  },
  {
    persist: false,
  },
);
