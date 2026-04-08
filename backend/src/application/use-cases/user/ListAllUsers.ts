import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserRole } from "../../../domain/entities/User";

export interface UserSummaryDTO {
  id: string;
  username: string;
  role: UserRole;
}

export class ListAllUsers {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<UserSummaryDTO[]> {
    const users = await this.userRepository.findAll();

    // Map entities to DTOs to hide sensitive data (passwords)
    return users.map(user => ({
      id: user.id,
      username: user.username,
      role: user.role
    }));
  }
}