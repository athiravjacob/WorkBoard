import { Project } from '../../domain/entities/Project';
import { IProjectDocument } from '../database/models/ProjectModel';

export class ProjectMapper {
  public static toDomain(raw: IProjectDocument): Project {
    const project = new Project(
      raw._id,
      raw.title,
      raw.description,
      raw.createdAt,
      raw.updatedAt
    );

    // Reconstruct private fields if there's a way to do it via public methods or reflection
    // Since Project has private members and no setter for pmId/teamMemberIds in constructor,
    // we might need to use methods like assignPM (careful with logic though)
    // or just assume the entity allows some form of hydration.
    
    // Looking at Project.ts, it has addTeamMember and assignPM.
    // However, assignPM also promotes the user to PM role.
    // In a mapper, we usually want to just restore the state.
    
    // If I can't access private members directly, I'll use a hack or suggest the user adds a hydration method.
    // For now, I'll use (project as any) to bypass private visibility during mapping if necessary,
    // or better, if the project entity is designed for DDD, it should have a static 'reconstitute' method.
    
    (project as any)._pmId = raw.pmId;
    (project as any)._teamMemberIds = raw.teamMemberIds || [];

    return project;
  }

  public static toPersistence(project: Project): any {
    return {
      _id: project.id,
      title: project.title,
      description: project.description,
      pmId: project.pmId,
      teamMemberIds: project.teamMemberIds
    };
  }
}
