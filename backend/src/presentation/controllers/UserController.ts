import { Request, Response } from "express";
import { GetProfileDTO, UserProfileDTO } from "../../application/use-cases/user/GetMyProfile";

export interface IListAllUsersUseCase {
  execute(): Promise<any[]>;
}

export interface IGetMyProfileUseCase {
  execute(dto: GetProfileDTO): Promise<UserProfileDTO>;
}

export class UserController {
  constructor(
    private readonly listAllUsersUseCase: IListAllUsersUseCase,
    private readonly getMyProfileUseCase: IGetMyProfileUseCase
  ) {}

  /**
   * Fetches all registered users.
   */
  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.listAllUsersUseCase.execute();
      res.status(200).json(users);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  };

  /**
   * Fetches the profile of the currently authenticated user.
   */
  public getMyProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const profile = await this.getMyProfileUseCase.execute({ userId });
      res.status(200).json(profile);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      res.status(404).json({ error: error.message || "Profile not found" });
    }
  };
}
