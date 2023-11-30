import { LearningPlan } from "~/utils/LearningPlan";

export interface TaskScheduler {
    schedule(learningPlan: LearningPlan): {schedule: ScheduledTask[], deadlinesBreached: string[], unassignedTasks: string[]};
}