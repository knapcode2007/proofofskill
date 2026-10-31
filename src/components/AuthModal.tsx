import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PixelCrest } from './PixelVisuals';
import { X, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (isRegister) {
        await register({ email, full_name: fullName, role, bio });
      } else {
        await login(email);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoUser = (demoEmail: string) => {
    setEmail(demoEmail);
    setIsRegister(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md pixel-card p-8 sm:p-10 space-y-6 text-zinc-100 shadow-2xl">
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5">
          <PixelCrest size={36} />
          <div>
            <div className="font-pixel text-xs text-amber-400">PASSPORT ACCESS</div>
            <h3 className="font-pixel text-base text-zinc-100 uppercase">
              {isRegister ? 'CREATE ACCOUNT' : 'AUTHENTICATE'}
            </h3>
          </div>
        </div>

        {/* Quick Demo Accounts */}
        <div className="p-4 border border-zinc-800 bg-black/50 space-y-2 font-mono text-xs">
          <div className="text-[10px] text-zinc-500 uppercase font-pixel">DEMO ACCOUNTS:</div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setDemoUser('alex.rivera@example.com')}
              className="p-2.5 border border-zinc-800 hover:border-amber-500/60 bg-zinc-950 text-left transition cursor-reactive-target"
            >
              <div className="text-zinc-200 font-bold font-pixel text-[11px]">ALEX RIVERA</div>
              <div className="text-[10px] text-amber-400">CANDIDATE</div>
            </button>
            <button
              type="button"
              onClick={() => setDemoUser('sarah.chen@techrecruiting.io')}
              className="p-2.5 border border-zinc-800 hover:border-emerald-500/60 bg-zinc-950 text-left transition cursor-reactive-target"
            >
              <div className="text-zinc-200 font-bold font-pixel text-[11px]">SARAH CHEN</div>
              <div className="text-[10px] text-emerald-400">RECRUITER</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 border border-red-800 bg-red-950/40 text-red-300 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
          {isRegister && (
            <>
              <div>
                <label className="block text-zinc-400 mb-1.5 font-pixel text-[10px]">FULL NAME</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-700 bg-black text-zinc-100 focus:outline-none focus:border-amber-500 transition font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 font-pixel text-[10px]">ROLE</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole('candidate')}
                    className={`py-2.5 border font-pixel text-[11px] transition cursor-reactive-target ${
                      role === 'candidate'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-500'
                    }`}
                  >
                    CANDIDATE
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('recruiter')}
                    className={`py-2.5 border font-pixel text-[11px] transition cursor-reactive-target ${
                      role === 'recruiter'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-500'
                    }`}
                  >
                    RECRUITER
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-zinc-400 mb-1.5 font-pixel text-[10px]">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@domain.com"
              className="w-full px-4 py-3 border border-zinc-700 bg-black text-zinc-100 focus:outline-none focus:border-amber-500 transition font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 pixel-btn-primary text-xs tracking-wider cursor-reactive-target flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>VERIFYING...</span>
            ) : (
              <>
                <span>{isRegister ? 'CREATE PASSPORT' : 'SIGN IN'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center font-mono text-[11px] pt-1">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-zinc-500 hover:text-amber-400 transition"
          >
            {isRegister ? 'Already registered? Sign In' : 'No account? Register here'}
          </button>
        </div>
      </div>
    </div>
  );
};
