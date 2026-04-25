import { MongooseUserRepository } from '../repositories/MongooseUserRepository';
import { MongooseProjectRepository } from '../repositories/MongooseProjectRepository';
import { MongooseNotificationRepository } from '../repositories/MongooseNotificationRepository';
import { MongooseTaskRepository } from '../repositories/MongooseTaskRepository';

import { RegisterUser } from '../../application/use-cases/auth/RegisterUser';
import { UserController } from '../../presentation/controllers/UserController';
import { AuthController } from '../../presentation/controllers/AuthController';
import { ProjectController } from '../../presentation/controllers/ProjectController';
import { BcryptHashService } from '../services/BcryptHashService';
import { UuidGeneratorService } from '../services/UuidGeneratorService';
import { JwtTokenService } from '../services/JwtTokenService';
import { LoginUser } from '../../application/use-cases/auth/LoginUser';
import { RefreshToken } from '../../application/use-cases/auth/RefreshToken';
import { SocketService } from '../services/SocketService';
import { CreateProjectUseCase } from '../../application/use-cases/project/CreateProject';

import { ListAllProjects } from '../../application/use-cases/project/ListAllProjects';
import { ListManagedProjects } from '../../application/use-cases/project/ListManagedProjects';
import { GetProjectById } from '../../application/use-cases/project/GetProjectById';

import { ListAllUsers } from '../../application/use-cases/user/ListAllUsers';
import { GetMyProfile } from '../../application/use-cases/user/GetMyProfile';

import { CreateTaskUseCase } from '../../application/use-cases/task/CreateTask';
import { GetTasksByProjectUseCase } from '../../application/use-cases/task/GetTasksByProject';
import { GetMyTasksUseCase } from '../../application/use-cases/task/GetMyTasks';
import { UpdateTaskStatusUseCase } from '../../application/use-cases/task/UpdateTaskStatus';
import { AddTaskNoteUseCase } from '../../application/use-cases/task/AddTaskNote';
import { CreateNotificationUseCase } from '../../application/use-cases/notification/CreateNotification';
import { GetNotificationsUseCase } from '../../application/use-cases/notification/GetNotifications';
import { MarkAsReadUseCase } from '../../application/use-cases/notification/MarkAsRead';
import { MarkAllAsReadUseCase } from '../../application/use-cases/notification/MarkAllAsRead';
import { GetUnreadCountUseCase } from '../../application/use-cases/notification/GetUnreadCount';

import { NotificationSubscriber } from '../../application/subscribers/NotificationSubscriber';
import { TaskController } from '../../presentation/controllers/TaskController';
import { NotificationController } from '../../presentation/controllers/NotificationController';



// 1. Infrastructure Layer: Instantiate the implementations
const userRepository = new MongooseUserRepository();
const projectRepository = new MongooseProjectRepository();
const notificationRepository = new MongooseNotificationRepository();
const taskRepository = new MongooseTaskRepository();
const hashService = new BcryptHashService();
const idGenerator = new UuidGeneratorService();
const tokenGenerator = new JwtTokenService();
const socketService = new SocketService();




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

const refreshToken = new RefreshToken(
  userRepository,
  tokenGenerator
)

const createProject = new CreateProjectUseCase(
  projectRepository,
  userRepository,
  idGenerator
);

const listAllProjects = new ListAllProjects(projectRepository);
const listManagedProjects = new ListManagedProjects(projectRepository);
const getProjectById = new GetProjectById(projectRepository);

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
const updateTaskStatus = new UpdateTaskStatusUseCase(taskRepository, userRepository, projectRepository);
const addTaskNote = new AddTaskNoteUseCase(taskRepository);

// Notification Use Cases & Subscriber
const createNotification = new CreateNotificationUseCase(notificationRepository, idGenerator);
const getNotifications = new GetNotificationsUseCase(notificationRepository);
const markAsRead = new MarkAsReadUseCase(notificationRepository);
const markAllAsRead = new MarkAllAsReadUseCase(notificationRepository);
const getUnreadCount = new GetUnreadCountUseCase(notificationRepository);


new NotificationSubscriber(createNotification, socketService);





// 3. Presentation Layer: Instantiate the controller, injecting the use case instance
export const authController = new AuthController(registerUser, loginUser, refreshToken);
export const userController = new UserController(listAllUsers, getMyProfile);
export const projectController = new ProjectController(
  createProject, 
  listAllProjects, 
  listManagedProjects,
  getProjectById
);
export const taskController = new TaskController(
  createTask,
  getTasksByProject,
  getMyTasks,
  updateTaskStatus,
  addTaskNote
);

export const notificationController = new NotificationController(
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
);


