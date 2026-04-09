import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserRole } from "../../../domain/entities/User";

export interface GetProjectDetailsDTO {
  projectId: string;
  requesterId: string;
}

export interface ProjectDetailsDTO {
  id: string;
  title: string;
  pmName: string;
  members: { id: string; name: string }[];
}
  
export class GetProjectDetails {
  constructor(
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(dto: GetProjectDetailsDTO): Promise<ProjectDetailsDTO> {
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) throw new Error("Project not found");

    const requester = await this.userRepository.findById(dto.requesterId);
    if (!requester) throw new Error("Requester not found");

    const isPM = project.pmId === requester.id;
    const isAdmin = requester.role === UserRole.ADMIN;
    const isTeamMember = project.teamMemberIds.includes(requester.id);

    if (!isPM && !isAdmin && !isTeamMember) {
      throw new Error("Access Denied: You must be assigned to this project to view its details.");
    }

    const pm = project.pmId ? await this.userRepository.findById(project.pmId) : null;
    
    const members = await this.projectRepository.getTeamMembers(project.id);

    return {
      id: project.id,
      title: project.title,
      pmName: pm?.name || "Unknown",
      members: members.map(m => ({ id: m.id, name: m.name }))
    };
  }
}