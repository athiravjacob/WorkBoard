import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHashService } from "../../services/IHashService";
import { IIdGeneratorService } from "../../services/IIdGeneratorService";

export interface RegisterUserRequest {
  name: string;
  emailid: string;
  password: string;
}

export interface RegisterUserResponse {
  id: string;
  name: string;
  emailid: string;
}

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private idGenerator: IIdGeneratorService
  ) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    const existingUser = await this.userRepository.findByEmailid(request.emailid);
    if (existingUser) {
      throw new Error("User with this emailid already exists");
    }

    const hashedPassword = await this.hashService.hash(request.password);

    const id = this.idGenerator.generate();
    const user = User.create(id, request.name, request.emailid, hashedPassword);

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      emailid: user.emailid
    };
  }
}