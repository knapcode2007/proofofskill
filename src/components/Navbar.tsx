import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Code2,
  Terminal,
  Search,
  CheckCircle,
  Settings as SettingsIcon,
  User,
  Briefcase,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, openAuthModal, switchRole } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => setCurrentTab('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-zinc-100 via-zinc-200 to-amber-300 bg-clip-text text-transparent">
                PROOF OF SKILL
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                2026
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 tracking-tight flex items-center gap-1">
              <span>Don't Claim It.</span>
              <span className="text-amber-400 font-semibold">Demonstrate It.</span>
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => setCurrentTab('landing')}
            className={`px-3 py-1.5 rounded-lg transition ${
              currentTab === 'landing'
                ? 'bg-zinc-800 text-amber-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition ${
              currentTab === 'dashboard'
                ? 'bg-zinc-800 text-amber-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setCurrentTab('new-assessment')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              currentTab === 'new-assessment'
                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                : 'text-zinc-300 hover:text-amber-400 hover:bg-zinc-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Take Assessment</span>
          </button>

          <button
            onClick={() => setCurrentTab('recruiter')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              currentTab === 'recruiter'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Recruiter Portal</span>
          </button>

          <button
            onClick={() => setCurrentTab('verify')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              currentTab === 'verify'
                ? 'bg-zinc-800 text-amber-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Public Verify</span>
          </button>
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher */}
          {user && (
            <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => switchRole('candidate')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition ${
                  user.role === 'candidate'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Switch to Candidate role"
              >
                <User className="w-3 h-3" /> Candidate
              </button>
              <button
                onClick={() => switchRole('recruiter')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition ${
                  user.role === 'recruiter'
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Switch to Recruiter role"
              >
                <Briefcase className="w-3 h-3" /> Recruiter
              </button>
            </div>
          )}

          {/* Settings Button */}
          <button
            onClick={() => setCurrentTab('settings')}
            className={`p-2 rounded-lg border transition ${
              currentTab === 'settings'
                ? 'bg-zinc-800 border-zinc-700 text-amber-400'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
            title="System Settings & Diagnostics"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Profile / Auth Button */}
          {user ? (
            <div
              onClick={() => setCurrentTab('settings')}
              className="flex items-center gap-2 pl-2 cursor-pointer group"
            >
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
                alt={user.full_name}
                className="w-8 h-8 rounded-full border border-amber-500/40 object-cover group-hover:border-amber-400 transition"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-zinc-200 group-hover:text-amber-400 transition truncate max-w-[120px]">
                  {user.full_name}
                </div>
                <div className="text-[10px] text-zinc-400 capitalize flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.role === 'candidate' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                  />
                  {user.role}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
