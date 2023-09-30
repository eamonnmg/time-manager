export interface TimeBlock {
  name: string;
  start: string;
  end: string;
  color: string;
}

export interface Day {
  date: string;
  isCurrentMonth?: boolean;
}

export interface Activity {
  id: string | number;
  name: string;
  color: string;
  nestedActivities: Activity[];
}
