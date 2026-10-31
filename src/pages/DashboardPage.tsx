import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Assessment, CredentialRecord } from '../types';
import { PixelCrest } from '../components/PixelVisuals';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileCode,
  AlertTriangle,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { PixelPageLoader } from '../components/PixelLoader';

interface DashboardPageProps {
  onStartNewAssessment: () => void;
  onOpenAssessment: (assessmentId: string) => void;
  onOpenProof: (credentialId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onStartNewAssessment,
  onOpenAssessment,
  onOpenProof,
}) => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [credentials, setCredentials] = useState<CredentialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [asmData, credsData] = await Promise.all([
        api.getAssessments(),
        api.getRecruiterCredentials(),
      ]);
      setAssessments(asmData.assessments);
      const userCreds = user
        ? credsData.credentials.filter((c) => c.candidate_id === user.id)
        : credsData.credentials;
      setCredentials(userCreds);
    } catch (err) {
      console.error('[Dashboard] Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyCredentialLink = (credentialId: string) => {
    const url = `${window.location.origin}/verify/${credentialId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(credentialId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeAssessments = assessments.filter(
    (a) => a.status !== 'credential_issued' && a.status !== 'failed'
  );

  const averageScore =
    credentials.length > 0
      ? Math.round(credentials.reduce((acc, c) => acc + c.overall_score, 0) / credentials.length)
      : 94;

  if (loading) {
    return (
      <PixelPageLoader
        label="RETRIEVING DEVELOPER PASSPORT..."
        sublabel="QUERYING ASYMMETRIC PASS RECORDS // VERIFIED LEDGER"
        variant="fullscreen"
        color="amber"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-20 lg:py-24 space-y-16">
      {/* 1. Header (Negative space, pixel font) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800">
        <div className="space-y-2">
          <div className="font-pixel text-[11px] text-amber-400 uppercase tracking-widest">
            CANDIDATE REPOSITORY
          </div>
          <h1 className="font-pixel text-2xl sm:text-4xl lg:text-5xl text-zinc-100 tracking-tight">
            {user?.full_name ? user.full_name.toUpperCase() : 'DEVELOPER'}
          </h1>
        </div>

        <button
          onClick={onStartNewAssessment}
          className="px-7 py-3.5 pixel-btn-primary text-xs tracking-wider cursor-reactive-target flex items-center gap-2"
        >
          <span>NEW ASSESSMENT</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Numerical KPI Strip (Pixel Cards with Ample Padding) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-8 pixel-card space-y-2">
          <div className="font-mono text-zinc-400 text-[11px] uppercase">CREDENTIALS</div>
          <div className="font-pixel text-3xl sm:text-4xl text-amber-400">{credentials.length}</div>
          <div className="text-[10px] font-mono text-emerald-400">Ed25519 VERIFIED</div>
        </div>

        <div className="p-8 pixel-card space-y-2">
          <div className="font-mono text-zinc-400 text-[11px] uppercase">ACTIVE TASKS</div>
          <div className="font-pixel text-3xl sm:text-4xl text-zinc-200">{activeAssessments.length}</div>
          <div className="text-[10px] font-mono text-zinc-500">IN PROGRESS</div>
        </div>

        <div className="p-8 pixel-card space-y-2">
          <div className="font-mono text-zinc-400 text-[11px] uppercase">AVERAGE MERIT</div>
          <div className="font-pixel text-3xl sm:text-4xl text-emerald-400">{averageScore}%</div>
          <div className="text-[10px] font-mono text-zinc-500">WEIGHTED INDEX</div>
        </div>

        <div className="p-8 pixel-card space-y-2">
          <div className="font-mono text-zinc-400 text-[11px] uppercase">ALGORITHM</div>
          <div className="font-pixel text-2xl text-zinc-100 pt-1">Ed25519</div>
          <div className="text-[10px] font-mono text-zinc-500">CANONICAL SHA-256</div>
        </div>
      </div>

      {/* 3. In-Progress Tasks (if any) */}
      {activeAssessments.length > 0 && (
        <div className="space-y-6">
          <div className="font-pixel text-xs text-amber-400 tracking-wider uppercase">
            ACTIVE ASSESSMENT SESSIONS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeAssessments.map((asm) => (
              <div
                key={asm.id}
                className="p-8 pixel-card flex items-center justify-between gap-6"
              >
                <div className="space-y-1.5">
                  <div className="font-mono text-[10px] text-zinc-500 uppercase">
                    {asm.difficulty} • {asm.language}
                  </div>
                  <div className="font-pixel text-sm sm:text-base text-zinc-100 uppercase">
                    {asm.skill_id.replace('-', ' ')}
                  </div>
                  <div className="font-mono text-[11px] text-amber-400">
                    STATUS: {asm.status.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </div>

                <button
                  onClick={() => onOpenAssessment(asm.id)}
                  className="px-5 py-2.5 pixel-btn-secondary text-xs tracking-wider cursor-reactive-target flex items-center gap-1.5 shrink-0"
                >
                  <span>RESUME</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Verified Skill Credentials Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="font-pixel text-xs text-amber-400 tracking-wider uppercase">
            VERIFIED CREDENTIALS
          </div>
          <span className="font-mono text-xs text-zinc-500">
            {credentials.length} RECORD{credentials.length !== 1 ? 'S' : ''}
          </span>
        </div>

        {credentials.length === 0 ? (
          <div className="p-16 pixel-card text-center space-y-6">
            <PixelCrest size={48} className="mx-auto opacity-50" />
            <div className="font-pixel text-sm text-zinc-300">NO CREDENTIALS ISSUED</div>
            <button
              onClick={onStartNewAssessment}
              className="px-7 py-3 pixel-btn-primary text-xs cursor-reactive-target inline-block"
            >
              TAKE FIRST ASSESSMENT
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {credentials.map((cred) => (
              <div
                key={cred.id}
                className="p-8 sm:p-10 pixel-card space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-[11px] text-amber-400 font-bold">
                        {cred.credential_id}
                      </span>
                      <h3 className="font-pixel text-base sm:text-lg text-zinc-100 mt-1 uppercase">
                        {cred.skill_name}
                      </h3>
                      <div className="font-mono text-xs text-zinc-400 mt-1">
                        TIER: {cred.difficulty.toUpperCase()} • TESTS: {cred.test_summary.passed_tests}/{cred.test_summary.total_tests} PASSED
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-pixel text-2xl sm:text-3xl text-emerald-400">
                        {cred.overall_score}%
                      </div>
                      <div className="font-mono text-[10px] text-zinc-500">MERIT</div>
                    </div>
                  </div>

                  {/* Visual metric tiles */}
                  <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                    <div className="p-3 border border-zinc-800/80 bg-zinc-950/60">
                      <div className="text-[10px] text-zinc-500">LOGIC</div>
                      <div className="font-pixel text-zinc-200 mt-1">
                        {cred.competencies.logical_thinking}%
                      </div>
                    </div>
                    <div className="p-3 border border-zinc-800/80 bg-zinc-950/60">
                      <div className="text-[10px] text-zinc-500">SOLVING</div>
                      <div className="font-pixel text-zinc-200 mt-1">
                        {cred.competencies.problem_solving}%
                      </div>
                    </div>
                    <div className="p-3 border border-zinc-800/80 bg-zinc-950/60">
                      <div className="text-[10px] text-zinc-500">AI DEFENSE</div>
                      <div className="font-pixel text-amber-400 mt-1">
                        {cred.defense_score}%
                      </div>
                    </div>
                  </div>

                  <div className="font-mono text-[10px] text-zinc-500 truncate pt-1">
                    HASH: {cred.evidence_hash}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-5 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-zinc-500">
                    {new Date(cred.issued_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => copyCredentialLink(cred.credential_id)}
                      className="px-4 py-2 pixel-btn-secondary text-[10px] cursor-reactive-target"
                    >
                      {copiedId === cred.credential_id ? 'COPIED' : 'COPY LINK'}
                    </button>
                    <button
                      onClick={() => onOpenProof(cred.credential_id)}
                      className="px-4 py-2 pixel-btn-primary text-[10px] cursor-reactive-target"
                    >
                      PROOF CARD
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
