import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/AuthMiddleware';
import { TaskStatus, TaskProgress } from '../../domain/entities/Task';
import { UserRole } from '../../domain/entities/User';
import { CreateTaskDTO } from '../../application/use-cases/task/CreateTask';
import { GetTasksByProjectDTO } from '../../application/use-cases/task/GetTasksByProject';
import { UpdateTaskStatusDTO } from '../../application/use-cases/task/UpdateTaskStatus';
import { AddTaskNoteDTO } from '../../application/use-cases/task/AddTaskNote';

// --- Interfaces (Input Ports) ---

export interface ICreateTaskUseCase {
    execute(dto: CreateTaskDTO, actor: { id: string; role: UserRole }): Promise<any>;
}

export interface IGetTasksByProjectUseCase {
    execute(dto: GetTasksByProjectDTO, actor: { id: string; role: UserRole }): Promise<any[]>;
}

export interface IGetMyTasksUseCase {
    execute(actor: { id: string; role: UserRole }): Promise<any[]>;
}

export interface IUpdateTaskStatusUseCase {
    execute(dto: UpdateTaskStatusDTO, actor: { id: string; role: UserRole }): Promise<void>;
}

export interface IAddTaskNoteUseCase {
    execute(dto: AddTaskNoteDTO, actor: { id: string; role: UserRole }): Promise<TaskProgress>;
}

export class TaskController {
    constructor(
        private readonly createTaskUseCase: ICreateTaskUseCase,
        private readonly getTasksByProjectUseCase: IGetTasksByProjectUseCase,
        private readonly getMyTasksUseCase: IGetMyTasksUseCase,
        private readonly updateTaskStatusUseCase: IUpdateTaskStatusUseCase,
        private readonly addTaskNoteUseCase: IAddTaskNoteUseCase
    ) {}

    /**
     * POST /projects/:projectId/tasks
     */
    public createTask = async (req: AuthRequest<{ projectId: string }>, res: Response, next: NextFunction) => {
        try {
            const { projectId } = req.params;
            const { title, description, assignedTo } = req.body;
            const actor = req.user!;

            const task = await this.createTaskUseCase.execute(
                { title, description, projectId, assignedTo },
                actor
            );
            
            res.status(201).json({
                success: true,
                message: "Task created successfully",
                task: this.mapToDTO(task)
            });
        } catch (error: any) {
            console.error("Create task error:", error);
            res.status(error.message.includes('Unauthorized') ? 403 : 400).json({ 
                error: error.message || "Failed to create task" 
            });
        }
    }

    /**
     * GET /projects/:projectId/tasks
     */
    public getTasksByProject = async (req: AuthRequest<{ projectId: string }>, res: Response, next: NextFunction) => {
        try {
            const { projectId } = req.params;
            const actor = req.user!;

            const tasks = await this.getTasksByProjectUseCase.execute(
                { projectId },
                actor
            );

            res.status(200).json({
                success: true,
                data: tasks.map(task => this.mapToDTO(task))
            });
        } catch (error: any) {
            console.error("Get project tasks error:", error);
            res.status(500).json({ error: "Failed to fetch project tasks" });
        }
    }

    /**
     * GET /tasks/me
     */
    public getMyTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const actor = req.user!;

            const tasks = await this.getMyTasksUseCase.execute(actor);

            res.status(200).json({
                success: true,
                data: tasks.map(task => this.mapToDTO(task))
            });
        } catch (error: any) {
            console.error("Get my tasks error:", error);
            res.status(500).json({ error: "Failed to fetch your tasks" });
        }
    }

    /**
     * PATCH /tasks/:taskId/status
     */
    public updateStatus = async (req: AuthRequest<{ taskId: string }>, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params;
            const { status, redoNote } = req.body;
            const actor = req.user!;

            await this.updateTaskStatusUseCase.execute(
                { taskId, status, redoNote },
                actor
            );

            res.status(200).json({
                success: true,
                message: "Task status updated successfully"
            });
        } catch (error: any) {
            console.error("Update task status error:", error);
            res.status(400).json({ error: error.message || "Failed to update status" });
        }
    }

    /**
     * POST /tasks/:taskId/notes
     */
    public addTaskNote = async (req: AuthRequest<{ taskId: string }>, res: Response, next: NextFunction) => {
        try {
            const { taskId } = req.params;
            const { note } = req.body;
            const actor = req.user!;

            const newNote = await this.addTaskNoteUseCase.execute(
                { taskId, note },
                actor
            );

            res.status(201).json({
                success: true,
                message: "Progress note added successfully",
                data: newNote
            });
        } catch (error: any) {
            console.error("Add task note error:", error);
            res.status(400).json({ error: error.message || "Failed to add note" });
        }
    }

    /**
     * Helper to map Entity to DTO within the Presentation Layer
     * This ensures domain logic/private fields don't leak into JSON
     */
    private mapToDTO(task: any) {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            projectId: task.projectId,
            assignedTo: task.assignedTo,
            assignedToDetails: task.assignedToDetails,
            projectDetails: task.projectDetails,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
        };
    }
}
