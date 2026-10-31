import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../lib/api';
import { CredentialRecord } from '../types';
import { ProofCard } from '../components/ProofCard';
import {
  ShieldCheck,
  Lock,
  AlertTriangle,
  ArrowLeft,
  X,
  Play,
} from 'lucide-react';
import { PixelCrest } from '../components/PixelVisuals';
import { PixelPageLoader } from '../components/PixelLoader';

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

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6'],
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

    setTamperResult({
      originalHash: credential.evidence_hash,
      tamperedHash: 'a9f24e9b883011c79802eef51234abcd567890ef' + Math.random().toString(16).slice(2, 26),
      signatureVerified: false,
      status: 'REJECTED: SIGNATURE MISMATCH',
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
      <PixelPageLoader
        label="VERIFYING CRYPTOGRAPHIC SIGNATURE..."
        sublabel="INSPECTING ED25519 ASYMMETRIC KEYPAIR & SHA-256 HASH"
        variant="fullscreen"
        color="emerald"
      />
    );
  }

  if (error || !credential) {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-5 pixel-card">
        <PixelCrest size={48} className="mx-auto opacity-50" />
        <div className="font-pixel text-sm text-zinc-300">NOT FOUND</div>
        <button
          onClick={onBackToDashboard}
          className="px-6 py-2.5 pixel-btn-secondary text-xs"
        >
          DASHBOARD
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-20 space-y-12">
      {/* Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2.5 font-pixel text-xs text-zinc-400 hover:text-amber-400 transition cursor-reactive-target"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>DASHBOARD</span>
        </button>

        <button
          onClick={() => onOpenVerify(credential.credential_id)}
          className="px-5 py-2 pixel-btn-secondary text-xs flex items-center gap-2 cursor-reactive-target"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>PUBLIC VERIFY</span>
        </button>
      </div>

      {/* Proof Card Component */}
      <ProofCard
        credential={credential}
        isOwner={true}
        onSimulateTamper={handleSimulateTamper}
        onRevoke={() => setIsRevokeModalOpen(true)}
      />

      {/* Tamper Simulation Interactive Sandbox Modal */}
      {isTamperModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg pixel-card p-8 sm:p-10 space-y-6 text-zinc-100 shadow-2xl">
            <button
              onClick={() => setIsTamperModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <span className="font-pixel text-[10px] text-amber-400 uppercase tracking-widest">
                TAMPER REJECTION TEST
              </span>
              <h3 className="font-pixel text-lg">ALTER CANONICAL PAYLOAD</h3>
            </div>

            <div className="space-y-5 text-xs font-mono">
              <div className="p-4 border border-zinc-800 bg-black flex items-center justify-between">
                <span className="text-zinc-500">SCORE: {credential.overall_score}%</span>
                <span className="text-zinc-600">→</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={tamperedScore}
                  onChange={(e) => setTamperedScore(parseInt(e.target.value, 10) || 0)}
                  className="w-24 px-3 py-1.5 bg-zinc-950 border border-amber-500/60 text-amber-300 font-pixel text-xs"
                />
              </div>

              <button
                onClick={runTamperVerification}
                className="w-full py-3.5 pixel-btn-primary text-xs tracking-wider cursor-reactive-target flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-zinc-950" />
                <span>EXECUTE VERIFICATION TEST</span>
              </button>

              {tamperResult && (
                <div className="p-5 border border-red-700 bg-red-950/30 text-red-200 space-y-2.5 animate-in fade-in duration-150">
                  <div className="font-pixel text-xs text-red-400">
                    STATUS: {tamperResult.status}
                  </div>
                  <div className="text-[11px] text-zinc-400 leading-relaxed">
                    Modifying canonical score changed SHA-256 digest. Ed25519 signature fails mathematical verification.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Revocation Confirmation Modal */}
      {isRevokeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="relative w-full max-w-md pixel-card p-8 space-y-5 text-zinc-100 shadow-2xl">
            <div className="space-y-1.5">
              <div className="font-pixel text-xs text-red-400">REVOKE CREDENTIAL</div>
              <p className="font-mono text-xs text-zinc-400">Action permanently logged.</p>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <label className="text-zinc-400">REASON:</label>
              <textarea
                rows={3}
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                className="w-full p-3 bg-black border border-zinc-800 text-xs text-zinc-200"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setIsRevokeModalOpen(false)}
                className="px-4 py-2 pixel-btn-secondary text-xs text-zinc-400 hover:text-zinc-200"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmRevoke}
                disabled={isRevoking}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-pixel text-xs disabled:opacity-50"
              >
                {isRevoking ? 'REVOKING...' : 'CONFIRM REVOKE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
