import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/AuthMiddleware';
import { CreateTaskUseCase } from '../../application/use-cases/task/CreateTask';
import { GetTasksByProjectUseCase } from '../../application/use-cases/task/GetTasksByProject';
import { GetMyTasksUseCase } from '../../application/use-cases/task/GetMyTasks';

export class TaskController {
    constructor(
        private createTaskUseCase: CreateTaskUseCase,
        private getTasksByProjectUseCase: GetTasksByProjectUseCase,
        private getMyTasksUseCase: GetMyTasksUseCase
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
            taskId: task.id
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
            data: tasks
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
            data: tasks
        });
    }
}
