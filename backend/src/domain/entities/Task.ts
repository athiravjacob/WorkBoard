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

export class Task {
    private _progressNotes: TaskProgress[] = [];

    constructor(
        public readonly id: string,
        private _title: string,
        private _description: string,
        private _status: TaskStatus,
        private _projectId: string,
        private _assignedTo: string,
        private _createdAt: Date,
        private _updatedAt: Date
    ) {}

    get title(): string { return this._title; }
    get description(): string { return this._description; }
    get status(): TaskStatus { return this._status; }
    get projectId(): string { return this._projectId; }
    get assignedTo(): string { return this._assignedTo; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }
    get progressNotes(): TaskProgress[] { return [...this._progressNotes]; }

    public updateDetails(title: string, description: string): void {
        this._title = title;
        this._description = description;
        this.markUpdated();
    }

    public assignTo(userId: string): void {
        this._assignedTo = userId;
        this.markUpdated();
    }

    public changeStatus(newStatus: TaskStatus, userId?: string, redoNote?: string): void {
        switch (this._status) {
            case TaskStatus.PENDING:
                if (newStatus !== TaskStatus.IN_PROGRESS) {
                    throw new Error("PENDING tasks can only move to IN_PROGRESS.");
                }
                break;
            case TaskStatus.IN_PROGRESS:
                if (newStatus === TaskStatus.COMPLETED) {
                    throw new Error("Cannot move directly from IN_PROGRESS to COMPLETED. Task must go to REVIEW first.");
                }
                if (newStatus !== TaskStatus.REVIEW) {
                    throw new Error("IN_PROGRESS tasks can only move to REVIEW.");
                }
                break;
            case TaskStatus.REVIEW:
                if (newStatus !== TaskStatus.COMPLETED && newStatus !== TaskStatus.REDO) {
                    throw new Error("REVIEW tasks can only be COMPLETED or sent to REDO.");
                }
                if (newStatus === TaskStatus.REDO) {
                    if (!redoNote || !redoNote.trim()) {
                        throw new Error("A note must be provided explaining what should be updated for a REDO.");
                    }
                    if (userId) {
                        // Using our existing progress notes to track the redo instructions securely
                        this.addProgressNote(userId, `REDO REQUESTED: ${redoNote}`);
                    }
                }
                break;
            case TaskStatus.REDO:
                if (newStatus !== TaskStatus.IN_PROGRESS) {
                    throw new Error("REDO tasks must go back to IN_PROGRESS.");
                }
                break;
            case TaskStatus.COMPLETED:
                throw new Error("COMPLETED tasks cannot change status.");
        }

        this._status = newStatus;
        this.markUpdated();
    }

    // Allows users to add updates about the task they've done
    public addProgressNote(userId: string, note: string): void {
        if (!note.trim()) {
            throw new Error("Progress note cannot be empty");
        }
        this._progressNotes.push({
            userId,
            note,
            createdAt: new Date()
        });
        this.markUpdated();
    }

    // Restores progress notes when reconstructing from DB
    public loadProgressNotes(notes: TaskProgress[]): void {
        this._progressNotes = notes;
    }

    private markUpdated(): void {
        this._updatedAt = new Date();
    }
}