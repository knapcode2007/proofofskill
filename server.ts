import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  initCryptoKeys,
  getPublicKey,
  createCryptographicProof,
  verifyEvidenceSignature,
  canonicalizeJson,
  computeSha256,
  CanonicalEvidencePayload,
} from './server/crypto.ts';
import {
  generateCodingChallenge,
  generateDefenseQuestions,
  evaluateDefenseAnswer,
  calculateCompetencies,
} from './server/gemini.ts';
import {
  runTestCases,
  executeIsolatedCode,
  getExecutionProviderStatus,
} from './server/judge0.ts';
import { db, Profile } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isDev = process.env.NODE_ENV !== 'production';

// Initialize crypto keys on boot
initCryptoKeys();

app.use(express.json({ limit: '5mb' }));

// Production HTTP Security Headers for standalone and local execution
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  next();
});

// Direct alias for root health probe
app.get('/health', (_req: Request, res: Response) => {
  res.redirect(307, '/api/health');
});

// -------------------------------------------------------------
// Authentication Helper & Mock Session Middleware
// -------------------------------------------------------------
// For simplicity in hackathon preview, we read session from Authorization Bearer
// or fallback to the demo candidate profile.
let currentSessionUser: Profile = db.getProfiles()[0]; // Default to Alex Rivera

function getActiveUser(req: Request): Profile {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer user-')) {
    const userId = authHeader.replace('Bearer user-', '');
    const user = db.getProfileById(userId);
    if (user) return user;
  }
  return currentSessionUser;
}

// -------------------------------------------------------------
// AUTH ENDPOINTS
// -------------------------------------------------------------
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  res.json({ user, session_active: true });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, full_name, role = 'candidate', bio } = req.body;
  if (!email || !full_name) {
    return res.status(400).json({ error: 'Email and full name are required' });
  }

  const existing = db.getProfileByEmail(email);
  if (existing) {
    currentSessionUser = existing;
    return res.json({ user: existing, is_existing: true });
  }

  const newProfile = db.createProfile({
    id: 'user-' + Date.now().toString(36),
    email,
    full_name,
    role: role === 'recruiter' ? 'recruiter' : 'candidate',
    bio: bio || 'Candidate taking practical coding verification assessments.',
    avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
  });

  currentSessionUser = newProfile;
  db.logAudit({
    id: 'aud-' + Date.now(),
    actor_id: newProfile.id,
    action: 'REGISTER_USER',
    resource_type: 'profile',
    resource_id: newProfile.id,
    created_at: new Date().toISOString(),
  });

  res.status(201).json({ user: newProfile });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = db.getProfileByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email' });
  }
  currentSessionUser = user;
  res.json({ user, token: 'user-' + user.id });
});

app.post('/api/auth/switch-role', (req: Request, res: Response) => {
  const { role } = req.body;
  if (role !== 'candidate' && role !== 'recruiter') {
    return res.status(400).json({ error: 'Invalid role' });
  }
  const profiles = db.getProfiles();
  const target = profiles.find((p) => p.role === role) || profiles[0];
  currentSessionUser = target;
  res.json({ user: target });
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

// -------------------------------------------------------------
// PROFILE ENDPOINTS
// -------------------------------------------------------------
app.get('/api/profile', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  res.json({ profile: user });
});

app.patch('/api/profile', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const { full_name, bio, avatar_url } = req.body;
  const updated = db.updateProfile(user.id, { full_name, bio, avatar_url });
  if (updated && currentSessionUser.id === user.id) {
    currentSessionUser = updated;
  }
  res.json({ profile: updated });
});

// -------------------------------------------------------------
// SKILLS ENDPOINT
// -------------------------------------------------------------
app.get('/api/skills', (_req: Request, res: Response) => {
  res.json({ skills: db.getSkills() });
});

// -------------------------------------------------------------
// ASSESSMENTS ENDPOINTS
// -------------------------------------------------------------
app.post('/api/assessments', async (req: Request, res: Response) => {
  try {
    const user = getActiveUser(req);
    const { skill_id, difficulty = 'Intermediate', language = 'python' } = req.body;

    const skill = db.getSkillById(skill_id);
    if (!skill) {
      return res.status(400).json({ error: 'Invalid skill_id provided' });
    }

    const assessmentId = 'asm-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);

    const assessment = db.createAssessment({
      id: assessmentId,
      candidate_id: user.id,
      skill_id,
      difficulty,
      language,
      status: 'initialized',
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });

    db.logAudit({
      id: 'aud-' + Date.now(),
      actor_id: user.id,
      action: 'START_ASSESSMENT',
      resource_type: 'assessment',
      resource_id: assessment.id,
      metadata: { skill_id, difficulty },
      created_at: new Date().toISOString(),
    });

    res.status(201).json({ assessment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/assessments', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const assessments = db.getAssessments(user.role === 'recruiter' ? undefined : user.id);
  res.json({ assessments });
});

app.get('/api/assessments/:id', (req: Request, res: Response) => {
  const assessment = db.getAssessmentById(req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment not found' });
  }
  const challenge = db.getChallengeByAssessmentId(assessment.id);
  res.json({
    assessment,
    has_challenge: Boolean(challenge),
  });
});

app.patch('/api/assessments/:id', (req: Request, res: Response) => {
  const { draft_code } = req.body;
  const updated = db.updateAssessment(req.params.id, { draft_code });
  if (!updated) {
    return res.status(404).json({ error: 'Assessment not found' });
  }
  res.json({ assessment: updated });
});

// -------------------------------------------------------------
// CHALLENGE GENERATION & RETRIEVAL
// -------------------------------------------------------------
app.post('/api/assessments/:id/generate-challenge', async (req: Request, res: Response) => {
  try {
    const assessment = db.getAssessmentById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // Check if challenge already generated
    const existing = db.getChallengeByAssessmentId(assessment.id);
    if (existing) {
      // Strip hidden tests for candidate response
      const { hidden_tests, ...candidateSafe } = existing;
      return res.json({ challenge: candidateSafe });
    }

    const skill = db.getSkillById(assessment.skill_id);
    const skillName = skill ? skill.name : assessment.skill_id;

    console.log(`[Assessment] Generating challenge for ${skillName} (${assessment.difficulty})...`);
    const generated = await generateCodingChallenge(skillName, assessment.difficulty, assessment.language);

    const challengeId = 'ch-' + Date.now().toString(36);
    const storedChallenge = db.saveChallenge({
      ...generated,
      id: challengeId,
      assessment_id: assessment.id,
      created_at: new Date().toISOString(),
    });

    db.updateAssessment(assessment.id, {
      status: 'challenge_generated',
      challenge_id: challengeId,
      draft_code: generated.starter_code,
    });

    // Strip hidden tests from response: candidates MUST NEVER see hidden test inputs/outputs
    const { hidden_tests, ...candidateSafe } = storedChallenge;
    res.json({ challenge: candidateSafe });
  } catch (err: any) {
    console.error('[Assessment] Error generating challenge:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/assessments/:id/challenge', (req: Request, res: Response) => {
  const challenge = db.getChallengeByAssessmentId(req.params.id);
  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not generated yet' });
  }

  // Security guarantee: NEVER expose hidden tests to the candidate
  const { hidden_tests, ...candidateSafe } = challenge;
  res.json({ challenge: candidateSafe });
});

// -------------------------------------------------------------
// CODE EXECUTION & TEST RUNNERS
// -------------------------------------------------------------
// Run Code: candidate executes code against visible tests only
app.post('/api/assessments/:id/run', async (req: Request, res: Response) => {
  try {
    const { source_code } = req.body;
    if (!source_code) {
      return res.status(400).json({ error: 'Source code is required' });
    }

    const challenge = db.getChallengeByAssessmentId(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Execute only against visible tests
    const runSummary = await runTestCases(source_code, challenge.visible_tests);
    res.json({ runSummary });
  } catch (err: any) {
    console.error('[Execution] Run error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Submit Solution: executes code against BOTH visible and hidden tests on the server!
app.post('/api/assessments/:id/submit', async (req: Request, res: Response) => {
  try {
    const user = getActiveUser(req);
    const { source_code } = req.body;
    if (!source_code) {
      return res.status(400).json({ error: 'Source code is required' });
    }

    const assessment = db.getAssessmentById(req.params.id);
    const challenge = db.getChallengeByAssessmentId(req.params.id);
    if (!assessment || !challenge) {
      return res.status(404).json({ error: 'Assessment or challenge not found' });
    }

    console.log(`[Submission] Validating submission for assessment ${assessment.id}...`);

    // Combine visible and hidden tests for server-side evaluation
    const allTests = [...challenge.visible_tests, ...challenge.hidden_tests];
    const testResults = await runTestCases(source_code, allTests);

    // Compute evidence hash for this submission snapshot
    const submissionEvidence = {
      assessment_id: assessment.id,
      candidate_id: user.id,
      code_length: source_code.length,
      all_passed: testResults.allPassed,
      passed_count: testResults.passedTests,
      total_count: testResults.totalTests,
      timestamp: new Date().toISOString(),
    };
    const evidenceHash = computeSha256(canonicalizeJson(submissionEvidence));

    const submissionId = 'sub-' + Date.now().toString(36);
    const submission = db.saveSubmission({
      id: submissionId,
      assessment_id: assessment.id,
      candidate_id: user.id,
      source_code,
      language: assessment.language,
      status: testResults.allPassed ? 'passed' : 'failed',
      test_results: testResults,
      execution_time_ms: testResults.executionTimeMs,
      memory_used_kb: testResults.memoryKb,
      evidence_hash: evidenceHash,
      created_at: new Date().toISOString(),
    });

    db.updateAssessment(assessment.id, {
      status: 'submitted',
      draft_code: source_code,
    });

    // Strip hidden tests details before sending results back to candidate
    const sanitizedResults = {
      ...testResults,
      results: testResults.results.map((r) =>
        r.isHidden
          ? {
              testId: r.testId,
              description: r.description,
              passed: r.passed,
              executionTimeMs: r.executionTimeMs,
              isHidden: true,
              actualOutput: '[Hidden Test Output Redacted for Integrity]',
              expectedOutput: '[Hidden Test Assertion Redacted]',
            }
          : r
      ),
    };

    res.json({
      submission_id: submission.id,
      status: submission.status,
      all_passed: testResults.allPassed,
      test_summary: sanitizedResults,
    });
  } catch (err: any) {
    console.error('[Submission] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// CODE DEFENSE
// -------------------------------------------------------------
app.post('/api/assessments/:id/defense/start', async (req: Request, res: Response) => {
  try {
    const user = getActiveUser(req);
    const assessment = db.getAssessmentById(req.params.id);
    const challenge = db.getChallengeByAssessmentId(req.params.id);
    const submissions = db.getSubmissions(req.params.id);

    if (!assessment || !challenge || submissions.length === 0) {
      return res.status(400).json({ error: 'Assessment must have a submission before starting code defense' });
    }

    const latestSubmission = submissions[submissions.length - 1];

    // Check if defense session exists
    let session = db.getDefenseSession(assessment.id);
    if (!session) {
      console.log(`[Defense] Generating AI defense questions based on candidate's code...`);
      const questions = await generateDefenseQuestions(
        latestSubmission.source_code,
        challenge.title,
        challenge.problem_statement
      );

      session = db.saveDefenseSession({
        id: 'def-' + Date.now().toString(36),
        assessment_id: assessment.id,
        candidate_id: user.id,
        questions,
        answers: {},
        status: 'pending',
        created_at: new Date().toISOString(),
      });

      db.updateAssessment(assessment.id, { status: 'defense_in_progress' });
    }

    res.json({ session });
  } catch (err: any) {
    console.error('[Defense] Start error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/assessments/:id/defense/answer', async (req: Request, res: Response) => {
  try {
    const { question_id, answer } = req.body;
    if (!question_id || !answer) {
      return res.status(400).json({ error: 'question_id and answer are required' });
    }

    const session = db.getDefenseSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Defense session not found' });
    }

    const question = session.questions.find((q) => q.id === question_id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const submissions = db.getSubmissions(req.params.id);
    const latestSubmission = submissions[submissions.length - 1];

    console.log(`[Defense] Evaluating candidate answer for question ${question_id}...`);
    const evaluation = await evaluateDefenseAnswer(
      latestSubmission ? latestSubmission.source_code : '',
      question.question,
      answer,
      question.rubric
    );

    session.answers[question_id] = {
      answer,
      evaluation,
      answered_at: new Date().toISOString(),
    };

    // Check if all questions are answered
    const allAnswered = session.questions.every((q) => session!.answers[q.id]);
    if (allAnswered) {
      session.status = 'completed';
      const scores = Object.values(session.answers).map((a) => a.evaluation?.score || 80);
      session.average_score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      db.updateAssessment(req.params.id, { status: 'evaluated' });
    }

    db.saveDefenseSession(session);

    res.json({
      session,
      evaluation,
      all_completed: allAnswered,
    });
  } catch (err: any) {
    console.error('[Defense] Answer error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/assessments/:id/defense', (req: Request, res: Response) => {
  const session = db.getDefenseSession(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Defense session not found' });
  }
  res.json({ session });
});

// -------------------------------------------------------------
// EVALUATION & COMPETENCIES
// -------------------------------------------------------------
app.post('/api/assessments/:id/evaluate', (req: Request, res: Response) => {
  try {
    const assessment = db.getAssessmentById(req.params.id);
    const submissions = db.getSubmissions(req.params.id);
    const defense = db.getDefenseSession(req.params.id);

    if (!assessment || submissions.length === 0) {
      return res.status(400).json({ error: 'Missing submission for evaluation' });
    }

    const latest = submissions[submissions.length - 1];
    const defenseScore = defense?.average_score ?? 85;

    const competencies = calculateCompetencies(
      latest.test_results.passedTests,
      latest.test_results.totalTests,
      latest.execution_time_ms,
      defenseScore,
      latest.source_code
    );

    res.json({ competencies });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// CRYPTOGRAPHIC PROOF GENERATION & VERIFICATION
// -------------------------------------------------------------
app.post('/api/assessments/:id/generate-proof', async (req: Request, res: Response) => {
  try {
    const user = getActiveUser(req);
    const assessment = db.getAssessmentById(req.params.id);
    const challenge = db.getChallengeByAssessmentId(req.params.id);
    const submissions = db.getSubmissions(req.params.id);
    const defense = db.getDefenseSession(req.params.id);

    if (!assessment || !challenge || submissions.length === 0) {
      return res.status(400).json({ error: 'Assessment must have code submission before proof generation' });
    }

    const latest = submissions[submissions.length - 1];
    if (!latest.test_results.allPassed) {
      return res.status(400).json({
        error: 'Cannot issue credential: code did not pass all automated test suites',
      });
    }

    // Check if credential already issued for this assessment (idempotent)
    const existingCreds = db.getCredentials().filter((c) => c.assessment_id === assessment.id);
    if (existingCreds.length > 0) {
      return res.json({ credential: existingCreds[0], is_existing: true });
    }

    const skill = db.getSkillById(assessment.skill_id);
    const skillName = skill ? skill.name : assessment.skill_id;
    const defenseScore = defense?.average_score ?? 90;

    const competencies = calculateCompetencies(
      latest.test_results.passedTests,
      latest.test_results.totalTests,
      latest.execution_time_ms,
      defenseScore,
      latest.source_code
    );

    const credentialId = `POS-2026-${assessment.skill_id.slice(0, 2).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    const issuedAt = new Date().toISOString();

    // 1. Build canonical evidence payload
    const evidencePayload: CanonicalEvidencePayload = {
      credential_id: credentialId,
      candidate_id: user.id,
      candidate_name: user.full_name,
      assessment_id: assessment.id,
      skill_name: skillName,
      difficulty: assessment.difficulty,
      language: assessment.language,
      test_summary: {
        total_tests: latest.test_results.totalTests,
        passed_tests: latest.test_results.passedTests,
        visible_tests_passed: latest.test_results.visibleTestsPassed,
        hidden_tests_passed: latest.test_results.hiddenTestsPassed,
        execution_time_ms: latest.execution_time_ms,
      },
      defense_score: defenseScore,
      overall_score: competencies.overall_score,
      issued_at: issuedAt,
      issuer: 'Proof of Skill Cryptographic Authority',
      public_key_version: getPublicKey().version,
    };

    // 2. Canonicalize JSON, hash with SHA-256, and sign with Ed25519 private key
    const proof = createCryptographicProof(evidencePayload);

    // 3. Persist credential record
    const credential = db.saveCredential({
      id: 'cred-' + Date.now().toString(36),
      credential_id: credentialId,
      candidate_id: user.id,
      candidate_name: user.full_name,
      assessment_id: assessment.id,
      skill_name: skillName,
      difficulty: assessment.difficulty,
      canonical_evidence: evidencePayload,
      evidence_hash: proof.evidenceHash,
      signature: proof.signature,
      public_key_version: proof.publicKeyVersion,
      verification_status: 'VALID',
      competencies,
      test_summary: evidencePayload.test_summary,
      defense_score: defenseScore,
      overall_score: competencies.overall_score,
      issued_at: issuedAt,
    });

    db.updateAssessment(assessment.id, {
      status: 'credential_issued',
      completed_at: issuedAt,
    });

    db.logAudit({
      id: 'aud-' + Date.now(),
      actor_id: user.id,
      action: 'ISSUE_CREDENTIAL',
      resource_type: 'credential',
      resource_id: credential.credential_id,
      metadata: { evidence_hash: proof.evidenceHash, signature: proof.signature },
      created_at: issuedAt,
    });

    console.log(`[Proof] Issued tamper-evident credential ${credentialId} for ${user.full_name}`);

    res.status(201).json({ credential });
  } catch (err: any) {
    console.error('[Proof] Generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/credentials/:id', (req: Request, res: Response) => {
  const cred = db.getCredentialById(req.params.id);
  if (!cred) {
    return res.status(404).json({ error: 'Credential not found' });
  }
  res.json({ credential: cred });
});

// PUBLIC VERIFICATION ENDPOINT (No authentication required)
app.get('/api/verify/:credentialId', (req: Request, res: Response) => {
  const { credentialId } = req.params;
  const cred = db.getCredentialById(credentialId);

  if (!cred) {
    return res.status(404).json({
      status: 'NOT_FOUND',
      message: `No credential found matching ID '${credentialId}'`,
      verified: false,
    });
  }

  // Check revocation status first
  if (cred.verification_status === 'REVOKED') {
    return res.json({
      status: 'REVOKED',
      message: 'This credential was revoked by its owner or issuing authority.',
      verified: false,
      credential_id: cred.credential_id,
      skill_name: cred.skill_name,
      candidate_name: cred.candidate_name,
      issued_at: cred.issued_at,
      revoked_at: cred.revoked_at,
      revocation_reason: cred.revocation_reason,
      public_key_version: cred.public_key_version,
    });
  }

  // 1. Reconstruct canonical evidence JSON
  const reconstructedJson = canonicalizeJson(cred.canonical_evidence);
  // 2. Re-compute SHA-256 hash
  const computedHash = computeSha256(reconstructedJson);

  // Check if evidence hash matches stored hash
  if (computedHash !== cred.evidence_hash) {
    return res.json({
      status: 'TAMPERED',
      message: 'Hash mismatch: Canonical evidence does not match recorded SHA-256 digest.',
      verified: false,
      computed_hash: computedHash,
      recorded_hash: cred.evidence_hash,
    });
  }

  // 3. Cryptographically verify Ed25519 signature with public key
  const { publicKey } = getPublicKey();
  const signatureValid = verifyEvidenceSignature(computedHash, cred.signature, publicKey);

  if (!signatureValid) {
    return res.json({
      status: 'INVALID_SIGNATURE',
      message: 'Cryptographic signature verification failed against official Ed25519 public key.',
      verified: false,
      credential_id: cred.credential_id,
    });
  }

  // Verified successfully!
  // Safe public information only - never expose private code or hidden tests!
  res.json({
    status: 'VALID',
    verified: true,
    message: 'Authentic and tamper-evident proof verified by Ed25519 signature.',
    verification_timestamp: new Date().toISOString(),
    credential: {
      credential_id: cred.credential_id,
      candidate_name: cred.candidate_name,
      skill_name: cred.skill_name,
      difficulty: cred.difficulty,
      overall_score: cred.overall_score,
      defense_score: cred.defense_score,
      test_summary: {
        total_tests: cred.test_summary.total_tests,
        passed_tests: cred.test_summary.passed_tests,
      },
      competencies: cred.competencies,
      issued_at: cred.issued_at,
      issuer: 'Proof of Skill Cryptographic Authority',
      evidence_hash: cred.evidence_hash,
      signature: cred.signature,
      public_key_version: cred.public_key_version,
    },
  });
});

// Revoke Credential
app.post('/api/credentials/:id/revoke', (req: Request, res: Response) => {
  const user = getActiveUser(req);
  const { reason = 'Revoked by candidate request' } = req.body;
  const revoked = db.revokeCredential(req.params.id, reason, user.id);
  if (!revoked) {
    return res.status(404).json({ error: 'Credential not found' });
  }
  res.json({ credential: revoked, status: 'REVOKED' });
});

// -------------------------------------------------------------
// RECRUITER ENDPOINTS
// -------------------------------------------------------------
app.get('/api/recruiter/credentials', (_req: Request, res: Response) => {
  const credentials = db.getCredentials();
  res.json({ credentials });
});

app.post('/api/recruiter/verify', (req: Request, res: Response) => {
  const { query } = req.body; // Can be a credential_id, verification URL, or candidate name
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // Extract ID if URL provided
  let targetId = query.trim();
  const match = targetId.match(/(POS-2026-[A-Z0-9]+-[A-Z0-9]+)/i);
  if (match) {
    targetId = match[1];
  }

  const credentials = db.getCredentials();
  const found = credentials.filter(
    (c) =>
      c.credential_id.toLowerCase() === targetId.toLowerCase() ||
      c.candidate_name.toLowerCase().includes(targetId.toLowerCase()) ||
      c.skill_name.toLowerCase().includes(targetId.toLowerCase())
  );

  res.json({ results: found });
});

// -------------------------------------------------------------
// HEALTH & INTEGRATION DIAGNOSTICS
// -------------------------------------------------------------
app.get('/api/crypto/public-key', (_req: Request, res: Response) => {
  res.json(getPublicKey());
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api/health/database', (_req: Request, res: Response) => {
  const stats = db.getStats();
  res.json({
    status: 'ok',
    type: 'persistent_acid_store',
    stats,
  });
});

app.get('/api/health/integrations', (_req: Request, res: Response) => {
  const executionStatus = getExecutionProviderStatus();
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const cryptoStatus = getPublicKey();

  res.json({
    gemini_ai: {
      status: hasGemini ? 'active' : 'fallback_mode',
      model: 'gemini-3.8-flash',
      configured: hasGemini,
      description: hasGemini
        ? 'Google Gemini 3.8 Flash operational for challenges, defense & rubric scoring'
        : 'Gemini API key not detected; certified dynamic templates active',
    },
    code_execution: executionStatus,
    cryptography: {
      algorithm: 'Ed25519',
      hashing: 'SHA-256',
      public_key_version: cryptoStatus.version,
      status: 'active',
    },
    database: {
      status: 'active',
      supabase_configured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    },
  });
});

// -------------------------------------------------------------
// VITE DEV SERVER / STATIC ASSETS HANDLER
// -------------------------------------------------------------
export async function bootstrapServer() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  return new Promise((resolve) => {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`>>> Proof of Skill Server listening on http://0.0.0.0:${PORT}`);
      console.log(`>>> Environment: ${process.env.NODE_ENV || 'development'}`);
      resolve(server);
    });
  });
}

// Start standalone server only when executed directly or explicitly instructed (npm run dev / npm start)
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const isDirectExecution = Boolean(
  process.argv[1] &&
  (process.argv[1].endsWith('server.ts') || process.argv[1].endsWith('server.js'))
);
const isExplicitStart = process.env.START_SERVER === 'true' || process.env.START_SERVER === '1';

if (!isServerless && (isDirectExecution || isExplicitStart)) {
  bootstrapServer().catch((err) => {
    console.error('Fatal server boot error:', err);
    process.exit(1);
  });
}

export { app };
export default app;
