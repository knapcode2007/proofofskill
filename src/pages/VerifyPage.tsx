import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { VerificationResponse } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { PixelCrest, CompetencyRadar } from '../components/PixelVisuals';
import { PixelPageLoader, PixelSpinner } from '../components/PixelLoader';

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
    <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <PixelCrest size={48} className="mx-auto" />
        <div className="font-pixel text-[11px] text-amber-400 uppercase tracking-widest">
          ZERO-KNOWLEDGE VERIFIER
        </div>
        <h1 className="font-pixel text-2xl sm:text-4xl lg:text-5xl text-zinc-100 tracking-tight">
          VERIFY AUTHENTICITY
        </h1>
        <p className="font-mono text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Independent cryptographic signature inspection. Real-time Ed25519 & SHA-256 verification.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            required
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
            placeholder="CREDENTIAL ID (e.g. POS-2026-PY-1WTD)..."
            className="w-full px-5 py-3.5 border border-zinc-700 bg-[#070a0f] text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 font-pixel uppercase transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !queryId.trim()}
          className="px-8 py-3.5 pixel-btn-primary text-xs tracking-wider cursor-reactive-target shrink-0 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <PixelSpinner size="sm" color="zinc" />
              <span>VERIFYING...</span>
            </>
          ) : (
            <span>VERIFY</span>
          )}
        </button>
      </form>

      {/* Active Loading Screen */}
      {loading && (
        <PixelPageLoader
          label="AUDITING ED25519 SIGNATURE MATRIX..."
          sublabel="COMPUTING SHA-256 CANONICAL DIGEST ACROSS STORED PROOF"
          variant="card"
          color="emerald"
        />
      )}

      {/* Results View */}
      {!loading && verification && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Status Banner */}
          <div
            className={`p-8 pixel-card flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
              verification.status === 'VALID'
                ? 'border-emerald-500/60 bg-emerald-950/20 text-emerald-200'
                : verification.status === 'REVOKED'
                ? 'border-red-500/60 bg-red-950/20 text-red-200'
                : 'text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-5">
              <div
                className={`w-12 h-12 border flex items-center justify-center font-pixel text-sm shrink-0 ${
                  verification.status === 'VALID'
                    ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                    : verification.status === 'REVOKED'
                    ? 'border-red-400 text-red-400 bg-red-500/10'
                    : 'border-zinc-700 text-zinc-400'
                }`}
              >
                {verification.status === 'VALID' ? 'OK' : '!'}
              </div>
              <div>
                <div className="font-pixel text-[10px] text-zinc-400 uppercase tracking-widest">
                  CRYPTOGRAPHIC STATUS
                </div>
                <div className="font-pixel text-2xl tracking-tight mt-1">
                  {verification.status}
                </div>
              </div>
            </div>

            <div className="font-mono text-xs text-zinc-400 sm:text-right">
              <div>ALGORITHM: Ed25519</div>
              <div>TIME: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>

          {/* Valid Details */}
          {verification.status === 'VALID' && verification.credential && (
            <div className="p-8 sm:p-12 pixel-card space-y-10 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center border-b border-zinc-800 pb-10">
                <div className="space-y-6 font-mono">
                  <div>
                    <span className="font-pixel text-[10px] text-zinc-500 uppercase tracking-widest">
                      CERTIFIED CANDIDATE
                    </span>
                    <h2 className="font-pixel text-2xl sm:text-3xl text-zinc-100 mt-1 uppercase">
                      {verification.credential.candidate_name}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 text-xs">
                    <div className="p-3.5 border border-zinc-800 bg-zinc-950">
                      <div className="text-[10px] text-zinc-500">DOMAIN</div>
                      <div className="font-pixel text-xs text-zinc-200 mt-1">
                        {verification.credential.skill_name}
                      </div>
                    </div>
                    <div className="p-3.5 border border-zinc-800 bg-zinc-950">
                      <div className="text-[10px] text-zinc-500">TIER</div>
                      <div className="font-pixel text-xs text-amber-400 mt-1">
                        {verification.credential.difficulty}
                      </div>
                    </div>
                    <div className="p-3.5 border border-zinc-800 bg-zinc-950">
                      <div className="text-[10px] text-zinc-500">TESTS</div>
                      <div className="font-pixel text-xs text-emerald-400 mt-1">
                        {verification.credential.test_summary.passed_tests}/{verification.credential.test_summary.total_tests} PASSED
                      </div>
                    </div>
                    <div className="p-3.5 border border-zinc-800 bg-zinc-950">
                      <div className="text-[10px] text-zinc-500">MERIT SCORE</div>
                      <div className="font-pixel text-xs text-amber-400 mt-1">
                        {verification.credential.overall_score}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Radar visualization */}
                <div className="flex justify-center">
                  <CompetencyRadar scores={verification.credential.competencies} size={240} />
                </div>
              </div>

              {/* Cryptographic Hashes */}
              <div className="space-y-3 font-mono text-xs bg-black/60 p-5 border border-zinc-800">
                <div className="text-zinc-500 text-[10px] font-pixel uppercase tracking-widest">
                  TAMPER-EVIDENT EVIDENCE PROOF:
                </div>
                <div className="break-all text-[11px] text-zinc-400">
                  SHA-256: {verification.credential.evidence_hash}
                </div>
                <div className="break-all text-[11px] text-zinc-400">
                  SIGNATURE: {verification.credential.signature.slice(0, 50)}...
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
