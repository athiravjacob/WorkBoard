import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserRole } from "../../../domain/entities/User";

export interface GetProfileDTO {
  userId: string;
}

export interface UserProfileDTO {
  id: string;
  name: string;
  emailid: string;
  role: UserRole;
}

export class GetMyProfile {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: GetProfileDTO): Promise<UserProfileDTO> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new Error("UserNotFound");
    }

    return {
      id: user.id,
      name: user.name,
      emailid: user.emailid,
      role: user.role
    };
  }
}