import fs from 'node:fs';
import path from 'node:path';
import { GeneratedChallenge, DefenseQuestion, DefenseEvaluation, CompetencyBreakdown } from './gemini.ts';
import { AssessmentRunSummary } from './judge0.ts';
import { CanonicalEvidencePayload } from './crypto.ts';

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

export interface StoredChallenge extends GeneratedChallenge {
  id: string;
  assessment_id: string;
  created_at: string;
}

export interface Submission {
  id: string;
  assessment_id: string;
  candidate_id: string;
  source_code: string;
  language: string;
  status: 'passed' | 'failed' | 'error' | 'timeout';
  test_results: AssessmentRunSummary;
  execution_time_ms: number;
  memory_used_kb: number;
  evidence_hash?: string;
  created_at: string;
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

export interface CredentialRecord {
  id: string;
  credential_id: string;
  candidate_id: string;
  candidate_name: string;
  assessment_id: string;
  skill_name: string;
  difficulty: string;
  canonical_evidence: CanonicalEvidencePayload;
  evidence_hash: string;
  signature: string;
  public_key_version: string;
  verification_status: 'VALID' | 'REVOKED' | 'INVALID_SIGNATURE' | 'TAMPERED';
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
  revoked_by?: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

interface DatabaseSchema {
  profiles: Profile[];
  skills: Skill[];
  assessments: Assessment[];
  challenges: StoredChallenge[];
  submissions: Submission[];
  defense_sessions: DefenseSession[];
  credentials: CredentialRecord[];
  audit_logs: AuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'proof_of_skill_db.json');

// Initial seed skills
const INITIAL_SKILLS: Skill[] = [
  {
    id: 'python-debugging',
    name: 'Python Debugging',
    description: 'Diagnose memory leaks, race conditions, edge-case regressions, and concurrency faults in realistic production codebases.',
    supported_language: 'python',
    is_active: true,
  },
  {
    id: 'python-programming',
    name: 'Python Programming',
    description: 'Architect clean, robust, and algorithmic backend systems with optimal time/space complexity.',
    supported_language: 'python',
    is_active: true,
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis & Manipulation',
    description: 'Vectorized filtering, sliding window transformations, and robust feature engineering under memory constraints.',
    supported_language: 'python',
    is_active: true,
  },
  {
    id: 'sql',
    name: 'SQL & Relational Logic',
    description: 'Complex aggregations, window functions, relational algebra, and zero-loss schema querying.',
    supported_language: 'python',
    is_active: true,
  },
  {
    id: 'web-dev',
    name: 'Web Backend & API Engineering',
    description: 'RESTful API contracts, request validation, idempotent endpoints, and rate-limiting patterns.',
    supported_language: 'python',
    is_active: true,
  },
  {
    id: 'javascript',
    name: 'JavaScript & Async Runtime',
    description: 'Event loop mechanics, promises, async generators, and resilient micro-task pipelines.',
    supported_language: 'python',
    is_active: true,
  },
];

// Initial demo profiles
const INITIAL_PROFILES: Profile[] = [
  {
    id: 'cand-001',
    email: 'alex.rivera@example.com',
    full_name: 'Alex Rivera',
    role: 'candidate',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Systems software engineer passionate about distributed queues and rigorous unit testing.',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rec-001',
    email: 'sarah.chen@techrecruiting.io',
    full_name: 'Sarah Chen (Senior Technical Recruiter)',
    role: 'recruiter',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Lead Engineering Talent Partner seeking candidates with proven, verifiable engineering demonstrations.',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadFromDisk();
  }

  private loadFromDisk(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(content);
        return {
          profiles: parsed.profiles || INITIAL_PROFILES,
          skills: parsed.skills && parsed.skills.length ? parsed.skills : INITIAL_SKILLS,
          assessments: parsed.assessments || [],
          challenges: parsed.challenges || [],
          submissions: parsed.submissions || [],
          defense_sessions: parsed.defense_sessions || [],
          credentials: parsed.credentials || [],
          audit_logs: parsed.audit_logs || [],
        };
      }
    } catch (err) {
      console.warn('[DB] Could not read existing DB file, reinitializing:', err);
    }

    const initial: DatabaseSchema = {
      profiles: INITIAL_PROFILES,
      skills: INITIAL_SKILLS,
      assessments: [],
      challenges: [],
      submissions: [],
      defense_sessions: [],
      credentials: [],
      audit_logs: [],
    };
    this.saveToDisk(initial);
    return initial;
  }

  private saveToDisk(dataToSave: DatabaseSchema = this.data) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf8');
    } catch (err) {
      console.error('[DB] Failed writing to disk:', err);
    }
  }

  // --- Profiles ---
  getProfiles(): Profile[] {
    return this.data.profiles;
  }

  getProfileById(id: string): Profile | undefined {
    return this.data.profiles.find((p) => p.id === id);
  }

  getProfileByEmail(email: string): Profile | undefined {
    return this.data.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
  }

  createProfile(profile: Omit<Profile, 'created_at' | 'updated_at'>): Profile {
    const now = new Date().toISOString();
    const newProfile: Profile = {
      ...profile,
      created_at: now,
      updated_at: now,
    };
    this.data.profiles.push(newProfile);
    this.saveToDisk();
    return newProfile;
  }

  updateProfile(id: string, updates: Partial<Profile>): Profile | undefined {
    const index = this.data.profiles.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    this.data.profiles[index] = {
      ...this.data.profiles[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveToDisk();
    return this.data.profiles[index];
  }

  // --- Skills ---
  getSkills(): Skill[] {
    return this.data.skills;
  }

  getSkillById(id: string): Skill | undefined {
    return this.data.skills.find((s) => s.id === id);
  }

  // --- Assessments ---
  getAssessments(candidateId?: string): Assessment[] {
    if (candidateId) {
      return this.data.assessments.filter((a) => a.candidate_id === candidateId);
    }
    return this.data.assessments;
  }

  getAssessmentById(id: string): Assessment | undefined {
    return this.data.assessments.find((a) => a.id === id);
  }

  createAssessment(assessment: Assessment): Assessment {
    this.data.assessments.push(assessment);
    this.saveToDisk();
    return assessment;
  }

  updateAssessment(id: string, updates: Partial<Assessment>): Assessment | undefined {
    const index = this.data.assessments.findIndex((a) => a.id === id);
    if (index === -1) return undefined;
    this.data.assessments[index] = {
      ...this.data.assessments[index],
      ...updates,
    };
    this.saveToDisk();
    return this.data.assessments[index];
  }

  // --- Challenges ---
  getChallengeByAssessmentId(assessmentId: string): StoredChallenge | undefined {
    return this.data.challenges.find((c) => c.assessment_id === assessmentId);
  }

  saveChallenge(challenge: StoredChallenge): StoredChallenge {
    const index = this.data.challenges.findIndex((c) => c.assessment_id === challenge.assessment_id);
    if (index !== -1) {
      this.data.challenges[index] = challenge;
    } else {
      this.data.challenges.push(challenge);
    }
    this.saveToDisk();
    return challenge;
  }

  // --- Submissions ---
  getSubmissions(assessmentId?: string): Submission[] {
    if (assessmentId) {
      return this.data.submissions.filter((s) => s.assessment_id === assessmentId);
    }
    return this.data.submissions;
  }

  saveSubmission(submission: Submission): Submission {
    this.data.submissions.push(submission);
    this.saveToDisk();
    return submission;
  }

  // --- Defense Sessions ---
  getDefenseSession(assessmentId: string): DefenseSession | undefined {
    return this.data.defense_sessions.find((ds) => ds.assessment_id === assessmentId);
  }

  saveDefenseSession(session: DefenseSession): DefenseSession {
    const idx = this.data.defense_sessions.findIndex((ds) => ds.assessment_id === session.assessment_id);
    if (idx !== -1) {
      this.data.defense_sessions[idx] = session;
    } else {
      this.data.defense_sessions.push(session);
    }
    this.saveToDisk();
    return session;
  }

  // --- Credentials ---
  getCredentials(candidateId?: string): CredentialRecord[] {
    if (candidateId) {
      return this.data.credentials.filter((c) => c.candidate_id === candidateId);
    }
    return this.data.credentials;
  }

  getCredentialById(id: string): CredentialRecord | undefined {
    return this.data.credentials.find((c) => c.id === id || c.credential_id === id);
  }

  saveCredential(credential: CredentialRecord): CredentialRecord {
    const idx = this.data.credentials.findIndex((c) => c.id === credential.id || c.credential_id === credential.credential_id);
    if (idx !== -1) {
      this.data.credentials[idx] = credential;
    } else {
      this.data.credentials.push(credential);
    }
    this.saveToDisk();
    return credential;
  }

  revokeCredential(credentialId: string, reason: string, actorId: string): CredentialRecord | undefined {
    const cred = this.data.credentials.find((c) => c.id === credentialId || c.credential_id === credentialId);
    if (!cred) return undefined;
    cred.verification_status = 'REVOKED';
    cred.revocation_reason = reason;
    cred.revocation_reason = reason;
    cred.revoked_at = new Date().toISOString();
    cred.revoked_by = actorId;

    this.logAudit({
      id: 'aud-' + Date.now(),
      actor_id: actorId,
      action: 'REVOKE_CREDENTIAL',
      resource_type: 'credential',
      resource_id: cred.credential_id,
      metadata: { reason, revoked_at: cred.revoked_at },
      created_at: new Date().toISOString(),
    });

    this.saveToDisk();
    return cred;
  }

  // --- Audit Logs ---
  logAudit(log: AuditLog) {
    this.data.audit_logs.push(log);
    this.saveToDisk();
  }

  getAuditLogs(): AuditLog[] {
    return this.data.audit_logs;
  }

  getStats(): {
    totalAssessments: number;
    totalCredentials: number;
    activeCredentials: number;
    revokedCredentials: number;
    totalCandidates: number;
  } {
    return {
      totalAssessments: this.data.assessments.length,
      totalCredentials: this.data.credentials.length,
      activeCredentials: this.data.credentials.filter((c) => c.verification_status === 'VALID').length,
      revokedCredentials: this.data.credentials.filter((c) => c.verification_status === 'REVOKED').length,
      totalCandidates: this.data.profiles.filter((p) => p.role === 'candidate').length,
    };
  }
}

export const db = new DatabaseStore();
