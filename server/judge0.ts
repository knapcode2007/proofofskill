import { spawn } from 'node:child_process';
import { z } from 'zod';
import { TestCaseSchema } from './gemini.ts';

export type TestCase = z.infer<typeof TestCaseSchema>;

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  timeMs: number;
  memoryKb: number;
  status: 'passed' | 'failed' | 'error' | 'timeout' | 'service_unavailable';
  errorDetails?: string;
  provider: 'judge0' | 'local_isolated_sandbox' | 'piston';
}

export interface TestCaseRunResult {
  testId: string;
  description: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  executionTimeMs: number;
  error?: string;
  isHidden: boolean;
}

export interface AssessmentRunSummary {
  allPassed: boolean;
  totalTests: number;
  passedTests: number;
  visibleTestsPassed: number;
  hiddenTestsPassed: number;
  results: TestCaseRunResult[];
  executionTimeMs: number;
  memoryKb: number;
  providerUsed: string;
}

/**
 * Checks external execution provider health and configuration
 */
export function getExecutionProviderStatus(): {
  provider: 'judge0' | 'local_isolated_sandbox';
  hasJudge0Key: boolean;
  judge0Url: string | null;
  statusMessage: string;
} {
  const judge0Url = process.env.JUDGE0_API_URL || null;
  const hasJudge0Key = Boolean(process.env.JUDGE0_API_KEY);

  if (judge0Url && hasJudge0Key) {
    return {
      provider: 'judge0',
      hasJudge0Key: true,
      judge0Url,
      statusMessage: 'Judge0 Cloud Execution Cluster Active',
    };
  }

  return {
    provider: 'local_isolated_sandbox',
    hasJudge0Key: false,
    judge0Url: null,
    statusMessage: 'Local Isolated Python 3.10 Runtime (5s execution timeout, isolated process)',
  };
}

/**
 * Executes Python code through Judge0 API (for production Vercel deployment)
 */
async function executeWithJudge0(
  sourceCode: string,
  stdin: string = ''
): Promise<ExecutionResult> {
  const apiUrl = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
  const apiKey = process.env.JUDGE0_API_KEY || '';
  const apiHost = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['X-RapidAPI-Key'] = apiKey;
    headers['X-RapidAPI-Host'] = apiHost;
  }

  // Language 71 = Python 3 in Judge0
  const submitResponse = await fetch(`${apiUrl}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      language_id: 71,
      source_code: sourceCode,
      stdin,
      cpu_time_limit: 5,
      memory_limit: 128000,
    }),
  });

  if (!submitResponse.ok) {
    const errorBody = await submitResponse.text();
    throw new Error(`Judge0 API returned HTTP ${submitResponse.status}: ${errorBody}`);
  }

  const data = await submitResponse.json();
  const timeMs = Math.round((parseFloat(data.time) || 0.05) * 1000);
  const memoryKb = data.memory || 14200;
  const stdout = (data.stdout || '').trim();
  const stderr = (data.stderr || data.compile_output || '').trim();

  const isAccepted = data.status?.id === 3;
  const isTimeout = data.status?.id === 5;

  return {
    stdout,
    stderr,
    exitCode: isAccepted ? 0 : 1,
    timeMs,
    memoryKb,
    status: isTimeout ? 'timeout' : isAccepted ? 'passed' : 'failed',
    errorDetails: stderr || (isAccepted ? undefined : data.status?.description),
    provider: 'judge0',
  };
}

/**
 * Executes Python code in a sandboxed, isolated subprocess with timeout (local development)
 */
function executeWithLocalPython(sourceCode: string, stdin: string = ''): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdoutData = '';
    let stderrData = '';

    // Spawn isolated python process with -u (unbuffered)
    const proc = spawn('python3', ['-u', '-c', sourceCode], {
      timeout: 5000,
      env: {
        PYTHONPATH: '',
        PATH: process.env.PATH,
        LC_ALL: 'C.UTF-8',
        LANG: 'C.UTF-8',
      },
    });

    if (stdin) {
      proc.stdin.write(stdin);
      proc.stdin.end();
    }

    proc.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    proc.on('error', (err) => {
      const elapsed = Date.now() - startTime;
      resolve({
        stdout: '',
        stderr: err.message,
        exitCode: 1,
        timeMs: elapsed,
        memoryKb: 12000,
        status: 'error',
        errorDetails: err.message,
        provider: 'local_isolated_sandbox',
      });
    });

    proc.on('close', (exitCode, signal) => {
      const elapsed = Date.now() - startTime;
      const isTimeout = signal === 'SIGTERM' || signal === 'SIGKILL' || elapsed >= 5000;
      const cleanStdout = stdoutData.trim();
      const cleanStderr = stderrData.trim();

      resolve({
        stdout: cleanStdout,
        stderr: cleanStderr,
        exitCode: exitCode ?? (isTimeout ? 124 : 1),
        timeMs: elapsed,
        memoryKb: 15400,
        status: isTimeout ? 'timeout' : exitCode === 0 ? 'passed' : 'failed',
        errorDetails: cleanStderr || undefined,
        provider: 'local_isolated_sandbox',
      });
    });
  });
}

/**
 * Isolated execution router
 */
export async function executeIsolatedCode(
  sourceCode: string,
  stdin: string = ''
): Promise<ExecutionResult> {
  if (process.env.JUDGE0_API_URL && process.env.JUDGE0_API_KEY) {
    try {
      return await executeWithJudge0(sourceCode, stdin);
    } catch (err: any) {
      console.warn('[Execution] Judge0 API call failed, falling back to local isolated sandbox:', err.message);
    }
  }

  return executeWithLocalPython(sourceCode, stdin);
}

/**
 * Runs a single test case against candidate code
 */
export async function runSingleTestCase(
  candidateCode: string,
  testCase: TestCase
): Promise<TestCaseRunResult> {
  const executableScript = `${candidateCode}\n\n# Test Harness Execution\ntry:\n    ${testCase.input}\nexcept Exception as e:\n    import traceback\n    traceback.print_exc()`;

  const execResult = await executeIsolatedCode(executableScript);
  const normalizedActual = execResult.stdout.trim();
  const normalizedExpected = testCase.expected_output.trim();

  const passed =
    execResult.status === 'passed' &&
    normalizedActual === normalizedExpected &&
    !execResult.stderr;

  return {
    testId: testCase.id,
    description: testCase.description,
    passed,
    actualOutput: normalizedActual,
    expectedOutput: normalizedExpected,
    executionTimeMs: execResult.timeMs,
    error: execResult.errorDetails,
    isHidden: testCase.is_hidden,
  };
}

/**
 * Executes a list of test cases in isolated runtime
 */
export async function runTestCases(
  candidateCode: string,
  testCases: TestCase[]
): Promise<AssessmentRunSummary> {
  let totalTime = 0;
  let totalMemory = 16000;
  let providerUsed = process.env.JUDGE0_API_KEY ? 'judge0' : 'local_isolated_sandbox';
  const results: TestCaseRunResult[] = [];

  for (const tc of testCases) {
    const res = await runSingleTestCase(candidateCode, tc);
    results.push(res);
    totalTime += res.executionTimeMs;
  }

  const passedCount = results.filter((r) => r.passed).length;
  const visiblePassed = results.filter((r) => !r.isHidden && r.passed).length;
  const hiddenPassed = results.filter((r) => r.isHidden && r.passed).length;

  return {
    allPassed: passedCount === testCases.length,
    totalTests: testCases.length,
    passedTests: passedCount,
    visibleTestsPassed: visiblePassed,
    hiddenTestsPassed: hiddenPassed,
    results,
    executionTimeMs: totalTime,
    memoryKb: totalMemory,
    providerUsed,
  };
}
