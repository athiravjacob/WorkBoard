import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHashService } from "../../services/IHashService";
import { ITokenService } from "../../services/ITokenService";
import { UserRole } from "../../../domain/entities/User";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResultDTO {
  id: string;
  name: string;
  email: string;
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

  async execute(dto: LoginDTO): Promise<LoginResultDTO> {
    // 1. Check existence
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // 2. Compare password
    const isPasswordValid = await this.hashService.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
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
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken
    };
  }
}