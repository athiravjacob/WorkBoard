import React, { useState } from 'react';
import { useRegister } from '../hooks/useRegister';

interface RegisterFormProps {
  onToggle: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggle }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { mutate, isPending } = useRegister();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className="w-full max-w-md px-8 py-10 bg-white">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
        <p className="text-slate-500 mt-2">Join us to start managing your work efficiently</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            placeholder="John Doe"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            placeholder="name@company.com"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            placeholder="••••••••"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-indigo-200"
        >
          {isPending ? 'Creating Account...' : 'Get Started'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <button 
          type="button"
          onClick={onToggle}
          className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
        >
          Sign in here
        </button>
      </div>
    </div>
  );
};