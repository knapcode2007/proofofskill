import {
  Profile,
  Skill,
  Assessment,
  Challenge,
  AssessmentRunSummary,
  DefenseSession,
  CompetencyBreakdown,
  CredentialRecord,
  VerificationResponse,
  IntegrationHealth,
} from '../types';

const API_BASE = '/api';

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('pos_token') || '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || errorData.message || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  getMe: () => fetchJson<{ user: Profile }>('/api/auth/me'),
  login: (email: string) =>
    fetchJson<{ user: Profile; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  register: (data: { email: string; full_name: string; role: 'candidate' | 'recruiter'; bio?: string }) =>
    fetchJson<{ user: Profile }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  switchRole: (role: 'candidate' | 'recruiter') =>
    fetchJson<{ user: Profile }>('/api/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),
  logout: () => fetchJson<{ message: string }>('/api/auth/logout', { method: 'POST' }),

  // Profile
  getProfile: () => fetchJson<{ profile: Profile }>('/api/profile'),
  updateProfile: (data: Partial<Profile>) =>
    fetchJson<{ profile: Profile }>('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Skills
  getSkills: () => fetchJson<{ skills: Skill[] }>('/api/skills'),

  // Assessments
  createAssessment: (skill_id: string, difficulty: string, language: string = 'python') =>
    fetchJson<{ assessment: Assessment }>('/api/assessments', {
      method: 'POST',
      body: JSON.stringify({ skill_id, difficulty, language }),
    }),
  getAssessments: () => fetchJson<{ assessments: Assessment[] }>('/api/assessments'),
  getAssessment: (id: string) =>
    fetchJson<{ assessment: Assessment; has_challenge: boolean }>(`/api/assessments/${id}`),
  updateDraft: (id: string, draft_code: string) =>
    fetchJson<{ assessment: Assessment }>(`/api/assessments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ draft_code }),
    }),

  // Challenges
  generateChallenge: (id: string) =>
    fetchJson<{ challenge: Challenge }>(`/api/assessments/${id}/generate-challenge`, {
      method: 'POST',
    }),
  getChallenge: (id: string) =>
    fetchJson<{ challenge: Challenge }>(`/api/assessments/${id}/challenge`),

  // Execution
  runCode: (id: string, source_code: string) =>
    fetchJson<{ runSummary: AssessmentRunSummary }>(`/api/assessments/${id}/run`, {
      method: 'POST',
      body: JSON.stringify({ source_code }),
    }),
  submitCode: (id: string, source_code: string) =>
    fetchJson<{
      submission_id: string;
      status: string;
      all_passed: boolean;
      test_summary: AssessmentRunSummary;
    }>(`/api/assessments/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ source_code }),
    }),

  // Defense
  startDefense: (id: string) =>
    fetchJson<{ session: DefenseSession }>(`/api/assessments/${id}/defense/start`, {
      method: 'POST',
    }),
  getDefense: (id: string) =>
    fetchJson<{ session: DefenseSession }>(`/api/assessments/${id}/defense`),
  submitDefenseAnswer: (id: string, question_id: string, answer: string) =>
    fetchJson<{
      session: DefenseSession;
      evaluation: any;
      all_completed: boolean;
    }>(`/api/assessments/${id}/defense/answer`, {
      method: 'POST',
      body: JSON.stringify({ question_id, answer }),
    }),

  // Competency & Proof
  evaluateAssessment: (id: string) =>
    fetchJson<{ competencies: CompetencyBreakdown }>(`/api/assessments/${id}/evaluate`, {
      method: 'POST',
    }),
  generateProof: (id: string) =>
    fetchJson<{ credential: CredentialRecord }>(`/api/assessments/${id}/generate-proof`, {
      method: 'POST',
    }),
  getCredential: (id: string) =>
    fetchJson<{ credential: CredentialRecord }>(`/api/credentials/${id}`),
  verifyCredential: (credentialId: string) =>
    fetchJson<VerificationResponse>(`/api/verify/${credentialId}`),
  revokeCredential: (id: string, reason: string) =>
    fetchJson<{ credential: CredentialRecord; status: string }>(`/api/credentials/${id}/revoke`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Recruiter
  getRecruiterCredentials: () =>
    fetchJson<{ credentials: CredentialRecord[] }>('/api/recruiter/credentials'),
  recruiterSearch: (query: string) =>
    fetchJson<{ results: CredentialRecord[] }>('/api/recruiter/verify', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),

  // Health
  getIntegrationsHealth: () => fetchJson<IntegrationHealth>('/api/health/integrations'),
  getPublicKey: () => fetchJson<{ publicKey: string; version: string }>('/api/crypto/public-key'),
};
