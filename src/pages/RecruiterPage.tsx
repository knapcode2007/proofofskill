import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { CredentialRecord } from '../types';
import { PixelCrest } from '../components/PixelVisuals';
import {
  Search,
  Briefcase,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { PixelPageLoader } from '../components/PixelLoader';

interface RecruiterPageProps {
  onOpenProof: (credentialId: string) => void;
  onOpenVerify: (credentialId: string) => void;
}

export const RecruiterPage: React.FC<RecruiterPageProps> = ({
  onOpenProof,
  onOpenVerify,
}) => {
  const [credentials, setCredentials] = useState<CredentialRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAllCredentials();
  }, []);

  const loadAllCredentials = async () => {
    try {
      setLoading(true);
      const res = await api.getRecruiterCredentials();
      setCredentials(res.credentials);
    } catch (err) {
      console.error('[Recruiter] Error fetching credentials:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCredentials = credentials.filter((cred) => {
    const matchesSearch =
      cred.candidate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.credential_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.skill_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === 'all' ||
      cred.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-20 lg:py-24 space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-800">
        <div className="space-y-2">
          <div className="font-pixel text-[11px] text-amber-400 uppercase tracking-widest">
            HIRING TALENT INTELLIGENCE
          </div>
          <h1 className="font-pixel text-2xl sm:text-4xl lg:text-5xl text-zinc-100 tracking-tight">
            RECRUITER VERIFICATION REGISTRY
          </h1>
        </div>

        <div className="font-mono text-xs text-zinc-400 flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 bg-emerald-400 inline-block" />
          <span className="font-pixel text-[11px]">Ed25519 VERIFICATION ACTIVE</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH CANDIDATE OR SKILL..."
            className="w-full px-5 py-3 border border-zinc-800 bg-[#070a0f] font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto font-mono text-xs">
          <span className="text-zinc-500 uppercase font-pixel text-[10px]">TIER:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2.5 border border-zinc-800 bg-[#070a0f] text-zinc-200 focus:outline-none font-pixel text-[11px]"
          >
            <option value="all">ALL TIERS</option>
            <option value="Beginner">BEGINNER</option>
            <option value="Intermediate">INTERMEDIATE</option>
            <option value="Advanced">ADVANCED</option>
          </select>
        </div>
      </div>

      {/* Credentials Grid */}
      {loading ? (
        <PixelPageLoader
          label="QUERYING CANDIDATE REGISTRY..."
          sublabel="FETCHING CRYPTOGRAPHICALLY VALIDATED MERKLE PASSES"
          variant="card"
          color="amber"
        />
      ) : filteredCredentials.length === 0 ? (
        <div className="p-16 pixel-card text-center space-y-3">
          <div className="font-pixel text-sm text-zinc-300">NO CANDIDATE MATCHES</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCredentials.map((cred) => {
            const isValid = cred.verification_status === 'VALID';
            return (
              <div
                key={cred.id}
                className="p-8 sm:p-10 pixel-card flex flex-col justify-between gap-6"
              >
                <div className="space-y-5">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-[10px] text-zinc-500">
                        {cred.credential_id}
                      </span>
                      <h3 className="font-pixel text-base sm:text-lg text-zinc-100 mt-1 uppercase">
                        {cred.candidate_name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="font-pixel text-2xl text-emerald-400">
                        {cred.overall_score}%
                      </div>
                      <div className="font-mono text-[9px] text-zinc-500">MERIT</div>
                    </div>
                  </div>

                  {/* Domain Tile */}
                  <div className="p-3.5 border border-zinc-800 bg-black/40 font-mono text-xs space-y-1">
                    <div className="font-bold text-zinc-200">{cred.skill_name}</div>
                    <div className="text-[10px] text-amber-400">
                      {cred.difficulty.toUpperCase()} • {cred.test_summary.passed_tests}/{cred.test_summary.total_tests} TESTS PASSED
                    </div>
                  </div>

                  {/* Competency Metric Triad */}
                  <div className="grid grid-cols-3 gap-2.5 font-mono text-xs">
                    <div className="p-2.5 border border-zinc-800/80 bg-zinc-950">
                      <div className="text-[9px] text-zinc-500">LOGIC</div>
                      <div className="font-pixel text-zinc-200 mt-1">{cred.competencies.logical_thinking}%</div>
                    </div>
                    <div className="p-2.5 border border-zinc-800/80 bg-zinc-950">
                      <div className="text-[9px] text-zinc-500">SOLVE</div>
                      <div className="font-pixel text-zinc-200 mt-1">{cred.competencies.problem_solving}%</div>
                    </div>
                    <div className="p-2.5 border border-zinc-800/80 bg-zinc-950">
                      <div className="text-[9px] text-zinc-500">DEFENSE</div>
                      <div className="font-pixel text-amber-400 mt-1">{cred.defense_score}%</div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-5 border-t border-zinc-800 flex items-center justify-between font-mono text-xs">
                  <span className="text-[10px] text-zinc-500">
                    {new Date(cred.issued_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => onOpenVerify(cred.credential_id)}
                      className="px-3 py-1.5 pixel-btn-secondary text-[10px] cursor-reactive-target"
                    >
                      VERIFY
                    </button>
                    <button
                      onClick={() => onOpenProof(cred.credential_id)}
                      className="px-4 py-1.5 pixel-btn-primary text-[10px] cursor-reactive-target"
                    >
                      PROOF
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
