import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { CredentialRecord } from '../types';
import {
  Search,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Award,
  Filter,
  ExternalLink,
  ShieldCheck,
  User,
  Calendar,
  Lock,
} from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Hiring & Technical Talent Partner Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
            Recruiter Verification Intelligence
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Search candidates by demonstrated technical proof, review test suite telemetry, and verify tamper-evident signatures.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Active Verification Engine: Ed25519 v1</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by candidate name, skill, or ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-400">Filter Level:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
          >
            <option value="all">All Proficiency Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-zinc-400">
        Found {filteredCredentials.length} verified candidate demonstration{filteredCredentials.length !== 1 ? 's' : ''}
      </div>

      {/* Credentials Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs text-zinc-400">Loading Candidate Registry...</div>
        </div>
      ) : filteredCredentials.length === 0 ? (
        <div className="p-10 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-200">No Matching Credentials</h3>
          <p className="text-xs text-zinc-400">Try adjusting your search criteria or filter options.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCredentials.map((cred) => {
            const isValid = cred.verification_status === 'VALID';
            return (
              <div
                key={cred.id}
                className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between gap-5 shadow-xl relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isValid ? 'bg-emerald-400' : 'bg-red-400'
                          }`}
                        />
                        <span className="text-[11px] font-mono text-zinc-400">
                          {cred.credential_id}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-100 mt-1">
                        {cred.candidate_name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-emerald-400 font-mono">
                        {cred.overall_score}%
                      </div>
                      <div className="text-[10px] text-zinc-400">Merit Rating</div>
                    </div>
                  </div>

                  {/* Skill Badge */}
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <div className="text-xs font-semibold text-zinc-200">{cred.skill_name}</div>
                    <div className="text-[11px] text-amber-400 font-medium">
                      Tier: {cred.difficulty} • Tests: {cred.test_summary.passed_tests}/{cred.test_summary.total_tests} Passed
                    </div>
                  </div>

                  {/* Competency preview */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-zinc-400">
                      <span>Problem Solving:</span>
                      <span className="font-mono text-zinc-200">{cred.competencies.problem_solving}%</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>AI Defense Reasoning:</span>
                      <span className="font-mono text-amber-400">{cred.defense_score}%</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Code Quality:</span>
                      <span className="font-mono text-zinc-200">{cred.competencies.code_quality}%</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[10px] text-zinc-400">
                    {new Date(cred.issued_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenVerify(cred.credential_id)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1 transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verify</span>
                    </button>
                    <button
                      onClick={() => onOpenProof(cred.credential_id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition"
                    >
                      Inspect Evidence
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
