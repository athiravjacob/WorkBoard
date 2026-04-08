import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IIdGeneratorService } from '../../services/IIdGeneratorService';
import { Project } from '../../../domain/entities/Project';

export interface CreateProjectDTO {
  title: string;
  pmCandidateId: string;
}

export class CreateProjectUseCase {
  constructor(
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository,
    private idGeneratorService: IIdGeneratorService
  ) {}

  public async execute(dto: CreateProjectDTO): Promise<Project> {
    const pmCandidate = await this.userRepository.findById(dto.pmCandidateId);
    if (!pmCandidate) {
      throw new Error("User proposed as Project Manager could not be found.");
    }

    pmCandidate.promoteToPM();

    const projectId = this.idGeneratorService.generate();
    const project = Project.create(projectId, dto.title, pmCandidate.id);

    await this.userRepository.update(pmCandidate);
    await this.projectRepository.save(project);

    return project;
  }
}
