import { Task } from "../../domain/entities/Task";
import { ITaskDocument } from "../database/models/TaskModel";

export class TaskMapper {
    /**
     * Converts a database document to a domain Entity.
     */
    public static toDomain(doc: ITaskDocument): Task {
        return Task.load({
            id: doc._id,
            title: doc.title,
            description: doc.description,
            status: doc.status,
            projectId: doc.projectId,
            assignedTo: doc.assignedTo,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            progressNotes: doc.progressNotes.map(note => ({
                userId: note.userId,
                note: note.note,
                createdAt: note.createdAt
            }))
        });
    }

    /**
     * Converts a domain Entity to a plain persistence object.
     */
    public static toPersistence(task: Task): any {
        return {
            _id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            projectId: task.projectId,
            assignedTo: task.assignedTo,
            progressNotes: task.progressNotes.map(note => ({
                userId: note.userId,
                note: note.note,
                createdAt: note.createdAt
            }))
        };
    }
}
