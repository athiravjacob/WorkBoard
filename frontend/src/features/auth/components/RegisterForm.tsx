import React, { useState } from 'react';
import {  Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';

export const RegisterForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    
    // Use our custom hook
    const { mutate, isPending } = useRegister();
  
    const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      mutate(formData); // Just call mutate!
    };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleRegister} className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">Create Account</h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="John Doe"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="name@company.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button 
         type="submit" 
         disabled={isPending} // Automatically handle loading state!
         className="w-full bg-blue-600 disabled:bg-gray-400 ..."
       >
         {isPending ? 'Creating Account...' : 'Register'}
       </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
};