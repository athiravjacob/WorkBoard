import { Request, Response, NextFunction } from 'express';
import { JwtTokenService } from '../../infrastructure/services/JwtTokenService';
import { UserRole } from '../../domain/entities/User';

const tokenService = new JwtTokenService();

/**
 * Extended Request interface to include the authenticated user.
 */
export interface AuthRequest<
    P = any,
    ResBody = any,
    ReqBody = any,
    ReqQuery = any,
    Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
    user?: {
        id: string;
        role: UserRole;
    };
}

/**
 * Middleware to verify JWT tokens and attach the user to the request object.
 */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;
    console.log(authHeader,"from backend")
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. No token provided.' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify token
        const payload = tokenService.verifyToken(token);

        if (!payload) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired token.' 
            });
        }

        // 3. Attach user info to request
        req.user = {
            id: payload.userId,
            role: payload.role as UserRole
        };

        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authentication failed.' 
        });
    }
};
