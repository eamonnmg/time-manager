import type { TimeBlock } from "@/types";

export function msToHours(ms) {
  return ms / 1000 / 60 / 60;
}

export function hoursToMs(hours) {
  return hours * 60 * 60 * 1000;
}

export function msToMinutes(ms): number {
  return ms / 1000 / 60;
}

export function minutesToMs(minutes): number {
  return minutes * 60 * 1000;
}

export function getTimeBlockEnd(timeBlock: TimeBlock): Date {
  return new Date(new Date(timeBlock.start).getTime() + timeBlock.duration);
}
