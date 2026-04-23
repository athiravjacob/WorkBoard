import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { Role } from '../../../types';

interface Props {
  allowedRoles?: Role[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If they are logged in but don't have the role, send them to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />; // This renders the child routes
};