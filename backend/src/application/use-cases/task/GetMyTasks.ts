import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { Task } from "../../../domain/entities/Task";
import { UserRole } from "../../../domain/entities/User";

export class GetMyTasksUseCase {
    constructor(
        private taskRepository: ITaskRepository
    ) {}

    /**
     * Retrieves all tasks assigned to the current user.
     * 
     * @param actor - The authenticated user requesting their tasks.
     * @returns A list of Task entities assigned to the actor.
     */
    async execute(
        actor: { id: string; role: UserRole }
    ): Promise<Task[]> {
        
        // 1. Validate actor.id is present
        if (!actor || !actor.id) {
            throw new Error("Unauthorized: Identity verification failed.");
        }

        // 2. Fetch tasks using the repository
        // All roles (ADMIN, PM, USER) are allowed to see tasks assigned to them.
        const tasks = await this.taskRepository.findByAssignedTo(actor.id);

        // 3. Return tasks (returns empty array if none found)
        return tasks;
    }
}
