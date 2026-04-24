import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { Task } from "../../domain/entities/Task";
import { TaskModel } from "../database/models/TaskModel";
import { TaskMapper } from "../mappers/TaskMapper";

export class MongooseTaskRepository implements ITaskRepository {
    
    async save(task: Task): Promise<void> {
        const persistence = TaskMapper.toPersistence(task);
        
        await TaskModel.findOneAndUpdate(
            { _id: task.id },
            persistence,
            { upsert: true, new: true }
        );
    }

    async findById(id: string): Promise<Task | null> {
        const doc = await TaskModel.findById(id);
        if (!doc) return null;
        
        return TaskMapper.toDomain(doc);
    }

    async findAllByProject(projectId: string): Promise<Task[]> {
        const docs = await TaskModel.find({ projectId }).sort({ createdAt: -1 });
        return docs.map(doc => TaskMapper.toDomain(doc));
    }

    async update(task: Task): Promise<void> {
        await this.save(task);
    }

    async delete(id: string): Promise<void> {
        await TaskModel.deleteOne({ _id: id });
    }
}
