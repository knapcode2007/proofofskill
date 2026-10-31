export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'candidate' | 'recruiter' | 'admin';
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  supported_language: string;
  is_active: boolean;
}

export interface TestCase {
  id: string;
  description: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
}

export interface Challenge {
  id: string;
  assessment_id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  problem_statement: string;
  requirements: string[];
  starter_code: string;
  visible_tests: TestCase[];
  evaluation_rubric: {
    correctness_weight: number;
    complexity_weight: number;
    code_quality_weight: number;
    edge_cases_weight: number;
  };
  expected_time_complexity: string;
  expected_space_complexity: string;
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

export interface Assessment {
  id: string;
  candidate_id: string;
  skill_id: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  status:
    | 'initialized'
    | 'challenge_generated'
    | 'submitted'
    | 'defense_in_progress'
    | 'evaluated'
    | 'credential_issued'
    | 'failed';
  challenge_id?: string;
  draft_code?: string;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

export interface DefenseQuestion {
  id: string;
  question: string;
  category: string;
  context_snippet?: string;
  rubric: string;
}

export interface DefenseEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  reasoning_depth: 'shallow' | 'adequate' | 'deep' | 'exceptional';
}

export interface DefenseSession {
  id: string;
  assessment_id: string;
  candidate_id: string;
  questions: DefenseQuestion[];
  answers: Record<string, { answer: string; evaluation?: DefenseEvaluation; answered_at: string }>;
  status: 'pending' | 'completed';
  average_score?: number;
  created_at: string;
}

export interface CompetencyBreakdown {
  logical_thinking: number;
  debugging: number;
  problem_solving: number;
  code_quality: number;
  edge_case_handling: number;
  technical_understanding: number;
  overall_score: number;
  summary: string;
}

export interface CredentialRecord {
  id: string;
  credential_id: string;
  candidate_id: string;
  candidate_name: string;
  assessment_id: string;
  skill_name: string;
  difficulty: string;
  evidence_hash: string;
  signature: string;
  public_key_version: string;
  verification_status: 'VALID' | 'REVOKED' | 'INVALID_SIGNATURE' | 'TAMPERED';
  canonical_evidence?: any;
  competencies: CompetencyBreakdown;
  test_summary: {
    total_tests: number;
    passed_tests: number;
    visible_tests_passed: number;
    hidden_tests_passed: number;
    execution_time_ms: number;
  };
  defense_score: number;
  overall_score: number;
  issued_at: string;
  revoked_at?: string;
  revocation_reason?: string;
}

export interface VerificationResponse {
  status: 'VALID' | 'REVOKED' | 'INVALID_SIGNATURE' | 'TAMPERED' | 'NOT_FOUND';
  verified: boolean;
  message: string;
  verification_timestamp?: string;
  computed_hash?: string;
  recorded_hash?: string;
  credential?: {
    credential_id: string;
    candidate_name: string;
    skill_name: string;
    difficulty: string;
    overall_score: number;
    defense_score: number;
    test_summary: {
      total_tests: number;
      passed_tests: number;
    };
    competencies: CompetencyBreakdown;
    issued_at: string;
    issuer: string;
    evidence_hash: string;
    signature: string;
    public_key_version: string;
  };
  revocation_reason?: string;
  revoked_at?: string;
}

export interface IntegrationHealth {
  gemini_ai: {
    status: string;
    model: string;
    configured: boolean;
    description: string;
  };
  code_execution: {
    provider: string;
    hasJudge0Key: boolean;
    judge0Url: string | null;
    statusMessage: string;
  };
  cryptography: {
    algorithm: string;
    hashing: string;
    public_key_version: string;
    status: string;
  };
  database: {
    status: string;
    supabase_configured: boolean;
  };
}
