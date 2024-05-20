import type { TimeBlock, TimeBlockWithActivity } from "@/types";
import { addMilliseconds, isWithinInterval, subMilliseconds } from "date-fns";

export function roundToNearest15Minutes(date) {
  const minutes = date.getMinutes();
  const roundedMinutes = Math.round(minutes / 15) * 15;
  date.setMinutes(roundedMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

export function getTimeBlockEnd(timeBlock: TimeBlock): Date {
  return new Date(new Date(timeBlock.start).getTime() + timeBlock.duration);
}

export function nearestTimeBlockAboveDate(
  date: Date,
  timeBlocks: TimeBlockWithActivity[],
) {
  return timeBlocks
    .slice() // dont mutate the original array
    .sort((tb1, tb2) => {
      return new Date(tb2.start) - new Date(tb1.start);
    })
    .find((timeBlock) => {
      return date > getTimeBlockEnd(timeBlock);
    });
}

export function nearestTimeBlockBelowDate(
  date: Date,
  timeBlocks: TimeBlockWithActivity[],
) {
  return timeBlocks
    .slice() // dont mutate the original array
    .sort((tb1, tb2) => {
      return new Date(tb1.start) - new Date(tb2.start);
    })
    .find((timeBlock) => {
      return date < new Date(timeBlock.start);
    });
}

// return timeblocks between start and end dates
export function timeblocksBetweenDates(
  start: Date,
  end: Date,
  timeBlocks: TimeBlockWithActivity[],
) {
  return timeBlocks.filter((timeBlock) => {
    return (
      // overlapping timeblock partially from above
      isWithinInterval(new Date(timeBlock.start), {
        start: subMilliseconds(start, 1),
        end,
      }) || // overlapping timeblock partially from below
      isWithinInterval(getTimeBlockEnd(timeBlock), {
        start: addMilliseconds(start, 1),
        end,
      })
    );
  });
}

export function isDateRangeOverlappingDateRange(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date,
) {
  return (
    isWithinInterval(start1, { start: start2, end: end2 }) ||
    isWithinInterval(end1, { start: start2, end: end2 }) ||
    isWithinInterval(start2, { start: start1, end: end1 }) ||
    isWithinInterval(end2, { start: start1, end: end1 })
  );
}
