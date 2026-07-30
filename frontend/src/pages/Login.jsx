import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      {/* Dynamic background lighting accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl relative z-10">
        {/* Logo & Title Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/20 mx-auto mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Car className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            DrivePulse Inventory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access dealership management dashboard
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <p className="font-medium leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@dealership.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-98 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Register Link Footer */}
        <div className="mt-8 text-center pt-6 border-t border-slate-800/80">
          <p className="text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
