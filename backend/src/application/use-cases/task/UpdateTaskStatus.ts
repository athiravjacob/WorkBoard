import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { TaskStatus } from "../../../domain/entities/Task";

import { UserRole } from "../../../domain/entities/User";
import { eventBus, WORKBOARD_EVENTS } from "../../../infrastructure/events/eventBus";


export interface UpdateTaskStatusDTO {
    taskId: string;
    status: TaskStatus;
    redoNote?: string;
}

export class UpdateTaskStatusUseCase {
    constructor(
        private taskRepository: ITaskRepository,
        private userRepository: IUserRepository,
        private projectRepository: IProjectRepository
    ) {}



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

        // 4. Emit event for notifications
        const actorUser = await this.userRepository.findById(actor.id);
        const actorName = actorUser ? actorUser.name : "A user";

        const project = await this.projectRepository.findById(task.projectId);
        const pmId = project ? project.pmId : null;

        eventBus.emit(WORKBOARD_EVENTS.TASK_STATUS_CHANGED, {
            taskId: task.id,
            taskTitle: task.title,
            newStatus: dto.status,
            pmId: pmId,
            assignedToId: task.assignedTo,
            actorId: actor.id,
            actorName: actorName,
            redoNote: dto.redoNote
        });


    }
}
