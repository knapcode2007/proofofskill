import React from 'react';
import { PixelCrest } from './PixelVisuals';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-900 bg-[#05070a] text-zinc-500 font-mono text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PixelCrest size={20} />
          <span className="font-pixel text-[11px] text-zinc-300 tracking-wider">
            PROOF OF SKILL
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-[11px]">HACKTOBERFEST 2026</span>
        </div>

        <div className="text-[11px] text-zinc-500 sm:text-right">
          <span>TEAM KAIZOKU O NAKAMA • Ed25519 CRYPTOGRAPHIC PROOFS</span>
        </div>
      </div>
    </footer>
  );
};
