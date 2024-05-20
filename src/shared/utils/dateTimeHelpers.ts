import {
  type Duration,
  hoursToMilliseconds,
  intervalToDuration,
  minutesToMilliseconds,
} from "date-fns";

// ref: https://github.com/date-fns/date-fns/issues/1982#issuecomment-698733557
export function milliSecondsToDuration(milliSeconds: number): Duration {
  const epoch = new Date(0);
  const secondsAfterEpoch = new Date(milliSeconds);
  return intervalToDuration({
    start: epoch,
    end: secondsAfterEpoch,
  });
}
