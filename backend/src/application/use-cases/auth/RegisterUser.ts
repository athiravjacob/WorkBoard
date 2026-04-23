import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHashService } from "../../services/IHashService";
import { IIdGeneratorService } from "../../services/IIdGeneratorService";

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface RegisterUserResultDTO {
  id: string;
  name: string;
  email: string;
}

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private idGenerator: IIdGeneratorService
  ) {}

  async execute(dto: RegisterUserDTO): Promise<RegisterUserResultDTO> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    console.log(existingUser)
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await this.hashService.hash(dto.password);

    const id = this.idGenerator.generate();
    const user = User.create(id, dto.name, dto.email, hashedPassword);

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }
}