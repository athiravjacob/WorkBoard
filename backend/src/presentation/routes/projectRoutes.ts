import { Router } from "express";

import { projectController } from "../../infrastructure/config/di";

const projectRoutes = Router();

projectRoutes.post("/", projectController.createProject);
projectRoutes.get("/", projectController.getAllProjects);
projectRoutes.get("/:projectid",projectController.getProjectById )

export { projectRoutes };
