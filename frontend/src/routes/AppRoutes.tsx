import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { CreateProjectForm } from '../features/projects/components/CreateProjectForm';


// Enhanced placeholder components
const Dashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Projects Overview</h1>
      <p className="text-slate-500 text-sm">Welcome back! Here is what is happening with your projects today.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { label: 'Active Projects', value: '12', color: 'bg-indigo-500' },
        { label: 'Completed Tasks', value: '128', color: 'bg-emerald-500' },
        { label: 'Pending Reviews', value: '5', color: 'bg-amber-500' }
      ].map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
          <div className="flex items-center mt-2">
            <div className={`w-1 h-6 ${stat.color} rounded-full mr-3`} />
            <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px] flex items-center justify-center border-dashed">
       <div className="text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <div className="w-8 h-8 bg-slate-200 rounded animate-pulse" />
          </div>
          <p className="text-slate-400 font-medium">No recent project activity found</p>
          <Link 
            to="/admin/projects/create"
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition inline-block"
          >
             Create New Project
          </Link>
       </div>
    </div>
  </div>
);

const AdminPanel = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-800">Admin Control Panel</h1>
    <p className="text-slate-500">System-wide configurations and project management.</p>
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
        <span className="text-slate-400">User Management Table Placeholder</span>
      </div>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm/>} />

      {/* Protected Routes (Any logged in user) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
      </Route>

      {/* Admin Only Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/projects" element={<DashboardLayout><AdminPanel /></DashboardLayout>} />
        <Route path="/admin/projects/create" element={<DashboardLayout><CreateProjectForm /></DashboardLayout>} />
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};