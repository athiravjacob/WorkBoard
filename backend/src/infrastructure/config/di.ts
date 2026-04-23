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
import { CreateProjectUseCase } from '../../application/use-cases/project/CreateProject';

// 1. Infrastructure Layer: Instantiate the implementations
const userRepository = new MongooseUserRepository();
const projectRepository = new MongooseProjectRepository();
const hashService = new BcryptHashService();
const idGenerator = new UuidGeneratorService();

const tokenGenerator = new JwtTokenService()

// 2. Application Layer: Instantiate the use case, injecting the dependencies
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


// 3. Presentation Layer: Instantiate the controller, injecting the use case instance
export const authController = new AuthController(registerUser, loginUser);
export const userController = new UserController();
export const projectController = new ProjectController(createProject);
