import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';

interface LoginFormProps {
  onToggle: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="w-full max-w-md px-8 py-10 bg-white">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
        <p className="text-slate-500 mt-2">Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="name@company.com"
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={login.isPending}
          className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-indigo-200"
        >
          {login.isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-600">
        Don't have an account?{' '}
        <button 
          type="button"
          onClick={onToggle}
          className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
        >
          Register for free
        </button>
      </div>
    </div>
  );
};