import { Request, Response } from "express";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../utils/CookieHelper";

export interface IRegisterUserUseCase {
  execute(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<any>;
}
export interface ILoginUserUsecase {
  execute(data: { email: string; password: string }): Promise<any>;
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
      console.log(req.body)

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
      console.log(req.body)
      if (!email || !password) {
        res.status(400).json({ error: "email, and password are required" });
        return;
      }
      const result = await this.loginUser.execute({
        email: email,
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
        error.message === "Invalid credentials" ||
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
