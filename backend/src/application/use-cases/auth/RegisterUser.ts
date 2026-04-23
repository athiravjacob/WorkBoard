import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHashService } from "../../services/IHashService";
import { IIdGeneratorService } from "../../services/IIdGeneratorService";

export interface RegisterUserDTO {
  name: string;
  emailid: string;
  password: string;
}

export interface RegisterUserResultDTO {
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

  async execute(dto: RegisterUserDTO): Promise<RegisterUserResultDTO> {
    const existingUser = await this.userRepository.findByEmailid(dto.emailid);
    if (existingUser) {
      throw new Error("User with this emailid already exists");
    }

    const hashedPassword = await this.hashService.hash(dto.password);

    const id = this.idGenerator.generate();
    const user = User.create(id, dto.name, dto.emailid, hashedPassword);

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      emailid: user.emailid
    };
  }
}