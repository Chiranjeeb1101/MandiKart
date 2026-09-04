import React, { useState } from 'react';
import type { AdminUser } from '../types/admin';

interface LoginProps {
  onLoginSuccess: (user: AdminUser) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@mandikart.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      if (email.trim() && password.trim()) {
        const mockUser: AdminUser = {
          id: 'adm-001',
          name: 'Rajesh Sharma',
          email: email,
          role: 'SUPER_ADMIN',
          department: 'Platform Ops & Oversight',
        };
        setIsLoading(false);
        onLoginSuccess(mockUser);
      } else {
        setIsLoading(false);
        setErrorMessage('Please provide valid work credentials.');
      }
    }, 500);
  };

  return (
    <main className="flex min-h-screen w-full bg-black overflow-hidden font-sans text-white">
      <div className="flex w-full min-h-screen max-w-[1600px] mx-auto bg-black">
        {/* Left Side: Brand Visual Section (45%) */}
        <section className="hidden lg:flex w-[45%] bg-black relative flex-col justify-between p-12 overflow-hidden border-r border-white">
          <div className="absolute inset-0 agri-pattern z-0 opacity-10" />

          {/* Ambient Glow Mesh */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] z-0 pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] z-0 pointer-events-none" />

          {/* Content Layer */}
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Header Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-black shadow-lg">
                <span className="material-symbols-outlined text-black text-2xl fill">eco</span>
              </div>
              <div>
                <span className="text-white font-black text-2xl tracking-tight block">MandiKart</span>
                <span className="text-emerald-400 font-bold text-xs tracking-widest uppercase block -mt-1">
                  Real-Time Control Room
                </span>
              </div>
            </div>

            {/* Main Title & Description */}
            <div className="max-w-md space-y-6 my-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-black border border-emerald-400 rounded-full text-emerald-400 text-xs font-extrabold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Telemetry & Command Portal
              </div>

              <h1 className="text-white font-black text-4xl lg:text-5xl leading-tight tracking-tight">
                Operational Command Center
              </h1>

              <p className="text-slate-300 text-base leading-relaxed font-medium">
                Centralized platform governance. Monitor direct farmer-to-buyer trades in real-time, inspect KYC land records, handle dispute resolutions, and track IoT cold storage spoilage alerts.
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white">
                <div className="p-4 rounded-xl bg-black border border-white">
                  <div className="text-2xl font-black text-emerald-400">WebSocket</div>
                  <div className="text-xs text-slate-300 font-semibold mt-0.5">Live Telemetry Pings</div>
                </div>
                <div className="p-4 rounded-xl bg-black border border-white">
                  <div className="text-2xl font-black text-emerald-400">4 Surfaces</div>
                  <div className="text-xs text-slate-300 font-semibold mt-0.5">Synced Real-Time</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-slate-300 text-xs font-mono border-t border-white pt-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-base">verified_user</span>
                <span>Encrypted 256-bit Connection</span>
              </div>
              <span className="text-white font-bold">System Status: Healthy</span>
            </div>
          </div>
        </section>

        {/* Right Side: Login Form Area (55%) */}
        <section className="w-full lg:w-[55%] flex items-center justify-center p-8 lg:p-20 relative bg-black">
          <div className="w-full max-w-[440px] space-y-8 bg-black p-8 sm:p-10 rounded-2xl border border-white shadow-2xl">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">Welcome back</h2>
              <p className="text-slate-300 text-sm font-medium">Sign in to your MandiKart Admin Control Center</p>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-black border border-rose-400 rounded-xl text-rose-400 text-xs font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider" htmlFor="email">
                  Work Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl">mail</span>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mandikart.gov.in"
                    className="w-full pl-11 pr-4 py-3 bg-black border border-white rounded-xl text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl">lock</span>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-12 py-3 bg-black border border-white rounded-xl text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white bg-black text-white focus:ring-white cursor-pointer"
                  />
                  <span className="text-slate-300 font-semibold">Remember this session</span>
                </label>
                <a href="#forgot" className="text-emerald-400 font-bold hover:text-emerald-300 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-white text-black hover:bg-slate-200 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all duration-200 shadow-md disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Console</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-white text-center">
              <p className="text-xs text-slate-300 font-medium">
                Restricted System · Unauthorized access is monitored & logged.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};


