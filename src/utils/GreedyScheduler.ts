import { TaskScheduler } from "~/interfaces/TaskScheduler";
import { LearningPlan } from "./LearningPlan";

export class GreedyScheduler implements TaskScheduler {
    private assignTask(task: Task, availableSlots: TimeSlot[]): {assignment: ScheduledTask | null, deadlineBreached: boolean, availableSlots: TimeSlot[]}
    {
        let assignment: ScheduledTask | null = null
        let deadlineBreached = false
        for(const [i, slot] of availableSlots.entries()) {
            if (slot.endTime - slot.startTime >= task.expectedDuration) {
                assignment = {
                    name: task.name, 
                    startTime: slot.startTime, 
                    endTime: slot.startTime + task.expectedDuration
                };

                if (assignment.endTime > task.dueTime) {
                    deadlineBreached = true;
                }

                if (assignment.endTime < slot.endTime) {
                    availableSlots[i] = {
                        startTime: assignment.endTime, 
                        endTime: slot.endTime
                    };
                } else {
                    availableSlots.splice(i, 1);
                }
                break;
            }
        }

        return {
            assignment, 
            deadlineBreached, 
            availableSlots
        };
    }

    private expectedStartTimeTaskComparator(task1: Task, task2: Task): number
    {
        const maxExpectedStartTime1 = task1.dueTime - task1.expectedDuration;
        const maxExpectedStartTime2 = task2.dueTime - task2.expectedDuration;
        return maxExpectedStartTime1 - maxExpectedStartTime2;
    }
  
    public schedule(learningPlan: LearningPlan): {schedule: ScheduledTask[], deadlinesBreached: string[], unassignedTasks: string[]}
    {
        const tasks = learningPlan.getTasks();
        let currentSlots = learningPlan.getAvailabilities();

        tasks.sort(this.expectedStartTimeTaskComparator.bind(this));
        
        const schedule: ScheduledTask[] = [];
        const deadlinesBreached: string[] = [];
        const unassignedTasks: string[] = [];

        for (const task of tasks) {
            const {assignment, deadlineBreached, availableSlots} = this.assignTask(task, currentSlots);
            currentSlots = availableSlots;
            if (deadlineBreached) {
                deadlinesBreached.push(task.name);
            }
            if (assignment) {
                schedule.push(assignment);
            } else {
                unassignedTasks.push(task.name);
            }
        }
        return {
            schedule,
            deadlinesBreached,
            unassignedTasks
        };
    }
}