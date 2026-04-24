import { Response, NextFunction } from 'express';
import { AuthRequest } from './AuthMiddleware';
import { UserRole } from '../../domain/entities/User';

/**
 * Middleware to restrict access based on user roles (RBAC).
 * 
 * @param allowedRoles - An array of UserRole permitted to access the route.
 */
export const roleMiddleware = (allowedRoles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        
        // 1. Ensure user is authenticated (authMiddleware must run first)
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required.' 
            });
        }

        // 2. Check if the user's role is in the allowed list
        const hasPermission = allowedRoles.includes(req.user.role);

        if (!hasPermission) {
            return res.status(403).json({ 
                success: false, 
                message: 'Forbidden: You do not have the required permissions.' 
            });
        }

        // 3. Permission granted
        next();
    };
};
