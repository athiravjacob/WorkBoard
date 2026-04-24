import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../services/ITokenService";

export class RefreshToken {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService
  ) {}

  async execute(refreshToken: string): Promise<{ accessToken: string }> {
    // 1. Verify the refresh token
    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error("Invalid or expired refresh token");
    }

    // 2. Fetch the user to ensure they still exist and get current role
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // 3. Generate new access token
    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      role: user.role
    });

    return { accessToken };
  }
}
