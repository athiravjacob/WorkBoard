import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { TaskStatus } from "../../../domain/entities/Task";
import { UserRole } from "../../../domain/entities/User";

export interface UpdateTaskStatusDTO {
    taskId: string;
    status: TaskStatus;
    redoNote?: string;
}

export class UpdateTaskStatusUseCase {
    constructor(private taskRepository: ITaskRepository) {}

    async execute(
        dto: UpdateTaskStatusDTO,
        actor: { id: string; role: UserRole }
    ): Promise<void> {
        // 1. Fetch task
        const task = await this.taskRepository.findById(dto.taskId);
        if (!task) {
            throw new Error("Task not found");
        }

        // 2. Use domain entity to enforce business logic
        task.changeStatus(dto.status, actor, dto.redoNote);

        // 3. Persist changes
        await this.taskRepository.save(task);
    }
}
