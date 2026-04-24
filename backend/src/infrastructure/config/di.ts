import { MongooseUserRepository } from '../repositories/MongooseUserRepository';
import { MongooseProjectRepository } from '../repositories/MongooseProjectRepository';
import { RegisterUser } from '../../application/use-cases/auth/RegisterUser';
import { UserController } from '../../presentation/controllers/UserController';
import { AuthController } from '../../presentation/controllers/AuthController';
import { ProjectController } from '../../presentation/controllers/ProjectController';
import { BcryptHashService } from '../services/BcryptHashService';
import { UuidGeneratorService } from '../services/UuidGeneratorService';
import { JwtTokenService } from '../services/JwtTokenService';
import { LoginUser } from '../../application/use-cases/auth/LoginUser';
import { MongooseTaskRepository } from '../repositories/MongooseTaskRepository';
import { CreateProjectUseCase } from '../../application/use-cases/project/CreateProject';
import { ListAllProjects } from '../../application/use-cases/project/ListAllProjects';

import { ListAllUsers } from '../../application/use-cases/user/ListAllUsers';
import { GetMyProfile } from '../../application/use-cases/user/GetMyProfile';

import { CreateTaskUseCase } from '../../application/use-cases/task/CreateTask';
import { GetTasksByProjectUseCase } from '../../application/use-cases/task/GetTasksByProject';
import { GetMyTasksUseCase } from '../../application/use-cases/task/GetMyTasks';
import { TaskController } from '../../presentation/controllers/TaskController';

// 1. Infrastructure Layer: Instantiate the implementations
const userRepository = new MongooseUserRepository();
const projectRepository = new MongooseProjectRepository();
const taskRepository = new MongooseTaskRepository();
const hashService = new BcryptHashService();
const idGenerator = new UuidGeneratorService();
const tokenGenerator = new JwtTokenService()


// 2. Application Layer: Instantiate the use case, injecting the dependencies
// Auth Use Cases
const registerUser = new RegisterUser(
  userRepository,
  hashService,
  idGenerator
);

const loginUser = new LoginUser(
  userRepository,
  hashService,
  tokenGenerator
)

const createProject = new CreateProjectUseCase(
  projectRepository,
  userRepository,
  idGenerator
);

const listAllProjects = new ListAllProjects(projectRepository);

// User Use Cases
const listAllUsers = new ListAllUsers(userRepository);
const getMyProfile = new GetMyProfile(userRepository);

// Task Use Cases
const createTask = new CreateTaskUseCase(
  taskRepository,
  userRepository,
  projectRepository,
  idGenerator
);

const getTasksByProject = new GetTasksByProjectUseCase(
  taskRepository,
  projectRepository
);

const getMyTasks = new GetMyTasksUseCase(taskRepository);


// 3. Presentation Layer: Instantiate the controller, injecting the use case instance
export const authController = new AuthController(registerUser, loginUser);
export const userController = new UserController(listAllUsers, getMyProfile);
export const projectController = new ProjectController(createProject, listAllProjects);
export const taskController = new TaskController(
  createTask,
  getTasksByProject,
  getMyTasks
);
