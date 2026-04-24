import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { UserRole } from "../../../domain/entities/User";
import { TaskProgress } from "../../../domain/entities/Task";

export interface AddTaskNoteDTO {
    taskId: string;
    note: string;
}

export class AddTaskNoteUseCase {
    constructor(private taskRepository: ITaskRepository) {}

    async execute(
        dto: AddTaskNoteDTO,
        actor: { id: string; role: UserRole }
    ): Promise<TaskProgress> {
        // 1. Fetch task
        const task = await this.taskRepository.findById(dto.taskId);
        if (!task) {
            throw new Error("Task not found");
        }

        // 2. Add note via entity (business logic validation)
        const newNote = task.addProgressNote(actor, dto.note);

        // 3. Persist the note
        await this.taskRepository.addNote(dto.taskId, newNote);

        return newNote;
    }
}
