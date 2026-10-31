import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { DefenseSession } from '../types';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ArrowRight,
  BrainCircuit,
  Lock,
} from 'lucide-react';
import { PixelCrest } from '../components/PixelVisuals';
import { PixelPageLoader, PixelSpinner } from '../components/PixelLoader';

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
      console.error('[Defense] Error:', err);
      setError(err.message || 'Failed to start AI Defense');
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

      if (currentQuestionIndex < session.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (err: any) {
      console.error('[Defense] Answer submit error:', err);
      setError(err.message || 'Evaluation error');
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
      setError(err.message || 'Failed generating proof');
      setIsGeneratingProof(false);
    }
  };

  if (loading) {
    return (
      <PixelPageLoader
        label="INTERROGATING CODE SYNTAX..."
        sublabel="INITIALIZING GEMINI AI DEFENSE MATRIX"
        variant="fullscreen"
        color="amber"
      />
    );
  }

  if (isGeneratingProof) {
    return (
      <PixelPageLoader
        label="MINTING CRYPTOGRAPHIC PROOF..."
        sublabel="SIGNING EVIDENCE LEDGER WITH ED25519 PRIVATE KEY"
        variant="fullscreen"
        color="emerald"
      />
    );
  }

  const currentQ = session?.questions[currentQuestionIndex];
  const currentAnswerRecord = currentQ ? session?.answers[currentQ.id] : undefined;
  const isAllCompleted =
    session && session.questions.every((q) => Boolean(session.answers[q.id]));

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24 space-y-16">
      {/* Header */}
      <div className="space-y-3 border-b border-zinc-800 pb-8">
        <div className="font-pixel text-[11px] text-amber-400 uppercase tracking-widest">
          STEP 03 • AI CODE DEFENSE
        </div>
        <h1 className="font-pixel text-2xl sm:text-4xl lg:text-5xl text-zinc-100 tracking-tight">
          DEFEND YOUR CODE
        </h1>
      </div>

      {error && (
        <div className="p-5 border border-red-800 bg-red-950/40 text-red-200 font-mono text-xs">
          ERROR: {error}
        </div>
      )}

      {/* Question Selector Tabs */}
      <div className="grid grid-cols-3 gap-4 font-pixel text-xs">
        {session?.questions.map((q, idx) => {
          const isAnswered = Boolean(session.answers[q.id]);
          const isCurrent = idx === currentQuestionIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`p-4 border text-left transition flex items-center justify-between cursor-reactive-target pixel-card-subtle ${
                isCurrent
                  ? 'ring-2 ring-amber-400 text-amber-400'
                  : isAnswered
                  ? 'border-emerald-500/50 text-zinc-300'
                  : 'border-zinc-800 text-zinc-500'
              }`}
            >
              <div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-500">
                  PROMPT 0{idx + 1}
                </div>
                <div className="text-[11px] truncate uppercase mt-0.5">
                  {q.category.replace(/_/g, ' ')}
                </div>
              </div>
              {isAnswered && <span className="text-emerald-400 font-pixel">OK</span>}
            </button>
          );
        })}
      </div>

      {/* Main Defense Question Card */}
      {currentQ && (
        <div className="p-8 sm:p-12 pixel-card space-y-8">
          <div className="space-y-2 font-mono">
            <span className="font-pixel text-[10px] text-amber-400 uppercase tracking-widest">
              QUESTION {currentQuestionIndex + 1} / {session.questions.length}
            </span>
            <h3 className="font-pixel text-base sm:text-lg text-zinc-100 uppercase leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Code Reference */}
          {currentQ.context_snippet && (
            <div className="p-4 border border-zinc-800 bg-black font-mono text-xs text-zinc-300 space-y-1.5">
              <span className="text-[10px] text-zinc-500 uppercase block font-pixel">
                REFERENCED SNIPPET:
              </span>
              <pre className="text-amber-300/80 overflow-x-auto whitespace-pre-wrap">
                {currentQ.context_snippet}
              </pre>
            </div>
          )}

          {/* Answered State or Editor */}
          {currentAnswerRecord ? (
            <div className="space-y-6 pt-2">
              <div className="p-5 border border-zinc-800 bg-black/60 font-mono text-xs space-y-2">
                <span className="text-zinc-500 uppercase text-[10px] font-pixel block">
                  CANDIDATE RESPONSE:
                </span>
                <p className="text-zinc-200 whitespace-pre-wrap">{currentAnswerRecord.answer}</p>
              </div>

              {currentAnswerRecord.evaluation && (
                <div className="p-6 border border-zinc-800 bg-zinc-950 font-mono text-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-xs text-zinc-300">RUBRIC SCORE</span>
                    <span className="font-pixel text-xl text-emerald-400">
                      {currentAnswerRecord.evaluation.score}%
                    </span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">{currentAnswerRecord.evaluation.feedback}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5 font-mono text-xs">
              <textarea
                rows={6}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Explain your Big-O scaling, memory boundaries, and trade-offs..."
                className="w-full p-5 border border-zinc-700 bg-black text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition resize-y font-mono text-xs"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleAnswerSubmit}
                  disabled={!answerText.trim() || isSubmitting}
                  className="px-8 py-3.5 pixel-btn-primary text-xs tracking-wider cursor-reactive-target flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <PixelSpinner size="sm" color="zinc" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{isSubmitting ? 'EVALUATING...' : 'SUBMIT DEFENSE'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completion Banner */}
      {isAllCompleted && (
        <div className="p-10 sm:p-14 pixel-card space-y-8 text-center">
          <PixelCrest size={56} className="mx-auto" />
          <div className="space-y-2">
            <h3 className="font-pixel text-xl sm:text-2xl text-zinc-100">
              DEFENSE EVALUATION COMPLETED
            </h3>
            <div className="font-pixel text-emerald-400 text-lg">
              MERIT RATING: {session?.average_score}%
            </div>
          </div>

          <button
            onClick={handleIssueCredential}
            disabled={isGeneratingProof}
            className="w-full sm:w-auto px-10 py-4 pixel-btn-primary text-xs tracking-wider cursor-reactive-target flex items-center justify-center gap-2.5 mx-auto"
          >
            <Lock className="w-4 h-4" />
            <span>{isGeneratingProof ? 'SIGNING Ed25519...' : 'MINT Ed25519 PROOF CARD'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
