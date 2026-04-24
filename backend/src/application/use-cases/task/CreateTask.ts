import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IIdGeneratorService } from "../../services/IIdGeneratorService";
import { Task } from "../../../domain/entities/Task";
import { UserRole } from "../../../domain/entities/User";

export interface CreateTaskDTO {
    title: string;
    description: string;
    projectId: string;
    assignedTo: string;
}

export class CreateTaskUseCase {
    constructor(
        private taskRepository: ITaskRepository,
        private userRepository: IUserRepository,
        private projectRepository: IProjectRepository,
        private idGenerator: IIdGeneratorService
    ) {}

    
    async execute(
        dto: CreateTaskDTO, 
        actor: { id: string; role: UserRole }
    ): Promise<Task> {
        
        // 1. Role validation: Only PM can create tasks
        if (actor.role !== UserRole.PM) {
            throw new Error("Unauthorized: Only Project Managers can create tasks.");
        }

        // 2. Project existence check
        const project = await this.projectRepository.findById(dto.projectId);
        if (!project) {
            throw new Error(`Execution Error: Project with ID ${dto.projectId} does not exist.`);
        }

        // 3. Self-assignment validation: PM cannot assign a task to themselves
        if (actor.id === dto.assignedTo) {
            throw new Error("Invalid Assignment: Project Managers cannot assign tasks to themselves.");
        }

        // 4. User existence check
        const assignedUser = await this.userRepository.findById(dto.assignedTo);
        if (!assignedUser) {
            throw new Error(`Assignment Error: User with ID ${dto.assignedTo} does not exist.`);
        }

        // 5. Generate unique Task ID
        const taskId = this.idGenerator.generate();

        // 6. Create Task entity
        const task = Task.create({
            id: taskId,
            title: dto.title,
            description: dto.description,
            projectId: dto.projectId,
            assignedTo: dto.assignedTo
        });

        // Note: The actor here is the PM (the one who created it)
        task.addProgressNote(actor, "[CREATED] Task created and assigned.");

        // 8. Persist task to repository
        await this.taskRepository.save(task);

        return task;
    }
}
