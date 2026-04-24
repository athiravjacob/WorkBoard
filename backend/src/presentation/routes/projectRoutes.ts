import { Router } from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { roleMiddleware } from "../middlewares/RoleMiddleware";
import { UserRole } from "../../domain/entities/User";
import { projectController, taskController } from "../../infrastructure/config/di";

const projectRoutes = Router();

// Apply auth middleware to all project routes
projectRoutes.use(authMiddleware);

projectRoutes.post("/", projectController.createProject);
projectRoutes.get("/managed", projectController.getManagedProjects);
projectRoutes.get("/", projectController.getAllProjects);

/**
 * Task-related routes nested under projects
 */
projectRoutes.post(
    "/:projectId/tasks", 
    roleMiddleware([UserRole.PM]), 
    taskController.createTask
);

projectRoutes.get(
    "/:projectId/tasks", 
    taskController.getTasksByProject
);

export { projectRoutes };
