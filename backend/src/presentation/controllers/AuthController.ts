import { Request, Response } from "express";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../utils/CookieHelper";
import { RegisterUserDTO, RegisterUserResultDTO } from "../../application/use-cases/auth/RegisterUser";
import { LoginDTO, LoginResultDTO } from "../../application/use-cases/auth/LoginUser";

export interface IRegisterUserUseCase {
  execute(dto: RegisterUserDTO): Promise<RegisterUserResultDTO>;
}

export interface ILoginUserUsecase {
  execute(dto: LoginDTO): Promise<LoginResultDTO>;
}

export interface IRefreshTokenUseCase {
  execute(refreshToken: string): Promise<{ accessToken: string }>;
}

export class AuthController {
  constructor(
    private readonly registerUser: IRegisterUserUseCase,
    private readonly loginUser: ILoginUserUsecase,
    private readonly refreshTokenUseCase: IRefreshTokenUseCase
  ) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res
          .status(400)
          .json({ error: "Name, email, and password are required" });
        return;
      }

      const result = await this.registerUser.execute({
        name,
        email,
        password
      });

      res.status(201).json(result);
    } catch (error: any) {
      console.error("Registration error:", error);
      if (
        error.message === "User with this email already exists" ||
        error.name === "ValidationError"
      ) {
        res.status(400).json({ error: error.message });
      } else {
        res
          .status(500)
          .json({ error: "Internal server error during registration" });
      }
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }
      
      const result = await this.loginUser.execute({
        email,
        password,
      });

      setRefreshTokenCookie(res, result.refreshToken);

      res.status(200).json({
        message: "Login successful",
        user: {
          id: result.id,
          name: result.name,
          email: result.email,
          role: result.role,
        },
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      console.error("Login error:", error);

      if (
        error.message === "Invalid email or password" ||
        error.message === "User not found"
      ) {
        res.status(401).json({ error: "Invalid email or password" });
      } else {
        res
          .status(500)
          .json({ error: "An unexpected error occurred during login" });
      }
    }
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ error: "Refresh token missing" });
        return;
      }

      const { accessToken } = await this.refreshTokenUseCase.execute(refreshToken);

      res.status(200).json({ accessToken });
    } catch (error: any) {
      console.error("Refresh token error:", error);
      res.status(401).json({ error: error.message || "Invalid refresh token" });
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    clearRefreshTokenCookie(res);
    res.status(200).json({ message: "Logged out successfully" });
  };
}
