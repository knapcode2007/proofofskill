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
  Calendar,
  Award,
  AlertTriangle,
  QrCode as QrIcon,
  Flame,
  FileText,
  Share2,
} from 'lucide-react';
import { CredentialRecord } from '../types';

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
      width: 256,
      margin: 1,
      color: {
        dark: '#09090b',
        light: '#ffffff',
      },
    })
      .then(setQrDataUrl)
      .catch((err) => console.error('[QR] Failed to render QR code:', err));
  }, [verificationUrl]);

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRevoked = credential.verification_status === 'REVOKED';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner if Revoked */}
      {isRevoked && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-700/80 text-red-200 flex items-start gap-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm">CREDENTIAL REVOKED</div>
            <div className="text-xs text-red-300/90 mt-0.5">
              Reason: {credential.revocation_reason || 'Revoked by authorized owner'} on{' '}
              {new Date(credential.revoked_at || '').toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Main Digital Credential Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-2 border-zinc-700/60 p-6 sm:p-10 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Card Header */}
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-zinc-950 shadow-xl shadow-amber-500/20 ring-4 ring-amber-500/10">
              <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-wider text-zinc-100">
                  PROOF OF SKILL
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  SKILL PASSPORT
                </span>
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                Cryptographically Signed Technical Demonstration
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col sm:items-end gap-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isRevoked
                  ? 'bg-red-500/10 border-red-500/50 text-red-400'
                  : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
              }`}
            >
              {isRevoked ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" /> REVOKED
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> CRYPTOGRAPHICALLY VALID
                </>
              )}
            </div>
            <div className="text-[11px] font-mono text-zinc-400">
              ID: <span className="text-zinc-200 font-bold">{credential.credential_id}</span>
            </div>
          </div>
        </div>

        {/* Candidate & Skill Identity Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-b border-zinc-800">
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Certified Candidate
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mt-0.5">
                {credential.candidate_name}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Verified Skill</div>
                <div className="font-bold text-sm text-zinc-200 mt-1">{credential.skill_name}</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Proficiency Level</div>
                <div className="font-bold text-sm text-amber-400 mt-1">{credential.difficulty}</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Overall Rating</div>
                <div className="font-bold text-sm text-emerald-400 mt-1 flex items-center gap-1">
                  <span>{credential.overall_score}/100</span>
                  <span className="text-[10px] text-zinc-400 font-normal">Score</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Issued: {new Date(credential.issued_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Issuer: Proof of Skill Authority</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-zinc-400" />
                <span>Key: {credential.public_key_version}</span>
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
            {qrDataUrl ? (
              <div className="p-2.5 bg-white rounded-xl shadow-md">
                <img src={qrDataUrl} alt="Verification QR Code" className="w-32 h-32" />
              </div>
            ) : (
              <div className="w-32 h-32 bg-zinc-800 rounded-xl animate-pulse flex items-center justify-center">
                <QrIcon className="w-8 h-8 text-zinc-400" />
              </div>
            )}
            <div className="text-[11px] font-medium text-zinc-300 mt-2.5">
              Scan to Verify Authenticity
            </div>
            <div className="text-[10px] text-zinc-400">Independent Recruiter Verification</div>
          </div>
        </div>

        {/* Competency Breakdown Gauges */}
        <div className="py-8 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Competency Breakdown & Practical Performance</span>
            </h3>
            <span className="text-xs text-zinc-400">
              Automated Tests: {credential.test_summary.passed_tests}/{credential.test_summary.total_tests} Passed (100%)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Logical Thinking', score: credential.competencies.logical_thinking },
              { label: 'Problem Solving', score: credential.competencies.problem_solving },
              { label: 'Code Quality', score: credential.competencies.code_quality },
              { label: 'Debugging', score: credential.competencies.debugging },
              { label: 'Edge Case Handling', score: credential.competencies.edge_case_handling },
              { label: 'Technical Defense', score: credential.defense_score },
            ].map((comp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">{comp.label}</span>
                  <span className="font-mono font-bold text-amber-400">{comp.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
                    style={{ width: `${comp.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-zinc-400 italic bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/60">
            "{credential.competencies.summary}"
          </p>
        </div>

        {/* Cryptographic Proof Audit Box */}
        <div className="pt-6 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Cryptographic Proof Hashes & Ed25519 Signature</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            {/* Evidence Hash */}
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                <span>SHA-256 CANONICAL EVIDENCE HASH</span>
                <button
                  onClick={() => copyToClipboard(credential.evidence_hash, setCopiedHash)}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                >
                  {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-zinc-300 text-[11px] break-all select-all font-mono">
                {credential.evidence_hash}
              </div>
            </div>

            {/* Signature */}
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                <span>Ed25519 DIGITAL SIGNATURE</span>
                <button
                  onClick={() => copyToClipboard(credential.signature, setCopiedSignature)}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                >
                  {copiedSignature ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSignature ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-zinc-300 text-[11px] break-all select-all font-mono">
                {credential.signature.slice(0, 48)}...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Public Link */}
          <button
            onClick={() => copyToClipboard(verificationUrl, setCopiedLink)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Verification Link'}</span>
          </button>

          {/* Inspect Evidence */}
          <button
            onClick={() => setShowCanonicalJson(!showCanonicalJson)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>{showCanonicalJson ? 'Hide Evidence JSON' : 'Inspect Evidence JSON'}</span>
          </button>

          {/* Open Public URL in new tab */}
          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Verification Page</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          {/* Simulate Tamper Sandbox Button */}
          {onSimulateTamper && !isRevoked && (
            <button
              onClick={onSimulateTamper}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-semibold transition"
              title="Test how cryptographic signature rejects altered records"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Tampering Test</span>
            </button>
          )}

          {/* Revoke Credential */}
          {isOwner && !isRevoked && onRevoke && (
            <button
              onClick={onRevoke}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-red-300 text-xs font-semibold transition"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Revoke</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Canonical JSON Evidence */}
      {showCanonicalJson && (
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800">
            <span>Canonical Evidence Payload (Serialized Key-Order Sorted JSON)</span>
            <span className="text-[10px] text-zinc-400">Strict Deterministic Serialization</span>
          </div>
          <pre className="text-zinc-300 overflow-x-auto p-3 rounded-lg bg-black/60 max-h-72">
            {JSON.stringify(credential, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
