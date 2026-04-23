import { Request, Response } from "express";

export interface ICreateProjectUseCase {
  execute(data: {
    title: string;
    description: string;
    pmCandidateId: string;
  }): Promise<any>;
}

export class AdminController {
  constructor(private readonly createProjectUseCase: ICreateProjectUseCase) {}

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
        project,
      });
    } catch (error: any) {
      console.error("Create project error:", error);
      res.status(500).json({ error: error.message || "Internal server error during project creation" });
    }
  };
}
