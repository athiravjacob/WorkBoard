import { Project } from '../entities/Project';
import { User } from '../entities/User';

export interface IProjectRepository {
  findById(id: string): Promise<Project | null>;
  save(project: Project): Promise<void>;
  update(project: Project): Promise<void>;
  delete(id: string): Promise<void>;
  getTeamMembers(projectId: string): Promise<User[]>;
}
