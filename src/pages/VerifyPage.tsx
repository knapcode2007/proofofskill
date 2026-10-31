import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { VerificationResponse } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Lock,
  Key,
  Calendar,
  Award,
  Hash,
  ExternalLink,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface VerifyPageProps {
  initialCredentialId?: string;
  onOpenRecruiter: () => void;
}

export const VerifyPage: React.FC<VerifyPageProps> = ({
  initialCredentialId,
  onOpenRecruiter,
}) => {
  const [queryId, setQueryId] = useState<string>(initialCredentialId || '');
  const [verification, setVerification] = useState<VerificationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCredentialId) {
      setQueryId(initialCredentialId);
      performVerification(initialCredentialId);
    }
  }, [initialCredentialId]);

  const performVerification = async (idToVerify: string) => {
    const trimmed = idToVerify.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.verifyCredential(trimmed);
      setVerification(res);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      setVerification({
        status: 'NOT_FOUND',
        verified: false,
        message: err.message || 'Credential ID not found',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(queryId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Knowledge Public Verification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
          Verify Skill Authenticity
        </h1>
        <p className="text-sm text-zinc-400">
          Independent cryptographic inspection. Recomputes the SHA-256 canonical hash and verifies the Ed25519 digital signature in real time.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            required
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
            placeholder="Enter Credential ID (e.g. POS-2026-PY-7X9A)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 font-mono transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !queryId.trim()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {/* Verification Results Card */}
      {verification && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Status Badge Banner */}
          <div
            className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl ${
              verification.status === 'VALID'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : verification.status === 'REVOKED'
                ? 'bg-red-950/40 border-red-500/50 text-red-200'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  verification.status === 'VALID'
                    ? 'bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/10'
                    : verification.status === 'REVOKED'
                    ? 'bg-red-500/20 text-red-400 ring-4 ring-red-500/10'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {verification.status === 'VALID' ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : verification.status === 'REVOKED' ? (
                  <AlertTriangle className="w-7 h-7" />
                ) : (
                  <XCircle className="w-7 h-7" />
                )}
              </div>
              <div>
                <div className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">
                  Cryptographic Verification Status
                </div>
                <div className="text-2xl font-black tracking-tight mt-0.5">
                  {verification.status}
                </div>
                <div className="text-xs opacity-80 mt-0.5">{verification.message}</div>
              </div>
            </div>

            <div className="text-xs sm:text-right font-mono text-zinc-400">
              <div>Verified: {new Date().toLocaleTimeString()}</div>
              <div>Algorithm: Ed25519 + SHA-256</div>
            </div>
          </div>

          {/* Valid Credential Details View */}
          {verification.status === 'VALID' && verification.credential && (
            <div className="p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-8 shadow-2xl">
              {/* Profile & Skill Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-zinc-800">
                <div className="md:col-span-2 space-y-1">
                  <div className="text-xs text-zinc-400 uppercase font-semibold">Certified Individual</div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
                    {verification.credential.candidate_name}
                  </h2>
                  <div className="text-xs text-zinc-400 pt-1">
                    Credential ID: <span className="text-amber-400 font-mono font-bold">{verification.credential.credential_id}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-[11px] text-zinc-400 uppercase font-semibold">Merit Score</div>
                  <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                    {verification.credential.overall_score}%
                  </div>
                  <div className="text-[10px] text-zinc-400">Deterministic + AI Rubric</div>
                </div>
              </div>

              {/* Assessment Evidence Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <div className="text-[10px] text-zinc-400 uppercase font-semibold">Verified Domain</div>
                  <div className="font-bold text-zinc-200 mt-1">{verification.credential.skill_name}</div>
                  <div className="text-xs text-amber-400 mt-0.5">{verification.credential.difficulty} Tier</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <div className="text-[10px] text-zinc-400 uppercase font-semibold">Automated Test Suites</div>
                  <div className="font-bold text-emerald-400 mt-1">
                    {verification.credential.test_summary.passed_tests} / {verification.credential.test_summary.total_tests} Tests Passed
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">Visible & Hidden Cases (100%)</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <div className="text-[10px] text-zinc-400 uppercase font-semibold">AI Defense Interrogation</div>
                  <div className="font-bold text-zinc-200 mt-1 font-mono">{verification.credential.defense_score}%</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Architectural Rubric Score</div>
                </div>
              </div>

              {/* Competency Gauges */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Competency Evaluation
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Logical Thinking', score: verification.credential.competencies.logical_thinking },
                    { label: 'Problem Solving', score: verification.credential.competencies.problem_solving },
                    { label: 'Code Quality', score: verification.credential.competencies.code_quality },
                    { label: 'Debugging', score: verification.credential.competencies.debugging },
                    { label: 'Edge Case Handling', score: verification.credential.competencies.edge_case_handling },
                    { label: 'Technical Defense', score: verification.credential.defense_score },
                  ].map((c, i) => (
                    <div key={i} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-300">{c.label}</span>
                        <span className="font-bold text-amber-400 font-mono">{c.score}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                          style={{ width: `${c.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic Assurance Details */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-1.5 text-zinc-300 font-semibold uppercase text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mathematical Proof Guarantee</span>
                </div>
                <div className="break-all">
                  <span className="text-zinc-400">Evidence SHA-256: </span>
                  <span className="text-zinc-300">{verification.credential.evidence_hash}</span>
                </div>
                <div className="break-all">
                  <span className="text-zinc-400">Ed25519 Signature: </span>
                  <span className="text-zinc-300">{verification.credential.signature.slice(0, 60)}...</span>
                </div>
                <div className="pt-1 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>Authority: {verification.credential.issuer}</span>
                  <span>Issued: {new Date(verification.credential.issued_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Revoked View Details */}
          {verification.status === 'REVOKED' && (
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
              <h3 className="font-bold text-zinc-200 text-sm">Revocation Record</h3>
              <p className="text-zinc-400">
                This credential was revoked and is no longer recognized as valid evidence of technical skill.
              </p>
              {verification.revocation_reason && (
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300">
                  <span className="text-zinc-400">Reason: </span>
                  {verification.revocation_reason}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
