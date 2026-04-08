import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHashService } from "../../services/IHashService";
import { IIdGeneratorService } from "../../services/IIdGeneratorService";

export interface RegisterUserRequest {
  username: string;
  password: string;
}

export interface RegisterUserResponse {
  id: string;
  username: string;
}

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private idGenerator: IIdGeneratorService
  ) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    const existingUser = await this.userRepository.findByUsername(request.username);
    if (existingUser) {
      throw new Error("User with this username already exists");
    }

    const hashedPassword = await this.hashService.hash(request.password);

    const id = this.idGenerator.generate();
    const user = User.create(id, request.username, hashedPassword);

    await this.userRepository.save(user);

    return {
      id: user.id,
      username: user.username
    };
  }
}