
export class LearningPlan {
    private availabilities: TimeSlot[];
    private tasks: Task[];

    constructor() {
        this.availabilities = [];
        this.tasks = [];
    }
    
    public addAvailability(startTime: number, endTime: number): void
    {
        this.availabilities.push({startTime, endTime});
    }

    public addTask(name: string, expectedDuration: number, dueTime: number): void
    {
        this.tasks.push({name, expectedDuration, dueTime});
    }

    public getAvailabilities(): TimeSlot[]
    {
        return JSON.parse(JSON.stringify(this.availabilities));
    }

    public getTasks(): Task[]
    {
        return JSON.parse(JSON.stringify(this.tasks));
    }
}