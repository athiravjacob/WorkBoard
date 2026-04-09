import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { UserRole } from "../../../domain/entities/User";

export interface GetProfileRequest {
  userId: string;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  emailid: string;
  role: UserRole;
}

export class GetMyProfile {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: GetProfileRequest): Promise<UserProfileResponse> {
    const user = await this.userRepository.findById(request.userId);

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