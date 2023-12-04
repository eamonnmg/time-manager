export type ModelId = string | number;

export interface TimeBlock {
  id: ModelId;
  activityId: ModelId;
  start: string;
  end: string;
  color: string;
}

export interface TimeBlockWithActivity extends TimeBlock {
  activity: Activity;
}

export interface Day {
  date: string;
  isCurrentMonth?: boolean;
}

export interface Activity {
  id: ModelId;
  name: string;
  color: string;
  nestedActivities: Activity[];
}

export interface Budget {
  id: ModelId;
  name: string;
  /**
   * Duration in milliseconds
   */
  duration: number;
  occupiedTime: number;
}

export interface BudgetActivity {
  id: ModelId;
  budgetId: string | number;
  activityId: string | number;
  /**
   * Allocated time in milliseconds
   */
  allocatedTime: number;
}

export interface BudgetActivityWithActivity extends BudgetActivity {
  activity: Activity;
}
