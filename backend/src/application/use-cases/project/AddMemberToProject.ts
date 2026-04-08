import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export interface AddMemberRequest {
  projectId: string;
  userId: string;
}

export class AddMemberToProject {
  constructor(
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(request: AddMemberRequest): Promise<void> {
    const project = await this.projectRepository.findById(request.projectId);
    if (!project) throw new Error("Project not found");

    const user = await this.userRepository.findById(request.userId);
    if (!user) throw new Error("User not found");

    project.addTeamMember(user.id);

    await this.projectRepository.update(project);
  }
}