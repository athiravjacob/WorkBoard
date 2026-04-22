import { MongooseUserRepository } from '../repositories/MongooseUserRepository';
import { RegisterUser } from '../../application/use-cases/user/RegisterUser';
import { UserController } from '../../presentation/controllers/UserController';
import { BcryptHashService } from '../services/BcryptHashService';
import { UuidGeneratorService } from '../services/UuidGeneratorService';
import { JwtTokenService } from '../services/JwtTokenService';
import { LoginUser } from '../../application/use-cases/user/LoginUser';

// 1. Infrastructure Layer: Instantiate the implementations
const userRepository = new MongooseUserRepository();
const hashService = new BcryptHashService();
const idGenerator = new UuidGeneratorService();

const tokenGenerator = new JwtTokenService()

// 2. Application Layer: Instantiate the use case, injecting the dependencies
const registerUser = new RegisterUser(
  userRepository,
  hashService,
  idGenerator
);

const login = new LoginUser(
  userRepository,
  hashService,
  tokenGenerator
)


// 3. Presentation Layer: Instantiate the controller, injecting the use case instance
export const userController = new UserController(registerUser,login);
