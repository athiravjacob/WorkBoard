import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/AuthMiddleware';
import { CreateTaskUseCase } from '../../application/use-cases/task/CreateTask';
import { GetTasksByProjectUseCase } from '../../application/use-cases/task/GetTasksByProject';
import { GetMyTasksUseCase } from '../../application/use-cases/task/GetMyTasks';
import { UpdateTaskStatusUseCase } from '../../application/use-cases/task/UpdateTaskStatus';

export class TaskController {
    constructor(
        private createTaskUseCase: CreateTaskUseCase,
        private getTasksByProjectUseCase: GetTasksByProjectUseCase,
        private getMyTasksUseCase: GetMyTasksUseCase,
        private updateTaskStatusUseCase: UpdateTaskStatusUseCase
    ) {}

    /**
     * POST /projects/:projectId/tasks
     */
    createTask = async (req: AuthRequest<{ projectId: string }>, res: Response, next: NextFunction) => {
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
            task: {
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
            }
        });
    }

    /**
     * GET /projects/:projectId/tasks
     */
    getTasksByProject = async (req: AuthRequest<{ projectId: string }>, res: Response, next: NextFunction) => {
        const { projectId } = req.params;
        const actor = req.user!;

        const tasks = await this.getTasksByProjectUseCase.execute(
            { projectId },
            actor
        );

        res.status(200).json({
            success: true,
            data: tasks.map(task => ({
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
            }))
        });
    }

    /**
     * GET /tasks/me
     */
    getMyTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
        const actor = req.user!;

        const tasks = await this.getMyTasksUseCase.execute(actor);

        res.status(200).json({
            success: true,
            data: tasks.map(task => ({
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
            }))
        });
    }

    /**
     * PATCH /tasks/:taskId/status
     */
    updateStatus = async (req: AuthRequest<{ taskId: string }>, res: Response, next: NextFunction) => {
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
    }
}
