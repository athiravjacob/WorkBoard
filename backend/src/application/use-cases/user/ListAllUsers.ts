import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserRole } from "../../../domain/entities/User";

export interface UserSummaryDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export class ListAllUsers {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<UserSummaryDTO[]> {
    const users = await this.userRepository.findAll();

    // Map entities to DTOs to hide sensitive data (passwords)
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }));
  }
}