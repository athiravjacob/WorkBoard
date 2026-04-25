import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MessageSquare, 
  ListTodo, 
  LogOut 
} from 'lucide-react';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { useLogout } from '../features/auth/hooks/useLogout';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'PM', 'USER'] },
  { name: 'Projects', path: '/admin/projects', icon: Briefcase, roles: ['ADMIN', 'PM'] },
  { name: 'Users', path: '/admin/users', icon: Users, roles: ['ADMIN'] },
  { name: 'Tasks', path: '/tasks', icon: ListTodo, roles: ['USER'] },
  { name: 'Messages', path: '/chat', icon: MessageSquare, roles: ['ADMIN', 'PM', 'USER'] },
];

export const Sidebar = () => {
  const { user } = useAuthStore();
  const logout = useLogout();
  const location = useLocation();

  // Filter links based on user role and adjust paths if necessary
  const filteredLinks = menuItems
    .filter(link => user && link.roles.includes(user.role))
    .map(link => {
      // For Project Managers, steer them to the '/projects' route which filters data
      if (link.name === 'Projects' && user?.role === 'PM') {
        return { ...link, path: '/projects' };
      }
      return link;
    });

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
        <div className="bg-indigo-600 p-1.5 rounded-lg mr-3">
          <LayoutDashboard className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">WorkBoard</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
          {filteredLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;
            
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {link.name}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout Logic at Bottom */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 disabled:opacity-50"
        >
          <LogOut className={`w-5 h-5 mr-3 ${logout.isPending ? 'animate-pulse' : 'text-slate-400'}`} />
          {logout.isPending ? 'Signing out...' : 'Logout'}
        </button>
      </div>
    </aside>
  );
};
