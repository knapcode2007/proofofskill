import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { DefenseSession, DefenseQuestion, DefenseEvaluation } from '../types';
import {
  ShieldAlert,
  Sparkles,
  HelpCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ArrowRight,
  Award,
  Cpu,
  BrainCircuit,
  Lock,
} from 'lucide-react';

interface DefensePageProps {
  assessmentId: string;
  onProceedToProof: (credentialId: string) => void;
  onBackToWorkspace: (assessmentId: string) => void;
}

export const DefensePage: React.FC<DefensePageProps> = ({
  assessmentId,
  onProceedToProof,
  onBackToWorkspace,
}) => {
  const [session, setSession] = useState<DefenseSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answerText, setAnswerText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGeneratingProof, setIsGeneratingProof] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDefenseSession();
  }, [assessmentId]);

  const loadDefenseSession = async () => {
    try {
      setLoading(true);
      const res = await api.startDefense(assessmentId);
      setSession(res.session);

      // Set active question to the first unanswered question
      const answeredKeys = Object.keys(res.session.answers || {});
      const firstUnanswered = res.session.questions.findIndex(
        (q) => !answeredKeys.includes(q.id)
      );
      if (firstUnanswered !== -1) {
        setCurrentQuestionIndex(firstUnanswered);
      } else {
        setCurrentQuestionIndex(0);
      }
    } catch (err: any) {
      console.error('[Defense] Error starting defense:', err);
      setError(err.message || 'Failed to start AI Code Defense session');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!session || !answerText.trim() || isSubmitting) return;

    const currentQuestion = session.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await api.submitDefenseAnswer(assessmentId, currentQuestion.id, answerText);
      setSession(res.session);
      setAnswerText('');

      // If next question exists, advance
      if (currentQuestionIndex < session.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (err: any) {
      console.error('[Defense] Error submitting answer:', err);
      setError(err.message || 'Failed evaluating defense response');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIssueCredential = async () => {
    setIsGeneratingProof(true);
    setError(null);
    try {
      const res = await api.generateProof(assessmentId);
      onProceedToProof(res.credential.credential_id);
    } catch (err: any) {
      console.error('[Defense] Proof generation error:', err);
      setError(err.message || 'Failed to generate cryptographic proof card');
      setIsGeneratingProof(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-sm font-mono text-zinc-400">
          AI Interrogating Candidate Code Constructs...
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Code Defense Unavailable</h2>
        <p className="text-xs text-zinc-400">{error}</p>
        <button
          onClick={() => onBackToWorkspace(assessmentId)}
          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200"
        >
          Return to Code Workspace
        </button>
      </div>
    );
  }

  const currentQ = session?.questions[currentQuestionIndex];
  const currentAnswerRecord = currentQ ? session?.answers[currentQ.id] : undefined;
  const isAllCompleted =
    session && session.questions.every((q) => Boolean(session.answers[q.id]));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-zinc-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Step 3 of 4 • AI Code Defense & Technical Reasoning</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
          Defend Your Implementation
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
          Passing unit tests is necessary but not sufficient. Defend your code architecture, edge-case mitigation, and algorithmic scaling decisions.
        </p>

        {/* Disclaimer Notice */}
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-zinc-300">Integrity Standard: </span>
            AI defense verifies technical reasoning and implementation understanding. Authorship is evaluated holistically alongside deterministic execution proofs.
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Question Selector Progress Pills */}
      <div className="grid grid-cols-3 gap-3">
        {session?.questions.map((q, idx) => {
          const isAnswered = Boolean(session.answers[q.id]);
          const isCurrent = idx === currentQuestionIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                isCurrent
                  ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                  : isAnswered
                  ? 'bg-zinc-900/80 border-emerald-500/40 text-zinc-300'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
              }`}
            >
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider">
                  Question {idx + 1}
                </div>
                <div className="text-xs font-semibold truncate max-w-[150px]">
                  {q.category.replace(/_/g, ' ')}
                </div>
              </div>
              {isAnswered && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Question & Defense Editor Card */}
      {currentQ && (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <span>Defense Prompt {currentQuestionIndex + 1} of {session.questions.length}</span>
              <span className="text-zinc-400 lowercase font-mono">category: {currentQ.category}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-100 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Context Code Reference if provided */}
          {currentQ.context_snippet && (
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1">
              <div className="text-[10px] text-zinc-400 uppercase flex items-center gap-1">
                <FileCode className="w-3 h-3 text-amber-400" />
                <span>Referenced Submission Snippet:</span>
              </div>
              <pre className="overflow-x-auto text-amber-200/90 whitespace-pre-wrap">
                {currentQ.context_snippet}
              </pre>
            </div>
          )}

          {/* If already answered, show the evaluated result */}
          {currentAnswerRecord ? (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-2">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Your Submitted Defense:</div>
                <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {currentAnswerRecord.answer}
                </p>
              </div>

              {currentAnswerRecord.evaluation && (
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-700/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>AI Rubric Evaluation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">Score:</span>
                      <span className="text-xl font-mono font-black text-emerald-400">
                        {currentAnswerRecord.evaluation.score}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {currentAnswerRecord.evaluation.feedback}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
                      <div className="font-semibold text-emerald-400 mb-1">Demonstrated Strengths</div>
                      <ul className="text-zinc-400 space-y-1">
                        {currentAnswerRecord.evaluation.strengths.map((s: string, i: number) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40">
                      <div className="font-semibold text-amber-400 mb-1">Refinement Opportunities</div>
                      <ul className="text-zinc-400 space-y-1">
                        {currentAnswerRecord.evaluation.weaknesses.map((w: string, i: number) => (
                          <li key={i}>• {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Answer Input Area */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">
                  Your Technical Defense & Reasoning
                </label>
                <textarea
                  rows={6}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Explain your algorithmic time/space trade-offs, how your code handles boundary conditions, or what alternative approaches you considered..."
                  className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-y font-sans"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-zinc-400">
                  Detailed technical answers with Big-O estimates receive higher rubric ratings.
                </span>
                <button
                  onClick={handleAnswerSubmit}
                  disabled={!answerText.trim() || isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <span>Evaluating with Rubric...</span>
                    </span>
                  ) : (
                    <>
                      <span>Submit Answer</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completion & Proof Generation Banner */}
      {isAllCompleted && (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border-2 border-emerald-500/50 space-y-5 shadow-2xl animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-zinc-100">
                Code Defense Completed!
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Average Defense Merit Score:{' '}
                <span className="text-emerald-400 font-bold font-mono">
                  {session?.average_score}%
                </span>
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            All visible and hidden tests passed, and code defense responses have been evaluated against our standardized scoring rubric. You are now authorized to generate a tamper-evident, Ed25519-signed digital Skill Passport.
          </p>

          <button
            onClick={handleIssueCredential}
            disabled={isGeneratingProof}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {isGeneratingProof ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>Computing SHA-256 Digest & Ed25519 Signing...</span>
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Generate Signed Cryptographic Proof Card</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
