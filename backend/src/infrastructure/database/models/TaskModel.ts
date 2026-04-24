import mongoose, { Schema, Document } from 'mongoose';
import { TaskStatus } from '../../../domain/entities/Task';

export interface ITaskProgressDocument {
    userId: string;
    note: string;
    createdAt: Date;
}

export interface ITaskDocument extends Document<string> {
    _id: string;
    title: string;
    description: string;
    status: TaskStatus;
    projectId: string;
    assignedTo: string;
    progressNotes: ITaskProgressDocument[];
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
    {
        _id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: { 
            type: String, 
            enum: Object.values(TaskStatus),
            default: TaskStatus.PENDING,
            required: true 
        },
        projectId: { type: String, required: true, ref: 'Project' },
        assignedTo: { type: String, required: true, ref: 'User' },
        progressNotes: [{
            userId: { type: String, required: true, ref: 'User' },
            note: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Index for faster lookups
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ assignedTo: 1 });

export const TaskModel = mongoose.model<ITaskDocument>('Task', TaskSchema);
