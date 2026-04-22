import { Request, Response } from 'express';

export interface IRegisterUserUseCase {
  execute(data: { name: string; emailid: string; password: string }): Promise<any>;
}

export class UserController {
  constructor(private readonly registerUser: IRegisterUserUseCase) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
         res.status(400).json({ error: 'Name, email, and password are required' });
         return;
      }

      const result = await this.registerUser.execute({
        name,
        emailid: email,
        password,
      });

      res.status(201).json(result);
    } catch (error: any) {
      console.error('Registration error:', error);      
      if (error.message === 'User with this emailid already exists' || error.name === 'ValidationError') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error during registration' });
      }
    }
  };
}
