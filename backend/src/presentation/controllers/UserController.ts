import { Request, Response } from 'express';
import { setRefreshTokenCookie } from '../utils/CookieHelper';

export interface IRegisterUserUseCase {
  execute(data: { name: string; emailid: string; password: string }): Promise<any>;
}
export interface ILoginUserUsecase {
  execute(data: { emailid: string; password: string }): Promise<any>;
}

export class UserController {
  constructor(
    private readonly registerUser: IRegisterUserUseCase,
    private readonly loginUser :ILoginUserUsecase
    
    ) {}

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

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const {email,password}=req.body
      if ( !email || !password) {
        res.status(400).json({ error:'email, and password are required' });
        return;
     }
     const { user, accessToken, refreshToken } = await this.loginUser.execute({
      emailid: email,
      password,
    });

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken, 
    });

  } catch (error: any) {
    console.error('Login error:', error);

    if (error.message === 'Invalid credentials' || error.message === 'User not found') {
      res.status(401).json({ error: 'Invalid email or password' });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred during login' });
    }
  }
};
}
