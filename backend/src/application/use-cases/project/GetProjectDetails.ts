import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export interface ProjectDetailsResponse {
    id: string;
    title: string;
    pmName: string;
    members: { id: string; username: string }[];
  }
  
  export class GetProjectDetails {
    constructor(
      private projectRepository: IProjectRepository,
      private userRepository: IUserRepository
    ) {}
  
    async execute(projectId: string): Promise<ProjectDetailsResponse> {
      const project = await this.projectRepository.findById(projectId);
      if (!project) throw new Error("Project not found");
  
      const pm = await this.userRepository.findById(project.pmId);
      
      const members = await this.projectRepository.getTeamMembers( project.id );
  
      return {
        id: project.id,
        title: project.title,
        pmName: pm?.username || "Unknown",
        members: members.map(m => ({ id: m.id, username: m.username }))
      };
    }
  }