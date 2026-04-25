import { Request, Response } from "express";
import { CreateProjectDTO } from "../../application/use-cases/project/CreateProject";

export interface ICreateProjectUseCase {
  execute(data: CreateProjectDTO, adminId: string): Promise<any>;
}

export interface IListAllProjectsUseCase {
  execute(): Promise<any[]>;
}

export interface IListManagedProjectsUseCase {
  execute(pmId: string): Promise<any[]>;
}

export interface IGetProjectByIdUseCase {
  execute(id: string): Promise<any | null>;
}

export class ProjectController {
  constructor(
    private readonly createProjectUseCase: ICreateProjectUseCase,
    private readonly listAllProjectsUseCase: IListAllProjectsUseCase,
    private readonly listManagedProjectsUseCase: IListManagedProjectsUseCase,
    private readonly getProjectByIdUseCase: IGetProjectByIdUseCase
  ) {}

  public getAllProjects = async (req: Request, res: Response): Promise<void> => {
    try {
      const projects = await this.listAllProjectsUseCase.execute();
      
      const projectDTOs = projects.map((project: any) => this.mapToDTO(project));

      res.status(200).json(projectDTOs);
    } catch (error: any) {
      console.error("Fetch projects error:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  };

  public getManagedProjects = async (req: any, res: Response): Promise<void> => {
    try {
      const pmId = req.user.id;
      const projects = await this.listManagedProjectsUseCase.execute(pmId);
      
      const projectDTOs = projects.map((project: any) => this.mapToDTO(project));

      res.status(200).json(projectDTOs);
    } catch (error: any) {
      console.error("Fetch managed projects error:", error);
      res.status(500).json({ error: "Failed to fetch managed projects" });
    }
  };

  public createProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, pmId } = req.body;

      if (!title || !description || !pmId) {
        res.status(400).json({ error: "Title, description, and pmId are required" });
        return;
      }

      const project = await this.createProjectUseCase.execute({
        title,
        description,
        pmCandidateId: pmId,
      }, (req as any).user.id); 

      res.status(201).json({
        message: "Project created successfully",
        project: this.mapToDTO(project),
      });
    } catch (error: any) {
      console.error("Create project error:", error);
      res.status(500).json({ error: error.message || "Internal server error during project creation" });
    }
  };

  public getProjectById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      const project = await this.getProjectByIdUseCase.execute(projectId as string);

      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.status(200).json(this.mapToDTO(project));
    } catch (error: any) {
      console.error("Get project by ID error:", error);
      res.status(500).json({ error: "Internal server error while fetching project" });
    }
  };

  /**
   * Helper to map Entity to DTO within the Presentation Layer
   */
  private mapToDTO(project: any) {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      pmId: project.pmId,
      pmDetails: project.pmDetails,
      teamMemberIds: project.teamMemberIds,
      teamMembers: project.teamMembers,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    };
  }
}
