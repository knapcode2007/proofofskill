import React from 'react';
import { ShieldCheck, Heart, Github, Key, Lock, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950/90 text-zinc-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-zinc-200 tracking-wide">PROOF OF SKILL</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">
                Hacktoberfest 2026
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
              Replacing resume claims with evidence-backed cryptographic skill passports.
              Candidates solve real challenges, execute code in isolated sandboxes, defend implementation decisions with AI, and issue verifiable Ed25519 digital credentials.
            </p>
            <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
              <span>Built with precision by</span>
              <span className="font-semibold text-amber-400">Team KAIZOKU O NAKAMA</span>
            </div>
          </div>

          {/* Col 2: Cryptographic Standards */}
          <div>
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] mb-3">
              Cryptographic Engine
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Ed25519 Digital Signatures</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Canonical JSON & SHA-256</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tamper-Evident Public Verification</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Architectural Principles */}
          <div>
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] mb-3">
              Zero-Trust Architecture
            </h4>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Hidden tests remain strictly server-side. Private signing keys are never exposed to the client. Public verification recalculates hash digests directly from the canonical record.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div>
            © 2026 PROOF OF SKILL • Team KAIZOKU O NAKAMA • Open Standards for Technical Merit
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Ed25519 Authority: Active (v1)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
