import { Task } from '../entities/Task';

export interface ITaskRepository {
    save(task: Task): Promise<void>;
    findById(id: string): Promise<Task | null>;
    findByProjectId(projectId: string): Promise<Task[]>;
    findByProjectIdAndAssignedTo(projectId: string, userId: string): Promise<Task[]>;
    findByAssignedTo(userId: string): Promise<Task[]>;
}
