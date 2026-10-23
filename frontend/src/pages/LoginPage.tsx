import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto relative overflow-hidden shadow-2xl">
      {/* Top Subtle Wave Decorative Background */}
      <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-blue-100/60 to-transparent pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 px-6 pt-12 pb-8 flex-1 flex flex-col justify-center">
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <p className="text-xs font-bold text-blue-600 tracking-wide uppercase">
            Smarter Inspection. Safer Production.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">Email or Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sanjay@defex.ai"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 text-xs md:text-sm transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <span>Signing In...</span> : <span>Login</span>}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        {/* Demo Mode Box (From Mockup!) */}
        <div className="mt-6 bg-blue-50/80 border border-blue-100 rounded-2xl p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-900">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Demo Mode</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500">
            Use demo credentials to explore the system
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 font-bold py-2.5 px-4 rounded-xl text-xs shadow-xs transition-all"
          >
            Demo Login
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center py-4 text-[11px] text-slate-400 font-medium">
        DefEx.ai • Industrial Quality Intelligence v1.0
      </div>
    </div>
  );
};
