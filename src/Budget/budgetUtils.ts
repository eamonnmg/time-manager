import type { TimeBlock } from "@/shared/types";

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

export function calcPercentageOfTimeAllocated(
  allocatedTimeMs: number,
  totalTimeMs: number,
) {
  return (allocatedTimeMs / totalTimeMs) * 100;
}
