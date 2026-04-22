import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../../application/services/ITokenService';

export class JwtTokenService implements ITokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;

  constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET || 'default_access_secret';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';
  }

  public generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessSecret, { 
      expiresIn: '15m' 
    });
  }

  public generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshSecret, { 
      expiresIn: '7d' 
    });
  }

  public verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.accessSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        console.warn('JWT Access Token expired');
      } else if (error instanceof JsonWebTokenError) {
        console.warn('Invalid JWT Access Token');
      }
      return null;
    }
  }
}