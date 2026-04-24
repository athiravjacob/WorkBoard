import { Project } from '../../domain/entities/Project';
import { IProjectDocument } from '../database/models/ProjectModel';

export class ProjectMapper {
  public static toDomain(raw: any): Project {
    const project = new Project(
      raw._id.toString(),
      raw.title,
      raw.description,
      raw.createdAt,
      raw.updatedAt
    );

    // Handle PM Details (Populated)
    if (raw.pmId && typeof raw.pmId === 'object' && ('name' in raw.pmId)) {
      project.pmDetails = {
        name: raw.pmId.name,
        email: raw.pmId.email
      };
      (project as any)._pmId = raw.pmId._id.toString();
    } else {
      (project as any)._pmId = raw.pmId?.toString();
    }

    // Handle Team Member Details (Populated)
    if (Array.isArray(raw.teamMemberIds)) {
      if (raw.teamMemberIds.length > 0 && typeof raw.teamMemberIds[0] === 'object' && ('name' in raw.teamMemberIds[0])) {
        project.teamMembers = raw.teamMemberIds.map((u: any) => ({
          id: (u._id || u.id).toString(),
          name: u.name,
          email: u.email
        }));
        (project as any)._teamMemberIds = raw.teamMemberIds.map((u: any) => (u._id || u.id).toString());
      } else {
        (project as any)._teamMemberIds = raw.teamMemberIds.map((id: any) => id.toString());
      }
    }

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
