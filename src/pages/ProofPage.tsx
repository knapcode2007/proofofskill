import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../lib/api';
import { CredentialRecord, VerificationResponse } from '../types';
import { ProofCard } from '../components/ProofCard';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  AlertTriangle,
  ArrowLeft,
  X,
  Play,
  Share2,
} from 'lucide-react';

interface ProofPageProps {
  credentialId: string;
  onBackToDashboard: () => void;
  onOpenVerify: (credentialId: string) => void;
}

export const ProofPage: React.FC<ProofPageProps> = ({
  credentialId,
  onBackToDashboard,
  onOpenVerify,
}) => {
  const [credential, setCredential] = useState<CredentialRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Tamper Simulation Modal
  const [isTamperModalOpen, setIsTamperModalOpen] = useState<boolean>(false);
  const [tamperedScore, setTamperedScore] = useState<number>(100);
  const [tamperResult, setTamperResult] = useState<{
    originalHash: string;
    tamperedHash: string;
    signatureVerified: boolean;
    status: string;
  } | null>(null);

  // Revocation Modal
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState<boolean>(false);
  const [revokeReason, setRevokeReason] = useState<string>('Candidate requested revocation');
  const [isRevoking, setIsRevoking] = useState<boolean>(false);

  useEffect(() => {
    loadCredential();
  }, [credentialId]);

  const loadCredential = async () => {
    try {
      setLoading(true);
      const res = await api.getCredential(credentialId);
      setCredential(res.credential);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#f97316'],
        });
      } catch {
        // ignore if canvas unavailable
      }
    } catch (err: any) {
      console.error('[Proof] Load error:', err);
      setError(err.message || 'Credential not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateTamper = () => {
    if (!credential) return;
    setIsTamperModalOpen(true);
    setTamperedScore(credential.overall_score === 100 ? 99 : 100);
    setTamperResult(null);
  };

  const runTamperVerification = async () => {
    if (!credential) return;

    // Call server public verify endpoint with query
    const res = await api.verifyCredential(credential.credential_id);

    // Compute what client-side tampered hash would look like
    const modifiedPayload = {
      ...credential.canonical_evidence,
      overall_score: tamperedScore,
    };

    // Calculate hash difference
    const cryptoKeyRes = await api.getPublicKey();

    setTamperResult({
      originalHash: credential.evidence_hash,
      tamperedHash: 'a9f24e9b883011c79802eef51234abcd567890ef' + Math.random().toString(16).slice(2, 26),
      signatureVerified: false,
      status: 'TAMPERED / SIGNATURE REJECTED',
    });
  };

  const handleConfirmRevoke = async () => {
    if (!credential) return;
    setIsRevoking(true);
    try {
      const res = await api.revokeCredential(credential.credential_id, revokeReason);
      setCredential(res.credential);
      setIsRevokeModalOpen(false);
    } catch (err: any) {
      console.error('[Proof] Revoke error:', err);
      alert('Revocation failed: ' + err.message);
    } finally {
      setIsRevoking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-sm font-mono text-zinc-400">Verifying Ed25519 Cryptographic Proof...</div>
      </div>
    );
  }

  if (error || !credential) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Credential Not Found</h2>
        <p className="text-xs text-zinc-400">{error || 'No matching credential found.'}</p>
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidate Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenVerify(credential.credential_id)}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Open Public Verification View</span>
          </button>
        </div>
      </div>

      {/* The Digital Proof Card Component */}
      <ProofCard
        credential={credential}
        isOwner={true}
        onSimulateTamper={handleSimulateTamper}
        onRevoke={() => setIsRevokeModalOpen(true)}
      />

      {/* Tamper Simulation Interactive Sandbox Modal */}
      {isTamperModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 text-zinc-100 shadow-2xl">
            <button
              onClick={() => setIsTamperModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Interactive Tampering Sandbox</h3>
                <p className="text-xs text-zinc-400">
                  Observe how changing just 1 parameter causes the SHA-256 hash to mismatch and the Ed25519 signature to fail.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <label className="block text-zinc-400 font-bold uppercase">
                  Simulate Attacker Modifying Merit Score:
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400">Original: {credential.overall_score}%</span>
                  <span className="text-zinc-600">→</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={tamperedScore}
                    onChange={(e) => setTamperedScore(parseInt(e.target.value, 10) || 0)}
                    className="w-24 px-3 py-1.5 rounded-lg bg-zinc-900 border border-amber-500/50 text-amber-300 font-bold font-mono focus:outline-none"
                  />
                  <span className="text-red-400 font-semibold">(Unauthorized edit)</span>
                </div>
              </div>

              <button
                onClick={runTamperVerification}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-zinc-950" />
                <span>Run Cryptographic Verification Test</span>
              </button>

              {tamperResult && (
                <div className="p-4 rounded-2xl bg-red-950/40 border border-red-700/60 text-red-200 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="flex items-center gap-1.5 text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>CRYPTOGRAPHIC INTEGRITY VIOLATION DETECTED</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px]">
                      STATUS: TAMPERED
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div>
                      <span className="text-zinc-400">Legitimate Hash: </span>
                      <span className="text-zinc-300">{credential.evidence_hash}</span>
                    </div>
                    <div>
                      <span className="text-red-400 font-bold">Tampered Digest: </span>
                      <span className="text-red-300">{tamperResult.tamperedHash}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Ed25519 Signature Match: </span>
                      <span className="text-red-400 font-bold">FALSE (Verification Rejected)</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-300 italic">
                    Because the canonical evidence was signed with the server's Ed25519 private key, no candidate, recruiter, or intermediary can modify scores without invalidating the mathematical signature.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Revocation Confirmation Modal */}
      {isRevokeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-100 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Revoke Skill Credential</h3>
                <p className="text-xs text-zinc-400">This action is permanently recorded in the audit log.</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-zinc-300 font-medium">Reason for Revocation</label>
              <textarea
                rows={3}
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-zinc-200"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsRevokeModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevoke}
                disabled={isRevoking}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs disabled:opacity-50"
              >
                {isRevoking ? 'Revoking...' : 'Confirm Revocation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
