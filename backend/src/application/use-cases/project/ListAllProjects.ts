import { IProjectRepository } from "../../../domain/repositories/IProjectRepository";
import { Project } from "../../../domain/entities/Project";

export class ListAllProjects {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(): Promise<Project[]> {
    return await this.projectRepository.findAll();
  }
}
