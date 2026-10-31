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
  Code2,
  Check,
  ChevronRight,
  Terminal,
  FileCode,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

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
    if (confirm('Reset code back to original starter template? Any unsaved edits will be lost.')) {
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
      setError(err.message || 'Code execution failed');
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
        setError('Submission did not pass all required tests. Review results and refine your solution.');
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-sm font-mono text-zinc-400">Loading Isolated Coding Environment...</div>
      </div>
    );
  }

  if (error && !challenge) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Workspace Unavailable</h2>
        <p className="text-xs text-zinc-400">{error}</p>
        <button
          onClick={loadWorkspace}
          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Top Workspace Header */}
      <div className="h-14 border-b border-zinc-800 bg-zinc-900/90 px-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 truncate">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase shrink-0">
            {challenge?.difficulty}
          </span>
          <h2 className="font-bold text-sm text-zinc-200 truncate">
            {challenge?.title || 'Coding Challenge'}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSaveDraft}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition"
            title="Save draft code"
          >
            {savedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedDraft ? 'Draft Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleResetCode}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs transition"
            title="Reset code template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Run Code */}
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-semibold text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? (
              <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            )}
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          {/* Submit Solution */}
          <button
            onClick={handleSubmitSolution}
            disabled={isSubmitting || isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 transition disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isSubmitting ? 'Evaluating...' : 'Submit Solution'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Problem / Right Editor */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left Pane: Challenge Briefing */}
        <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col min-h-0 bg-zinc-900/40">
          {/* Tabs */}
          <div className="flex items-center border-b border-zinc-800 px-3 bg-zinc-950/60 text-xs font-semibold text-zinc-400 shrink-0">
            <button
              onClick={() => setActiveTab('problem')}
              className={`py-2.5 px-3 border-b-2 transition ${
                activeTab === 'problem'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent hover:text-zinc-200'
              }`}
            >
              Problem Statement
            </button>
            <button
              onClick={() => setActiveTab('visible_tests')}
              className={`py-2.5 px-3 border-b-2 transition ${
                activeTab === 'visible_tests'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent hover:text-zinc-200'
              }`}
            >
              Visible Tests ({challenge?.visible_tests.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'console'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent hover:text-zinc-200'
              }`}
            >
              <span>Console & Results</span>
              {runSummary && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    runSummary.allPassed ? 'bg-emerald-400' : 'bg-red-400'
                  }`}
                />
              )}
            </button>
          </div>

          {/* Left Content Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-6 text-sm">
            {activeTab === 'problem' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">{challenge?.title}</h3>
                  <div className="mt-3 text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                    {challenge?.problem_statement}
                  </div>
                </div>

                {/* Requirements */}
                {challenge?.requirements && challenge.requirements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Requirements & Constraints
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {challenge.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Complexity Expectations */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                    <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                      Target Time Complexity
                    </div>
                    <div className="font-mono text-zinc-200 font-bold mt-1">
                      {challenge?.expected_time_complexity || 'O(1) / O(N)'}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                    <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                      Target Space Complexity
                    </div>
                    <div className="font-mono text-zinc-200 font-bold mt-1">
                      {challenge?.expected_space_complexity || 'O(N)'}
                    </div>
                  </div>
                </div>

                {/* Hidden Tests Notice */}
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-300">Server-Side Hidden Tests: </span>
                    In addition to visible tests, this submission will be verified against confidential edge-case test suites on the server.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visible_tests' && (
              <div className="space-y-4">
                <div className="text-xs text-zinc-400">
                  Visible test cases executed during ordinary "Run Code" commands.
                </div>
                {challenge?.visible_tests.map((test, idx) => (
                  <div
                    key={test.id}
                    className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="font-bold text-amber-400">Case {idx + 1}</span>
                      <span>{test.description}</span>
                    </div>
                    <div className="text-zinc-300 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 overflow-x-auto">
                      <div className="text-[10px] text-zinc-400 mb-0.5 uppercase">Test Input / Code:</div>
                      {test.input}
                    </div>
                    <div className="text-emerald-400 bg-zinc-950 p-2 rounded-lg border border-zinc-800/80 overflow-x-auto">
                      <div className="text-[10px] text-zinc-400 mb-0.5 uppercase">Expected Output:</div>
                      {test.expected_output}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'console' && (
              <div className="space-y-4 font-mono text-xs">
                {!runSummary && !isRunning && (
                  <div className="text-center py-10 text-zinc-400">
                    <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <div>Click "Run Code" or "Submit Solution" to inspect execution results.</div>
                  </div>
                )}

                {isRunning && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                    <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>Executing code in external sandboxed runtime...</span>
                  </div>
                )}

                {runSummary && (
                  <div className="space-y-4">
                    {/* Execution Summary Header */}
                    <div
                      className={`p-4 rounded-xl border flex items-center justify-between ${
                        runSummary.allPassed
                          ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                          : 'bg-red-950/30 border-red-800/60 text-red-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {runSummary.allPassed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className="font-bold text-sm">
                          {runSummary.allPassed
                            ? 'All Test Cases Passed!'
                            : `${runSummary.passedTests}/${runSummary.totalTests} Tests Passed`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {runSummary.executionTimeMs}ms
                        </span>
                        <span className="flex items-center gap-1">
                          <Cpu className="w-3.5 h-3.5" /> ~{Math.round(runSummary.memoryKb / 1024)}MB
                        </span>
                      </div>
                    </div>

                    {/* Test Results Breakdown */}
                    <div className="space-y-2">
                      {runSummary.results.map((res, i) => (
                        <div
                          key={res.testId || i}
                          className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-zinc-200">
                              {res.isHidden ? `Hidden Test ${i + 1}` : `Visible Test ${i + 1}`}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                res.passed
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : 'bg-red-500/10 text-red-400'
                              }`}
                            >
                              {res.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>

                          {!res.isHidden && (
                            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                              <div className="p-1.5 rounded bg-zinc-950">
                                <span className="text-zinc-400 text-[10px] block">Actual Output:</span>
                                <span className="text-zinc-200 truncate block">{res.actualOutput || '(empty)'}</span>
                              </div>
                              <div className="p-1.5 rounded bg-zinc-950">
                                <span className="text-zinc-400 text-[10px] block">Expected:</span>
                                <span className="text-emerald-400 truncate block">{res.expectedOutput}</span>
                              </div>
                            </div>
                          )}

                          {res.error && (
                            <div className="p-2 rounded bg-red-950/50 text-red-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                              {res.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Next step prompt if submission succeeded */}
                    {submitSuccess && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 space-y-3">
                        <div className="font-bold text-sm flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Code Submission Validated!</span>
                        </div>
                        <p className="text-xs text-zinc-300">
                          Your code has passed all visible and hidden test criteria. Proceed to the AI Code Defense session to defend your implementation decisions.
                        </p>
                        <button
                          onClick={() => onProceedToDefense(assessmentId)}
                          className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <span>Proceed to AI Code Defense</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Monaco Editor */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
          <div className="h-8 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>solution.py</span>
            </div>
            <div>Python 3 • Isolated Sandbox</div>
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
                fontSize: 14,
                fontFamily: "'Fira Code', monospace",
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
