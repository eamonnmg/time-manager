export type ModelId = string | number;

export interface TimeBlock {
  id: ModelId;
  activityId: ModelId;
  start: Date;
  /**
   * Duration in milliseconds
   */
  duration: number;
  // todo: remove - color should come from activity
  color: string;
}

export type TimeBlockCreate = Omit<TimeBlock, "id">;

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

export interface CreateBudgetArgs {
  name: string;
  /**
   * Duration in milliseconds
   */
  duration: number;
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

export interface BudgetPeriod {
  id: ModelId;
  budgetId: ModelId;
  startDate: Date;
  // defaults to Budget duration from startDate
  // will be overridden if budget period is cancelled
  endDate: Date;
}

export interface BudgetPeriodCreate
  extends Omit<BudgetPeriod, "id" | "endDate"> {}

export interface BudgetPeriodWithBudget extends BudgetPeriod {
  budget: Budget;
}

export interface Color {
  // hex value
  value: string;
  // readable name of color
  name: string;
}
