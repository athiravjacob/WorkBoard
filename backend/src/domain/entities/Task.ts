import { UserRole } from "./User";

export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    REVIEW = 'REVIEW',
    REDO = 'REDO',
    COMPLETED = 'COMPLETED'
}

export interface TaskProgress {
    userId: string;
    note: string;
    createdAt: Date;
}

type Actor = {
    id: string;
    role: UserRole;
};

export class Task {
    private _progressNotes: TaskProgress[] = [];

    private constructor(
        public readonly id: string,
        private _title: string,
        private _description: string,
        private _status: TaskStatus,
        private _projectId: string,
        private _assignedTo: string,
        private _createdAt: Date,
        private _updatedAt: Date
    ) {}

    // 🔍 Getters
    get title(): string { return this._title; }
    get description(): string { return this._description; }
    get status(): TaskStatus { return this._status; }
    get projectId(): string { return this._projectId; }
    get assignedTo(): string { return this._assignedTo; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }
    get progressNotes(): TaskProgress[] { return [...this._progressNotes]; }

    // ✅ Factory: Create new task
    public static create(params: {
        id: string;
        title: string;
        description: string;
        projectId: string;
        assignedTo: string;
    }): Task {

        if (!params.title.trim()) {
            throw new Error("Task title is required");
        }

        if (!params.description.trim()) {
            throw new Error("Task description is required");
        }

        if (!params.assignedTo.trim()) {
            throw new Error("Task must be assigned to a user");
        }

        const now = new Date();

        return new Task(
            params.id,
            params.title,
            params.description,
            TaskStatus.PENDING,
            params.projectId,
            params.assignedTo,
            now,
            now
        );
    }

    public static load(params: {
        id: string;
        title: string;
        description: string;
        status: TaskStatus;
        projectId: string;
        assignedTo: string;
        createdAt: Date;
        updatedAt: Date;
        progressNotes: TaskProgress[];
    }): Task {

        if (!params.title.trim()) throw new Error("Invalid title from DB");
        if (!params.description.trim()) throw new Error("Invalid description from DB");
        if (!params.assignedTo.trim()) throw new Error("Invalid assigned user from DB");

        const task = new Task(
            params.id,
            params.title,
            params.description,
            params.status,
            params.projectId,
            params.assignedTo,
            params.createdAt,
            params.updatedAt
        );

        task._progressNotes = [...params.progressNotes]; 
        return task;
    }

    public updateDetails(title: string, description: string, actor: Actor): void {
        if (this._status === TaskStatus.COMPLETED) {
            throw new Error("Cannot update a completed task");
        }

        if (actor.role !== UserRole.PM) {
            throw new Error("Only PM can update task details");
        }

        if (!title.trim()) throw new Error("Title required");
        if (!description.trim()) throw new Error("Description required");

        if (this._title === title && this._description === description) {
            throw new Error("No changes detected");
        }

        this._title = title;
        this._description = description;
        this.markUpdated();
    }

    public assignTo(userId: string, actor: Actor): void {
        if (this._status === TaskStatus.COMPLETED) {
            throw new Error("Cannot reassign a completed task");
        }

        if (actor.role !== UserRole.PM) {
            throw new Error("Only PM can reassign tasks");
        }

        if (!userId.trim()) {
            throw new Error("Assigned user is required");
        }

        if (this._assignedTo === userId) {
            throw new Error("Task is already assigned to this user");
        }

        this._assignedTo = userId;
        this.markUpdated();
    }

    public changeStatus(
        newStatus: TaskStatus,
        actor: Actor,
        redoNote?: string
    ): void {

        if (this._status === newStatus) {
            throw new Error("Task is already in this status");
        }


        if (
            newStatus === TaskStatus.IN_PROGRESS ||
            newStatus === TaskStatus.REVIEW
        ) {
            if (actor.id !== this._assignedTo) {
                throw new Error("Only the assigned user can move task to IN_PROGRESS or REVIEW.");
            }
        }

        if (
            newStatus === TaskStatus.COMPLETED ||
            newStatus === TaskStatus.REDO
        ) {
            if (actor.role !== UserRole.PM) {
                throw new Error("Only PM can mark task as COMPLETED or REDO.");
            }
        }


        switch (this._status) {
            case TaskStatus.PENDING:
                if (newStatus !== TaskStatus.IN_PROGRESS) {
                    throw new Error("PENDING → IN_PROGRESS only");
                }
                break;

            case TaskStatus.IN_PROGRESS:
                if (newStatus !== TaskStatus.REVIEW) {
                    throw new Error("IN_PROGRESS → REVIEW only");
                }
                break;

            case TaskStatus.REVIEW:
                if (
                    newStatus !== TaskStatus.COMPLETED &&
                    newStatus !== TaskStatus.REDO
                ) {
                    throw new Error("REVIEW → COMPLETED or REDO only");
                }

                if (newStatus === TaskStatus.REDO) {
                    if (!redoNote || !redoNote.trim()) {
                        throw new Error("Redo note is required");
                    }

                    this.addProgressNote(actor, `[REDO] ${redoNote}`);
                }
                break;

            case TaskStatus.REDO:
                if (newStatus !== TaskStatus.IN_PROGRESS) {
                    throw new Error("REDO → IN_PROGRESS only");
                }
                break;

            case TaskStatus.COMPLETED:
                throw new Error("COMPLETED tasks cannot change status");
        }

        this._status = newStatus;
        this.markUpdated();
    }

    // 📝 Add progress / audit note
    public addProgressNote(actor: Actor, note: string): void {
        if (
            actor.id !== this._assignedTo &&
            actor.role !== UserRole.PM
        ) {
            throw new Error("Only assigned user or PM can add notes");
        }

        if (!note.trim()) {
            throw new Error("Progress note cannot be empty");
        }

        this._progressNotes.push({
            userId: actor.id,
            note,
            createdAt: new Date()
        });

        this.markUpdated();
    }

    // 🔁 Restore notes separately if needed
    public loadProgressNotes(notes: TaskProgress[]): void {
        this._progressNotes = [...notes];
    }

    private markUpdated(): void {
        this._updatedAt = new Date();
    }
}