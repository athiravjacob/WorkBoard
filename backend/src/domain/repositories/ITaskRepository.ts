import { Task } from '../entities/Task';

export interface ITaskRepository {
    save(task: Task): Promise<void>;
    findById(id: string): Promise<Task | null>;
    findAllByProject(projectId: string): Promise<Task[]>;
}
