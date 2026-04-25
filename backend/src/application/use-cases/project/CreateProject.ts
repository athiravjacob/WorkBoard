import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IIdGeneratorService } from '../../services/IIdGeneratorService';
import { Project } from '../../../domain/entities/Project';
import { eventBus, WORKBOARD_EVENTS } from '../../../infrastructure/events/eventBus';

export interface CreateProjectDTO {
  title: string;
  description: string;
  pmCandidateId: string;
}

export class CreateProjectUseCase {
  constructor(
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository,
    private idGeneratorService: IIdGeneratorService
  ) {}

  public async execute(dto: CreateProjectDTO, adminId: string): Promise<Project> {
    const pmCandidate = await this.userRepository.findById(dto.pmCandidateId);

    if (!pmCandidate) {
      throw new Error("User proposed as Project Manager could not be found.");
    }

    const projectId = this.idGeneratorService.generate();
    const project = Project.create(projectId, dto.title, dto.description);

    project.assignPM(pmCandidate);

    await this.userRepository.update(pmCandidate);
    await this.projectRepository.save(project);

    // Emit PROJECT_ASSIGNED event
    eventBus.emit(WORKBOARD_EVENTS.PROJECT_ASSIGNED, {
      projectId: project.id,
      projectName: project.title,
      pmId: pmCandidate.id,
      adminId: adminId
    });

    return project;
  }
}
