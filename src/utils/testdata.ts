import type { TimeBlock } from "@/types";
import { add, startOfToday } from "date-fns";

interface HourMin {
  hours: number;
  minutes: number;
}

function createTimeBlockOnToday(
  name: string,
  startHourMin: HourMin,
  durationMin: number,
): TimeBlock {
  const start = add(startOfToday(), startHourMin);
  return {
    name,
    start,
    end: add(start, { minutes: durationMin }),
    color: "bg-blue-200 opacity-80",
  };
}
export const timeBlocks: TimeBlock = [
  createTimeBlockOnToday("work out", { hours: 6, minutes: 30 }, 40),
  createTimeBlockOnToday("breakfast", { hours: 7, minutes: 30 }, 30),
  createTimeBlockOnToday("work", { hours: 8, minutes: 0 }, 60 * 8),
  createTimeBlockOnToday("read", { hours: 19, minutes: 30 }, 90),
];
