import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, User } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Bypass authentication for prototype demo
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1A2333] border border-[#2E3D56] rounded-xl p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded-lg shadow-lg shadow-blue-500/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">AIRSIGHT AI</h1>
            <p className="text-xs text-[#A8B8D0] mt-1">Urban Air Quality Intelligence Platform</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A8B8D0] uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#6B7FA3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="collector@mumbai.gov.in"
                className="w-full bg-[#121824] border border-[#2E3D56] rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder-[#6B7FA3] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A8B8D0] uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6B7FA3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#121824] border border-[#2E3D56] rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder-[#6B7FA3] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md text-sm transition-colors shadow-lg shadow-blue-500/10"
          >
            Authenticate Portal
          </button>
        </form>
      </div>
    </div>
  );
};
