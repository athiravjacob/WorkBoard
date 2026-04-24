import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { Project } from '../../../domain/entities/Project';

export class ListManagedProjects {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(pmId: string): Promise<Project[]> {
    return await this.projectRepository.findByPmId(pmId);
  }
}
