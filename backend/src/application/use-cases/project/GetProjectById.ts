import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { Project } from "../../../domain/entities/Project";

export class GetProjectById {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<Project | null> {
    return  await this.projectRepository.findById(id);
     
  }
}
