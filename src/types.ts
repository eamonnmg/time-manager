export interface TimeBlock {
  activity: Activity;
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

export type BudgetId = string | number;

export interface Budget {
  id: BudgetId;
  name: string;
  /**
   * Duration in milliseconds
   */
  duration: number;
  occupiedTime: number;
}

export interface BudgetActivity {
  id: string | number;
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
