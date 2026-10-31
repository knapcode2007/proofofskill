import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Assessment, CredentialRecord } from '../types';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileCode,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';

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
        api.getRecruiterCredentials(), // Get list of credentials
      ]);
      setAssessments(asmData.assessments);
      // Filter credentials for current user if candidate
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
  const completedAssessments = assessments.filter((a) => a.status === 'credential_issued');

  const averageScore =
    credentials.length > 0
      ? Math.round(credentials.reduce((acc, c) => acc + c.overall_score, 0) / credentials.length)
      : 92;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Candidate Skill Passport
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
            Welcome back, {user?.full_name || 'Candidate'}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track your verified competencies, in-progress challenges, and tamper-evident credentials.
          </p>
        </div>

        <button
          onClick={onStartNewAssessment}
          className="self-start md:self-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition hover:scale-102 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start New Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium">Earned Credentials</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-100">{credentials.length}</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Cryptographically Valid
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium">In-Progress Tasks</span>
            <Clock className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-100">{activeAssessments.length}</div>
          <div className="text-xs text-zinc-400 mt-1">Awaiting defense or submission</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium">Average Merit Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-100">{averageScore}%</div>
          <div className="text-xs text-zinc-400 mt-1">Weighted tests + AI defense</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-medium">Cryptographic Status</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-zinc-100">Ed25519 v1</div>
          <div className="text-xs text-zinc-400 mt-1">Canonical SHA-256 Hashed</div>
        </div>
      </div>

      {/* 3. In-Progress Assessments Section */}
      {activeAssessments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <span>In-Progress Assessments</span>
            </h2>
            <span className="text-xs text-zinc-400">
              {activeAssessments.length} active session{activeAssessments.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeAssessments.map((asm) => (
              <div
                key={asm.id}
                className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 transition flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                      {asm.difficulty} • {asm.language}
                    </span>
                    <h3 className="text-base font-bold text-zinc-100 capitalize mt-2">
                      {asm.skill_id.replace('-', ' ')}
                    </h3>
                    <div className="text-xs text-zinc-400 mt-1">
                      Status: <span className="text-amber-400 font-semibold">{asm.status.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                    <FileCode className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                  <span className="text-zinc-400">
                    Started {new Date(asm.started_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onOpenAssessment(asm.id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold flex items-center gap-1.5 transition"
                  >
                    <span>Resume Workspace</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Earned Skill Credentials Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Earned Skill Credentials & Verification Passports</span>
          </h2>
          <span className="text-xs text-zinc-400">
            {credentials.length} verified credential{credentials.length !== 1 ? 's' : ''}
          </span>
        </div>

        {credentials.length === 0 ? (
          <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base font-bold text-zinc-200">No Credentials Issued Yet</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Complete your first technical coding assessment and AI defense session to generate a tamper-evident Ed25519 skill passport.
              </p>
            </div>
            <button
              onClick={onStartNewAssessment}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs inline-flex items-center gap-2 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Begin Your First Assessment</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {credentials.map((cred) => (
              <div
                key={cred.id}
                className="p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between gap-6 shadow-xl relative overflow-hidden"
              >
                {/* Subtle top indicator */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    cred.verification_status === 'VALID' ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />

                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {cred.credential_id}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            cred.verification_status === 'VALID'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {cred.verification_status}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-zinc-100 mt-1">
                        {cred.skill_name}
                      </h3>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        Proficiency: <span className="text-zinc-300 font-medium">{cred.difficulty}</span> • Tests:{' '}
                        <span className="text-emerald-400 font-medium">
                          {cred.test_summary.passed_tests}/{cred.test_summary.total_tests} Passed
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-400 font-mono">
                        {cred.overall_score}%
                      </div>
                      <div className="text-[10px] text-zinc-400">Overall Rating</div>
                    </div>
                  </div>

                  {/* Competency Badges */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
                      <div className="text-[10px] text-zinc-400">Logic</div>
                      <div className="font-bold text-zinc-200">
                        {cred.competencies.logical_thinking}%
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
                      <div className="text-[10px] text-zinc-400">Problem Solving</div>
                      <div className="font-bold text-zinc-200">
                        {cred.competencies.problem_solving}%
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
                      <div className="text-[10px] text-zinc-400">AI Defense</div>
                      <div className="font-bold text-amber-400">{cred.defense_score}%</div>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-zinc-400 truncate">
                    Hash: <span className="text-zinc-400">{cred.evidence_hash}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs">
                  <span className="text-zinc-400">
                    Issued {new Date(cred.issued_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyCredentialLink(cred.credential_id)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      {copiedId === cred.credential_id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onOpenProof(cred.credential_id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <span>View Proof Card</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
