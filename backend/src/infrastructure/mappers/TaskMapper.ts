import { Task } from "../../domain/entities/Task";
import { ITaskDocument } from "../database/models/TaskModel";

export class TaskMapper {
    /**
     * Converts a database document to a domain Entity.
     */
    public static toDomain(doc: ITaskDocument): Task {
        // 1. Safe extraction of the assigned user ID
        const isUserPopulated = typeof doc.assignedTo === 'object' && doc.assignedTo !== null;
        
        const assignedToId = isUserPopulated
            ? (doc.assignedTo as any)._id.toString()
            : doc.assignedTo.toString();

        // 2. Safe extraction of user details
        const assignedToDetails = isUserPopulated ? {
            name: (doc.assignedTo as any).name,
            email: (doc.assignedTo as any).email
        } : undefined;

        // 3. Safe extraction of project details
        const isProjectPopulated = typeof doc.projectId === 'object' && doc.projectId !== null;
        
        const projectId = isProjectPopulated
            ? (doc.projectId as any)._id.toString()
            : doc.projectId.toString();
            
        const projectDetails = isProjectPopulated ? {
            title: (doc.projectId as any).title
        } : undefined;

        return Task.load({
            id: doc._id,
            title: doc.title,
            description: doc.description,
            status: doc.status,
            projectId: projectId,
            assignedTo: assignedToId,
            assignedToDetails,
            projectDetails, // PASSING PROJECT CONTEXT
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
