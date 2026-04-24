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
            { 
                upsert: true, 
                returnDocument: 'after' // Replaces new: true
            }
        ).exec(); 
    }

    async findById(id: string): Promise<Task | null> {
        const doc = await TaskModel.findById(id)
            .populate('assignedTo', 'name email')
            .populate('progressNotes.userId', 'name email')
            .exec();
            
        if (!doc) return null;
        
        return TaskMapper.toDomain(doc);
    }

    async findByProjectId(projectId: string): Promise<Task[]> {
        const docs = await TaskModel.find({ projectId })
            .populate('assignedTo', 'name email') 
            .populate('progressNotes.userId', 'name email')
            .sort({ createdAt: -1 })
            .exec();
        return docs.map(doc => TaskMapper.toDomain(doc));
    }

    async findByProjectIdAndAssignedTo(projectId: string, userId: string): Promise<Task[]> {
        const docs = await TaskModel.find({ projectId, assignedTo: userId })
            .populate('assignedTo', 'name email') 
            .populate('projectId', 'title')
            .populate('progressNotes.userId', 'name email')
            .sort({ createdAt: -1 })
            .exec();
        return docs.map(doc => TaskMapper.toDomain(doc));
    }

    async findByAssignedTo(userId: string): Promise<Task[]> {
        const docs = await TaskModel.find({ assignedTo: userId })
            .populate('assignedTo', 'name email') 
            .populate('projectId', 'title') 
            .populate('progressNotes.userId', 'name email')
            .sort({ createdAt: -1 })
            .exec();
        return docs.map(doc => TaskMapper.toDomain(doc));
    }

    async addNote(taskId: string, note: { userId: string, note: string, createdAt: Date }): Promise<void> {
        await TaskModel.updateOne(
            { _id: taskId },
            { $push: { progressNotes: note } }
        ).exec();
    }

    async update(task: Task): Promise<void> {
        await this.save(task);
    }

    async delete(id: string): Promise<void> {
        await TaskModel.deleteOne({ _id: id });
    }
}
