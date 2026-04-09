import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHashService } from "../../services/IHashService";
import { ITokenService } from "../../services/ITokenService";
import { UserRole } from "../../../domain/entities/User";

export interface LoginRequest {
  emailid: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  emailid: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
}

export class LoginUser {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private tokenService: ITokenService
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    // 1. Check existence
    const user = await this.userRepository.findByEmailid(request.emailid);
    if (!user) {
      throw new Error("Invalid emailid or password");
    }

    // 2. Compare password
    const isPasswordValid = await this.hashService.compare(request.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid emailid or password");
    }

    // 3. Generate Tokens
    const accessToken = this.tokenService.generateAccessToken({ 
      userId: user.id, 
      role: user.role 
    });
    
    const refreshToken = this.tokenService.generateRefreshToken({ 
      userId: user.id 
    });

    // 4. Return Data
    return {
      id: user.id,
      name: user.name,
      emailid: user.emailid,
      role: user.role,
      accessToken,
      refreshToken
    };
  }
}