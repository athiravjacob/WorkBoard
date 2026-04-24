import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50">
      {/* Left Section - Branding (40%) */}
      <div className="md:w-[40%] bg-indigo-600 p-12 flex flex-col justify-between text-white relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-400 rounded-full opacity-20 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-indigo-600 rounded-md"></div>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Workboard</h1>
          </div>

          <div className="max-w-xs">
            <h2 className="text-5xl font-bold leading-tight mb-6">Manage your work efficiently.</h2>
            <p className="text-indigo-100 text-lg">The all-in-one platform to organize tasks, collaborate with teams, and track progress seamlessly.</p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-indigo-200">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-slate-300"></div>
            ))}
          </div>
          <p>Joined by 2,000+ teams worldwide</p>
        </div>
      </div>

      {/* Right Section - Form Area (60%) */}
      <div className="md:w-[60%] flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Branding (only visible on small screens) */}
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Workboard</h1>
          </div>

          <div className="transition-all duration-300 ease-in-out">
            {isLogin ? (
              <LoginForm onToggle={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onToggle={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
