import { Router } from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { roleMiddleware } from "../middlewares/RoleMiddleware";
import { UserRole } from "../../domain/entities/User";
import { projectController, taskController } from "../../infrastructure/config/di";

const projectRoutes = Router();

// Apply auth middleware to all project routes
projectRoutes.use(authMiddleware);

projectRoutes.post("/", roleMiddleware([UserRole.ADMIN]), projectController.createProject);
projectRoutes.get("/managed", roleMiddleware([UserRole.PM]), projectController.getManagedProjects);
projectRoutes.get("/", roleMiddleware([UserRole.ADMIN]), projectController.getAllProjects);
projectRoutes.get("/:projectId",roleMiddleware([UserRole.ADMIN,UserRole.PM]), projectController.getProjectById);

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
