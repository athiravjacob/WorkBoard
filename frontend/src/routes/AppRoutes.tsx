import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '../features/auth/components/AuthPage';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { CreateProjectForm } from '../features/projects/components/CreateProjectForm';
import { ProjectList } from '../features/projects/components/ProjectList';
import { ProjectDetailPage } from '../features/projects/components/ProjectDetailPage';
import { UserTasksPage } from '../features/tasks/components/UserTasksPage';

// Enhanced placeholder components
import { Dashboard } from '../features/dashboard/components/Dashboard';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* Protected Routes (Any logged in user) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/projects/:projectId" element={<DashboardLayout><ProjectDetailPage /></DashboardLayout>} />
        <Route path="/tasks" element={<DashboardLayout><UserTasksPage /></DashboardLayout>} />
      </Route>

      {/* Project Routes (Admin & PM can view, only Admin can create) */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'PM']} />}>
        <Route path="/admin/projects" element={<DashboardLayout><ProjectList /></DashboardLayout>} />
      </Route>
      
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/projects/create" element={<DashboardLayout><CreateProjectForm /></DashboardLayout>} />
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};