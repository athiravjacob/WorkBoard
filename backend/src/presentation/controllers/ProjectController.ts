import { Request, Response } from "express";

export interface ICreateProjectUseCase {
  execute(data: {
    title: string;
    description: string;
    pmCandidateId: string;
  }): Promise<any>;
}

export interface IListAllProjectsUseCase {
  execute(): Promise<any[]>;
}

export interface IListManagedProjectsUseCase {
  execute(pmId: string): Promise<any[]>;
}

export class ProjectController {
  constructor(
    private readonly createProjectUseCase: ICreateProjectUseCase,
    private readonly listAllProjectsUseCase: IListAllProjectsUseCase,
    private readonly listManagedProjectsUseCase: IListManagedProjectsUseCase
  ) {}

  public getAllProjects = async (req: Request, res: Response): Promise<void> => {
    try {
      const projects = await this.listAllProjectsUseCase.execute();
      
      const projectDTOs = projects.map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        pmId: project.pmId,
        teamMemberIds: project.teamMemberIds,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }));

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
      
      const projectDTOs = projects.map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        pmId: project.pmId,
        teamMemberIds: project.teamMemberIds,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }));

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
      }); 

      res.status(201).json({
        message: "Project created successfully",
        project: {
          id: project.id,
          title: project.title,
          description: project.description,
          pmId: project.pmId,
          teamMemberIds: project.teamMemberIds,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt
        },
      });
    } catch (error: any) {
      console.error("Create project error:", error);
      res.status(500).json({ error: error.message || "Internal server error during project creation" });
    }
  };

  public getProjectById = async(req:Request,res:Response):Promise<void>=>{
  }
}
