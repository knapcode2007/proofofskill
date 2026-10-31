import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { api } from '../lib/api';
import { Challenge, Assessment, AssessmentRunSummary } from '../types';
import {
  Play,
  Send,
  RotateCcw,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  AlertTriangle,
  Check,
  ChevronRight,
  Terminal,
  FileCode,
  ArrowRight,
} from 'lucide-react';
import { PixelPageLoader, PixelSpinner, PixelLoadingBar } from '../components/PixelLoader';

interface WorkspacePageProps {
  assessmentId: string;
  onProceedToResults: (assessmentId: string) => void;
  onProceedToDefense: (assessmentId: string) => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  assessmentId,
  onProceedToResults,
  onProceedToDefense,
}) => {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Execution states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [runSummary, setRunSummary] = useState<AssessmentRunSummary | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [savedDraft, setSavedDraft] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'problem' | 'visible_tests' | 'console'>('problem');

  useEffect(() => {
    loadWorkspace();
  }, [assessmentId]);

  const loadWorkspace = async () => {
    try {
      setLoading(true);
      const asmRes = await api.getAssessment(assessmentId);
      setAssessment(asmRes.assessment);

      let chalRes: { challenge: Challenge };
      try {
        chalRes = await api.getChallenge(assessmentId);
      } catch {
        chalRes = await api.generateChallenge(assessmentId);
      }
      setChallenge(chalRes.challenge);
      setCode(asmRes.assessment.draft_code || chalRes.challenge.starter_code);
    } catch (err: any) {
      console.error('[Workspace] Load error:', err);
      setError(err.message || 'Failed loading challenge workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await api.updateDraft(assessmentId, code);
      setSavedDraft(true);
      setTimeout(() => setSavedDraft(false), 2000);
    } catch (err: any) {
      console.error('[Workspace] Draft save failed:', err);
    }
  };

  const handleResetCode = () => {
    if (!challenge) return;
    if (confirm('Reset code to starter template?')) {
      setCode(challenge.starter_code);
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setActiveTab('console');
    setError(null);
    try {
      const res = await api.runCode(assessmentId, code);
      setRunSummary(res.runSummary);
    } catch (err: any) {
      setError(err.message || 'Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!code.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await api.submitCode(assessmentId, code);
      setRunSummary(res.test_summary);
      setActiveTab('console');

      if (res.all_passed) {
        setSubmitSuccess(true);
      } else {
        setError('Submission failed some tests. Review console.');
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PixelPageLoader
        label="LOADING SANDBOX ENVIRONMENT..."
        sublabel="MOUNTING ISOLATED PYTHON RUNNER // MEMORY: 256MB"
        variant="fullscreen"
      />
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#05070a] text-zinc-100 overflow-hidden">
      {/* Top Bar with pixel buttons and title */}
      <div className="h-16 border-b border-zinc-800 bg-[#070a0f] px-6 flex items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-4 truncate">
          <span className="font-pixel text-[10px] px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 uppercase">
            {challenge?.difficulty}
          </span>
          <h2 className="font-pixel text-xs sm:text-sm text-zinc-200 truncate uppercase">
            {challenge?.title}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSaveDraft}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 pixel-btn-secondary text-[10px] cursor-reactive-target"
          >
            {savedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedDraft ? 'SAVED' : 'SAVE'}</span>
          </button>

          <button
            onClick={handleResetCode}
            className="p-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-zinc-200 text-xs transition cursor-reactive-target"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Run Code */}
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 pixel-btn-secondary text-xs cursor-reactive-target"
          >
            {isRunning ? (
              <PixelSpinner size="sm" color="emerald" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            )}
            <span>{isRunning ? 'RUNNING...' : 'RUN'}</span>
          </button>

          {/* Submit Solution */}
          <button
            onClick={handleSubmitSolution}
            disabled={isSubmitting || isRunning}
            className="flex items-center gap-2 px-6 py-2.5 pixel-btn-primary text-xs cursor-reactive-target"
          >
            {isSubmitting ? (
              <PixelSpinner size="sm" color="zinc" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isSubmitting ? 'EVALUATING...' : 'SUBMIT'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left Pane */}
        <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col min-h-0 bg-[#070a0f]">
          {/* Tabs */}
          <div className="flex items-center border-b border-zinc-800 px-4 bg-black/60 font-pixel text-[11px] text-zinc-400 shrink-0">
            <button
              onClick={() => setActiveTab('problem')}
              className={`py-3 px-4 border-b-2 transition ${
                activeTab === 'problem'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent hover:text-zinc-200'
              }`}
            >
              PROBLEM
            </button>
            <button
              onClick={() => setActiveTab('visible_tests')}
              className={`py-3 px-4 border-b-2 transition ${
                activeTab === 'visible_tests'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent hover:text-zinc-200'
              }`}
            >
              TESTS ({challenge?.visible_tests.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
                activeTab === 'console'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent hover:text-zinc-200'
              }`}
            >
              <span>CONSOLE</span>
              {runSummary && (
                <span
                  className={`w-1.5 h-1.5 ${
                    runSummary.allPassed ? 'bg-emerald-400' : 'bg-red-400'
                  }`}
                />
              )}
            </button>
          </div>

          {/* Left Content Area */}
          <div className="flex-1 p-8 overflow-y-auto space-y-6 text-xs font-mono">
            {activeTab === 'problem' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-pixel text-sm sm:text-base text-zinc-100 uppercase">{challenge?.title}</h3>
                  <div className="mt-3 text-zinc-300 leading-relaxed whitespace-pre-line text-xs">
                    {challenge?.problem_statement}
                  </div>
                </div>

                {challenge?.requirements && challenge.requirements.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="font-pixel text-[10px] text-amber-400 uppercase tracking-widest block">
                      REQUIREMENTS:
                    </span>
                    <ul className="space-y-2 text-zinc-300">
                      {challenge.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-amber-500 font-pixel">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 border border-zinc-800 bg-zinc-950">
                    <div className="text-[10px] text-zinc-500 uppercase font-mono">TARGET TIME</div>
                    <div className="font-pixel text-xs text-zinc-200 mt-1">
                      {challenge?.expected_time_complexity || 'O(1) / O(N)'}
                    </div>
                  </div>
                  <div className="p-4 border border-zinc-800 bg-zinc-950">
                    <div className="text-[10px] text-zinc-500 uppercase font-mono">TARGET SPACE</div>
                    <div className="font-pixel text-xs text-zinc-200 mt-1">
                      {challenge?.expected_space_complexity || 'O(N)'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visible_tests' && (
              <div className="space-y-4">
                {challenge?.visible_tests.map((test, idx) => (
                  <div key={test.id} className="p-5 border border-zinc-800 bg-zinc-950 space-y-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 font-pixel">
                      <span className="text-amber-400">CASE {idx + 1}</span>
                      <span>{test.description}</span>
                    </div>
                    <div className="text-zinc-300 bg-black p-3 border border-zinc-900 overflow-x-auto">
                      <span className="text-zinc-600 block text-[10px]">INPUT:</span>
                      {test.input}
                    </div>
                    <div className="text-emerald-400 bg-black p-3 border border-zinc-900 overflow-x-auto">
                      <span className="text-zinc-600 block text-[10px]">EXPECTED:</span>
                      {test.expected_output}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'console' && (
              <div className="space-y-5 font-mono text-xs">
                {!runSummary && !isRunning && (
                  <div className="text-center py-16 text-zinc-500">
                    <Terminal className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    <div className="font-pixel text-[10px]">AWAITING EXECUTION COMMAND</div>
                  </div>
                )}

                {isRunning && (
                  <div className="p-6 pixel-card flex flex-col items-center justify-center gap-4 text-center">
                    <PixelSpinner size="md" color="amber" />
                    <div className="space-y-1">
                      <div className="font-pixel text-[11px] text-amber-400">EXECUTING IN ISOLATED SANDBOX...</div>
                      <div className="font-mono text-[10px] text-zinc-400">RUNNING DETERMINISTIC TEST MATRIX</div>
                    </div>
                    <PixelLoadingBar
                      color="amber"
                      segmentsCount={10}
                      label="SANDBOX EXECUTION"
                      showPercentage={false}
                    />
                  </div>
                )}

                {runSummary && (
                  <div className="space-y-5">
                    <div
                      className={`p-5 border flex items-center justify-between ${
                        runSummary.allPassed
                          ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                          : 'border-red-500/50 bg-red-950/20 text-red-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 font-pixel text-xs">
                        {runSummary.allPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                        <span>
                          {runSummary.allPassed ? 'ALL TESTS PASSED' : `${runSummary.passedTests}/${runSummary.totalTests} PASSED`}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400">
                        {runSummary.executionTimeMs}MS • ~{Math.round(runSummary.memoryKb / 1024)}MB
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {runSummary.results.map((res, i) => (
                        <div key={res.testId || i} className="p-4 border border-zinc-800 bg-zinc-950 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-pixel">
                            <span className="text-zinc-300">{res.isHidden ? `HIDDEN ${i + 1}` : `VISIBLE ${i + 1}`}</span>
                            <span className={res.passed ? 'text-emerald-400' : 'text-red-400'}>
                              {res.passed ? 'PASS' : 'FAIL'}
                            </span>
                          </div>
                          {!res.isHidden && (
                            <div className="text-[10px] text-zinc-400 pt-0.5">
                              OUT: {res.actualOutput}
                            </div>
                          )}
                          {res.error && (
                            <div className="text-red-400 text-[10px] overflow-x-auto pt-1">
                              {res.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {submitSuccess && (
                      <button
                        onClick={() => onProceedToDefense(assessmentId)}
                        className="w-full py-4 pixel-btn-primary text-xs tracking-wider flex items-center justify-center gap-2 cursor-reactive-target"
                      >
                        <span>PROCEED TO CODE DEFENSE</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Monaco Editor */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#0d1117]">
          <div className="h-9 bg-zinc-950 border-b border-zinc-800 px-5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>solution.py</span>
            <span>PYTHON 3</span>
          </div>

          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
