import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';

// Dummy components for now so the app doesn't crash
const Dashboard = () => <div className="p-8"><h1>Dashboard (All Roles)</h1></div>;
const AdminPanel = () => <div className="p-8"><h1>Admin Only: Manage Projects</h1></div>;

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<div>Register Page (To be built)</div>} />

      {/* Protected Routes (Any logged in user) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Admin Only Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/projects" element={<AdminPanel />} />
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};