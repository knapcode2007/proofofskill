import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PixelCrest } from './PixelVisuals';
import { Settings as SettingsIcon, User, Briefcase, Search, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, openAuthModal, switchRole } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#05070a]/95 backdrop-blur-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single element brand wordmark with pixel crest */}
        <div
          onClick={() => setCurrentTab('landing')}
          className="flex items-center gap-3.5 cursor-pointer group shrink-0"
        >
          <PixelCrest size={30} className="group-hover:scale-105 transition-transform" />
          <div className="flex items-center gap-2">
            <span className="font-pixel text-sm sm:text-base tracking-wider text-zinc-100 group-hover:text-amber-400 transition-colors">
              PROOF OF SKILL
            </span>
          </div>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-pixel tracking-wider text-zinc-400">
          <button
            onClick={() => setCurrentTab('landing')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-zinc-100 py-1.5 ${
              currentTab === 'landing' ? 'text-amber-400 border-b-2 border-amber-400' : ''
            }`}
          >
            OVERVIEW
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-zinc-100 py-1.5 ${
              currentTab === 'dashboard' ? 'text-amber-400 border-b-2 border-amber-400' : ''
            }`}
          >
            DASHBOARD
          </button>

          <button
            onClick={() => setCurrentTab('new-assessment')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-400 py-1.5 ${
              currentTab === 'new-assessment' ? 'text-amber-400 border-b-2 border-amber-400' : ''
            }`}
          >
            ASSESSMENT
          </button>

          <button
            onClick={() => setCurrentTab('recruiter')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-zinc-100 py-1.5 ${
              currentTab === 'recruiter' ? 'text-amber-400 border-b-2 border-amber-400' : ''
            }`}
          >
            RECRUITER
          </button>

          <button
            onClick={() => setCurrentTab('verify')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-zinc-100 py-1.5 ${
              currentTab === 'verify' ? 'text-amber-400 border-b-2 border-amber-400' : ''
            }`}
          >
            VERIFY
          </button>
        </nav>

        {/* Zone 3: 1 primary action / profile switch */}
        <div className="flex items-center gap-4 shrink-0">
          {user && (
            <div className="hidden sm:flex items-center border border-zinc-800 p-0.5 text-xs font-mono">
              <button
                onClick={() => switchRole('candidate')}
                className={`px-2.5 py-1 transition font-pixel text-[10px] ${
                  user.role === 'candidate'
                    ? 'bg-amber-500 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                CANDIDATE
              </button>
              <button
                onClick={() => switchRole('recruiter')}
                className={`px-2.5 py-1 transition font-pixel text-[10px] ${
                  user.role === 'recruiter'
                    ? 'bg-emerald-500 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                RECRUITER
              </button>
            </div>
          )}

          <button
            onClick={() => setCurrentTab('settings')}
            className="p-2 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition"
            title="System Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {user ? (
            <button
              onClick={() => setCurrentTab('settings')}
              className="text-xs font-pixel text-zinc-300 hover:text-amber-400 transition"
            >
              {user.full_name.split(' ')[0].toUpperCase()}
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-4 py-2 pixel-btn-primary text-xs tracking-wider cursor-reactive-target"
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
