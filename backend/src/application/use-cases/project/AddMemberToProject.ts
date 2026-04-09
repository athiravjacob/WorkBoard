import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserRole } from "../../../domain/entities/User";

export interface AddMemberDTO {
  projectId: string;
  userId: string;
  requesterId: string;
}

export class AddMemberToProject {
  constructor(
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(dto: AddMemberDTO): Promise<void> {
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) throw new Error("Project not found");

    const requester = await this.userRepository.findById(dto.requesterId);
    if (!requester) throw new Error("Requester not found");

    if (project.pmId !== requester.id && requester.role !== UserRole.ADMIN) {
      throw new Error("Only the Project Manager or an Admin can add members to this project.");
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) throw new Error("User not found");

    project.addTeamMember(user.id);

    await this.projectRepository.update(project);
  }
}