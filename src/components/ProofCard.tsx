import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Key,
  AlertTriangle,
  QrCode as QrIcon,
  FileText,
  Share2,
} from 'lucide-react';
import { CredentialRecord } from '../types';
import { PixelCrest, CompetencyRadar } from './PixelVisuals';

interface ProofCardProps {
  credential: CredentialRecord;
  onSimulateTamper?: () => void;
  onRevoke?: () => void;
  isOwner?: boolean;
}

export const ProofCard: React.FC<ProofCardProps> = ({
  credential,
  onSimulateTamper,
  onRevoke,
  isOwner = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedSignature, setCopiedSignature] = useState(false);
  const [showCanonicalJson, setShowCanonicalJson] = useState(false);

  const verificationUrl = `${window.location.origin}/verify/${credential.credential_id}`;

  useEffect(() => {
    QRCode.toDataURL(verificationUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then(setQrDataUrl)
      .catch((err) => console.error('[QR] Render error:', err));
  }, [verificationUrl]);

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRevoked = credential.verification_status === 'REVOKED';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      {/* Revocation Alert if Revoked */}
      {isRevoked && (
        <div className="p-5 border border-red-700/80 bg-red-950/40 text-red-200 flex items-center gap-4 pixel-card">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
          <div className="font-mono text-xs">
            <span className="font-bold text-red-400 font-pixel">REVOKED:</span>{' '}
            {credential.revocation_reason || 'Revoked by owner'} (
            {new Date(credential.revoked_at || '').toLocaleDateString()})
          </div>
        </div>
      )}

      {/* Main Digital Credential Card (Pixel Art & Negative Space Design) */}
      <div className="relative pixel-card p-8 sm:p-12 shadow-2xl">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <PixelCrest size={52} />
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-pixel text-lg sm:text-2xl tracking-wider text-zinc-100">
                  PROOF OF SKILL
                </span>
                <span className="font-pixel text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/40">
                  PASSPORT
                </span>
              </div>
              <div className="font-mono text-xs text-zinc-400 mt-1">
                CRYPTOGRAPHIC MERIT CERTIFICATE
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col sm:items-end gap-2 font-mono text-xs">
            <span
              className={`font-pixel text-xs px-2.5 py-1 ${
                isRevoked
                  ? 'bg-red-500/10 text-red-400 border border-red-500/40'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {isRevoked ? 'REVOKED' : 'VALID SIGNATURE'}
            </span>
            <span className="text-zinc-400 text-[11px]">ID: {credential.credential_id}</span>
          </div>
        </div>

        {/* Identity & Visual Radar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10 border-b border-zinc-800 items-center">
          {/* Candidate Info */}
          <div className="space-y-6">
            <div>
              <div className="font-pixel text-[10px] text-zinc-400 uppercase tracking-widest">
                CERTIFIED INDIVIDUAL
              </div>
              <h2 className="font-pixel text-2xl sm:text-3xl text-zinc-100 mt-1">
                {credential.candidate_name}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3.5 font-mono text-xs">
              <div className="p-3.5 border border-zinc-800 bg-zinc-950/60">
                <div className="text-[10px] text-zinc-400 uppercase">DOMAIN</div>
                <div className="font-bold text-zinc-200 mt-0.5">{credential.skill_name}</div>
              </div>
              <div className="p-3.5 border border-zinc-800 bg-zinc-950/60">
                <div className="text-[10px] text-zinc-400 uppercase">PROFICIENCY</div>
                <div className="font-bold text-amber-400 mt-0.5">{credential.difficulty}</div>
              </div>
              <div className="p-3.5 border border-zinc-800 bg-zinc-950/60">
                <div className="text-[10px] text-zinc-400 uppercase">TEST SUITE</div>
                <div className="font-bold text-emerald-400 mt-0.5">
                  {credential.test_summary.passed_tests}/{credential.test_summary.total_tests} PASSED
                </div>
              </div>
              <div className="p-3.5 border border-zinc-800 bg-zinc-950/60">
                <div className="text-[10px] text-zinc-400 uppercase">OVERALL SCORE</div>
                <div className="font-bold text-amber-400 font-pixel text-base mt-0.5">
                  {credential.overall_score}%
                </div>
              </div>
            </div>

            <div className="font-mono text-[11px] text-zinc-400 space-y-1">
              <div>ISSUED: {new Date(credential.issued_at).toLocaleDateString()}</div>
              <div>ALGORITHM: Ed25519 ({credential.public_key_version})</div>
            </div>
          </div>

          {/* Visual SVG Radar & QR Code */}
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 p-6 border border-zinc-800 bg-zinc-950/40">
            <div className="flex flex-col items-center">
              <CompetencyRadar scores={credential.competencies} size={210} />
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center text-center space-y-2 shrink-0">
              {qrDataUrl ? (
                <div className="p-2.5 bg-white">
                  <img src={qrDataUrl} alt="Verify QR Code" className="w-24 h-24" />
                </div>
              ) : (
                <div className="w-24 h-24 bg-zinc-800" />
              )}
              <span className="font-pixel text-[9px] text-zinc-400">SCAN TO VERIFY</span>
            </div>
          </div>
        </div>

        {/* Cryptographic Hashes Strip */}
        <div className="pt-8 space-y-4 font-mono text-xs">
          <div className="font-pixel text-[10px] text-amber-400 uppercase tracking-widest">
            CRYPTOGRAPHIC EVIDENCE RECORD
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
            {/* SHA-256 */}
            <div className="p-4 border border-zinc-800 bg-black/60">
              <div className="flex items-center justify-between text-zinc-400 mb-1.5 text-[10px]">
                <span>SHA-256 CANONICAL HASH</span>
                <button
                  onClick={() => copyToClipboard(credential.evidence_hash, setCopiedHash)}
                  className="text-amber-400 hover:text-amber-300 font-pixel"
                >
                  {copiedHash ? 'COPIED' : 'COPY'}
                </button>
              </div>
              <div className="text-zinc-300 break-all select-all">
                {credential.evidence_hash}
              </div>
            </div>

            {/* Ed25519 Signature */}
            <div className="p-4 border border-zinc-800 bg-black/60">
              <div className="flex items-center justify-between text-zinc-400 mb-1.5 text-[10px]">
                <span>Ed25519 DIGITAL SIGNATURE</span>
                <button
                  onClick={() => copyToClipboard(credential.signature, setCopiedSignature)}
                  className="text-amber-400 hover:text-amber-300 font-pixel"
                >
                  {copiedSignature ? 'COPIED' : 'COPY'}
                </button>
              </div>
              <div className="text-zinc-300 break-all select-all">
                {credential.signature.slice(0, 48)}...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 pixel-card">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => copyToClipboard(verificationUrl, setCopiedLink)}
            className="px-5 py-2.5 pixel-btn-primary text-xs flex items-center gap-2 cursor-reactive-target"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'COPIED!' : 'SHARE LINK'}</span>
          </button>

          <button
            onClick={() => setShowCanonicalJson(!showCanonicalJson)}
            className="px-5 py-2.5 pixel-btn-secondary text-xs flex items-center gap-2 cursor-reactive-target"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>{showCanonicalJson ? 'HIDE JSON' : 'INSPECT JSON'}</span>
          </button>

          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 pixel-btn-secondary text-xs flex items-center gap-2 cursor-reactive-target inline-flex"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>PUBLIC VIEW</span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          {onSimulateTamper && !isRevoked && (
            <button
              onClick={onSimulateTamper}
              className="px-4 py-2.5 pixel-btn-secondary text-xs flex items-center gap-2 cursor-reactive-target"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>TEST TAMPERING</span>
            </button>
          )}

          {isOwner && !isRevoked && onRevoke && (
            <button
              onClick={onRevoke}
              className="px-4 py-2.5 border border-red-800/80 bg-red-950/40 hover:bg-red-900/40 text-red-400 font-pixel text-xs flex items-center gap-2 transition cursor-reactive-target"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>REVOKE</span>
            </button>
          )}
        </div>
      </div>

      {/* JSON Viewer */}
      {showCanonicalJson && (
        <div className="p-6 border border-zinc-800 bg-black font-mono text-xs space-y-3 pixel-card">
          <div className="text-zinc-500 text-[10px] font-pixel">CANONICAL SERIALIZED JSON EVIDENCE:</div>
          <pre className="text-zinc-300 overflow-x-auto p-4 bg-zinc-950 max-h-72">
            {JSON.stringify(credential, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
