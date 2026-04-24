import { User, UserRole } from './User';

export class Project {
  private _teamMemberIds: string[] = [];
  private _pmId?: string | null = null;
  
  constructor(
    public readonly id: string,
    private _title: string,
    private _description: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public pmDetails?: { name: string; email: string },
    public teamMembers?: { id: string; name: string; email: string }[]
  ) {
    this.validate();
  }

  get title(): string { return this._title; }
  get description(): string { return this._description; }
  get pmId(): string | null | undefined { return this._pmId; }
  get teamMemberIds(): string[] { return [...this._teamMemberIds]; }

  static create(id: string, title: string, description: string): Project {
    return new Project(id, title, description);
  }

  public validate(): void {
    if (!this._title || this._title.trim() === '') {
      throw new Error('Project must have a valid title.');
    }
    
  }

  public updateTitle(newTitle: string): void {
    if (!newTitle || newTitle.trim() === '') {
      throw new Error('Project title cannot be empty.');
    }
    this._title = newTitle;
  }

  public updateDescription(newDescription: string): void {
    if (!newDescription || newDescription.trim() === '') {
      throw new Error('Project description cannot be empty.');
    }
    this._description = newDescription;
  }

  public assignPM(user: User): void {
    if (!user) {
      throw new Error('User object is null or invalid.');
    }

    if (user.role !== UserRole.PM && user.role !== UserRole.ADMIN) {
      user.promoteToPM();
    }

    this._pmId = user.id;
    this.addTeamMember(user.id);
  }

  public addTeamMember(userId: string): void {
    if (!this._teamMemberIds.includes(userId)) {
      this._teamMemberIds.push(userId);
    }
  }

  public removeTeamMember(userId: string): void {
    if (userId === this._pmId) {
      throw new Error("Cannot remove the Project Manager from the team list.");
  }
    this._teamMemberIds = this._teamMemberIds.filter(id => id !== userId);
  }
}
