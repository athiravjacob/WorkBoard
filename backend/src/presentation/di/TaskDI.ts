import { MongooseTaskRepository } from "../../infrastructure/repositories/MongooseTaskRepository";
import { MongooseUserRepository } from "../../infrastructure/repositories/MongooseUserRepository";
import { MongooseProjectRepository } from "../../infrastructure/repositories/MongooseProjectRepository";
import { UuidGeneratorService } from "../../infrastructure/services/UuidGeneratorService";
import { CreateTaskUseCase } from "../../application/use-cases/task/CreateTask";
import { GetTasksByProjectUseCase } from "../../application/use-cases/task/GetTasksByProject";
import { GetMyTasksUseCase } from "../../application/use-cases/task/GetMyTasks";
import { TaskController } from "../controllers/TaskController";

// 1. Repositories (Infrastructure)
const taskRepository = new MongooseTaskRepository();
const userRepository = new MongooseUserRepository();
const projectRepository = new MongooseProjectRepository();

// 2. Services (Infrastructure)
const idGenerator = new UuidGeneratorService();

// 3. Use Cases (Application logic)
const createTaskUseCase = new CreateTaskUseCase(
    taskRepository,
    userRepository,
    projectRepository,
    idGenerator
);

const getTasksByProjectUseCase = new GetTasksByProjectUseCase(
    taskRepository,
    projectRepository
);

const getMyTasksUseCase = new GetMyTasksUseCase(taskRepository);

// 4. Controller (Presentation) - Injecting all use cases
export const taskController = new TaskController(
    createTaskUseCase,
    getTasksByProjectUseCase,
    getMyTasksUseCase
);
