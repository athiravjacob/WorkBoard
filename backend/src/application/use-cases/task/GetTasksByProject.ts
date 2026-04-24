import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { Task } from "../../../domain/entities/Task";
import { UserRole } from "../../../domain/entities/User";

export interface GetTasksByProjectDTO {
    projectId: string;
}

export class GetTasksByProjectUseCase {
    constructor(
        private taskRepository: ITaskRepository,
        private projectRepository: IProjectRepository
    ) {}

    /**
     * Retrieves tasks for a given project with role-based access control.
     * 
     * @param dto - The project ID.
     * @param actor - The user requesting the tasks.
     * @returns A list of Task entities.
     */
    async execute(
        dto: GetTasksByProjectDTO,
        actor: { id: string; role: UserRole }
    ): Promise<Task[]> {
        
        // 1. Validate projectId is not empty
        if (!dto.projectId || !dto.projectId.trim()) {
            throw new Error("Project ID is required");
        }

        // 2. Fetch project to ensure it exists
        const project = await this.projectRepository.findById(dto.projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        // 3. Apply role-based logic
        
        // ADMIN and PM can see all tasks in the project
        if (actor.role === UserRole.ADMIN || actor.role === UserRole.PM) {
            return await this.taskRepository.findByProjectId(dto.projectId);
        }

        // REGULAR USERS can only see tasks assigned to them in that project
        if (actor.role === UserRole.USER) {
            return await this.taskRepository.findByProjectIdAndAssignedTo(dto.projectId, actor.id);
        }

        // Otherwise throw Unauthorized
        throw new Error("Unauthorized");
    }
}
