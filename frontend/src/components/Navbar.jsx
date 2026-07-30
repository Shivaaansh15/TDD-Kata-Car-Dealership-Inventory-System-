import React from 'react';
import { Car, LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Car className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                DrivePulse
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Inventory Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Dealership Inventory System
            </p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>API Online (localhost:5000)</span>
          </div>

          {user && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-200 leading-tight">
                  {user.name || user.email?.split('@')[0] || 'Manager'}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                  {user.email || 'Authenticated'}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 font-medium text-xs transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
            title="Log out of application"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
