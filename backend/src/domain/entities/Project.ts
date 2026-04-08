import { User, UserRole } from './User';

export class Project {
  constructor(
    public readonly id: string,
    public title: string,
    public pmId: string,
    public teamMemberIds: string[] = []
  ) {
    this.validate();
  }

  static create(id: string, title: string, pmId: string): Project {
    return new Project(id, title, pmId);
  }

  public validate(): void {
    if (!this.title || this.title.trim() === '') {
      throw new Error('Project must have a valid title.');
    }
    if (!this.pmId || this.pmId.trim() === '') {
      throw new Error('A valid User ID must be provided as the PM.');
    }
  }

  public assignPM(pm: User): void {
    if (pm.role !== UserRole.PM && pm.role !== UserRole.ADMIN) {
      throw new Error('Assigned user must have the PM role to lead projects.');
    }
    this.pmId = pm.id;
  }

  public addTeamMember(userId: string): void {
    if (!this.teamMemberIds.includes(userId)) {
      this.teamMemberIds.push(userId);
    }
  }
}
