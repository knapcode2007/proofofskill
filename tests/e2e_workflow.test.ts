import assert from 'node:assert';
import http from 'node:http';
import { db } from '../server/db.ts';
import { initCryptoKeys, getPublicKey, canonicalizeJson, computeSha256, verifyEvidenceSignature } from '../server/crypto.ts';
import { runTestCases } from '../server/judge0.ts';
import { calculateCompetencies } from '../server/gemini.ts';

console.log('--- Initiating Full End-to-End Workflow & Security Verification ---');

async function runE2ETests() {
  // 1. Verify Cryptographic Initialization
  const { publicKey, version } = initCryptoKeys();
  assert.ok(publicKey.length > 50, 'Public key must be initialized');
  assert.strictEqual(version, 'v1-ed25519');
  console.log('✓ [1/8] Cryptographic Ed25519 Authority initialized');

  // 2. Candidate Workflow: Registration & Profile Verification
  const testEmail = `candidate-${Date.now()}@test.io`;
  const profile = db.createProfile({
    id: `cand-${Date.now().toString(36)}`,
    email: testEmail,
    full_name: 'Test Candidate',
    role: 'candidate',
    bio: 'Candidate undergoing automated end-to-end audit validation.',
  });
  assert.ok(profile.id, 'Candidate profile must be created');
  const retrievedProfile = db.getProfileByEmail(testEmail);
  assert.strictEqual(retrievedProfile?.id, profile.id);
  console.log('✓ [2/8] Candidate registration & profile persistence verified');

  // 3. Assessment Initialization & Skill Query
  const skills = db.getSkills();
  assert.ok(skills.length > 0, 'Skill catalog must contain available skills');
  const targetSkill = skills[0];

  const assessmentId = `asm-audit-${Date.now().toString(36)}`;
  const assessment = db.createAssessment({
    id: assessmentId,
    candidate_id: profile.id,
    skill_id: targetSkill.id,
    difficulty: 'Intermediate',
    language: 'python',
    status: 'initialized',
    started_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  });
  assert.strictEqual(assessment.status, 'initialized');
  console.log(`✓ [3/8] Assessment creation verified for skill: ${targetSkill.name}`);

  // 4. Code Execution & Isolated Sandbox Runner Verification
  const candidateSolution = `
def solve():
    return 42
`;
  const visibleTest = {
    id: 'test-v1',
    description: 'Visible test verification',
    input: 'print(solve())',
    expected_output: '42',
    is_hidden: false,
  };
  const hiddenTest = {
    id: 'test-h1',
    description: 'Hidden test edge-case verification',
    input: 'assert solve() == 42; print("PASSED")',
    expected_output: 'PASSED',
    is_hidden: true,
  };

  const runResult = await runTestCases(candidateSolution, [visibleTest, hiddenTest]);
  assert.strictEqual(runResult.allPassed, true, 'Candidate solution must pass visible and hidden test suites');
  assert.strictEqual(runResult.passedTests, 2);
  assert.strictEqual(runResult.visibleTestsPassed, 1);
  assert.strictEqual(runResult.hiddenTestsPassed, 1);
  console.log(`✓ [4/8] Isolated Python sandbox test evaluation verified (all tests passed)`);

  // 5. Code Defense & Evaluation Scoring
  const defenseScore = 92;
  const competencies = calculateCompetencies(
    runResult.passedTests,
    runResult.totalTests,
    runResult.executionTimeMs,
    defenseScore,
    candidateSolution
  );
  assert.ok(competencies.overall_score >= 80, 'Score must reflect successful testing and defense');
  assert.ok(competencies.logical_thinking > 0);
  assert.ok(competencies.debugging > 0);
  console.log(`✓ [5/8] Defense rubric and competency scoring verified (Overall: ${competencies.overall_score}/100)`);

  // 6. Cryptographic Proof Minting (Idempotent Issuance)
  const credentialId = `POS-2026-AUDIT-${Date.now().toString(36).toUpperCase()}`;
  const issuedAt = new Date().toISOString();
  const canonicalEvidence = {
    credential_id: credentialId,
    candidate_id: profile.id,
    candidate_name: profile.full_name,
    assessment_id: assessment.id,
    skill_name: targetSkill.name,
    difficulty: 'Intermediate',
    language: 'python',
    test_summary: {
      total_tests: 2,
      passed_tests: 2,
      visible_tests_passed: 1,
      hidden_tests_passed: 1,
      execution_time_ms: runResult.executionTimeMs,
    },
    defense_score: defenseScore,
    overall_score: competencies.overall_score,
    issued_at: issuedAt,
    issuer: 'Proof of Skill Cryptographic Authority',
    public_key_version: version,
  };

  const canonicalJson = canonicalizeJson(canonicalEvidence);
  const evidenceHash = computeSha256(canonicalJson);
  assert.strictEqual(evidenceHash.length, 64);

  // Digital Signature
  const { signEvidenceHash } = await import('../server/crypto.ts');
  const signature = signEvidenceHash(evidenceHash);
  assert.ok(signature.length > 20);

  const credRecord = db.saveCredential({
    id: `cred-${Date.now().toString(36)}`,
    credential_id: credentialId,
    candidate_id: profile.id,
    candidate_name: profile.full_name,
    assessment_id: assessment.id,
    skill_name: targetSkill.name,
    difficulty: 'Intermediate',
    canonical_evidence: canonicalEvidence,
    evidence_hash: evidenceHash,
    signature,
    public_key_version: version,
    verification_status: 'VALID',
    competencies,
    test_summary: canonicalEvidence.test_summary,
    defense_score: defenseScore,
    overall_score: competencies.overall_score,
    issued_at: issuedAt,
  });
  console.log(`✓ [6/8] Tamper-evident credential minted: ${credRecord.credential_id}`);

  // 7. Recruiter Public Verification
  const isSignatureValid = verifyEvidenceSignature(evidenceHash, signature, publicKey);
  assert.strictEqual(isSignatureValid, true, 'Public verification must authenticate valid signature');

  // Verify Tampering Rejection
  const tamperedPayload = { ...canonicalEvidence, overall_score: 100 };
  const tamperedHash = computeSha256(canonicalizeJson(tamperedPayload));
  const isTamperedValid = verifyEvidenceSignature(tamperedHash, signature, publicKey);
  assert.strictEqual(isTamperedValid, false, 'Tampered evidence MUST fail cryptographic signature check');
  console.log('✓ [7/8] Recruiter verification and adversarial tampering rejection verified');

  // 8. Revocation Flow
  const revoked = db.revokeCredential(credRecord.credential_id, 'Candidate security audit revocation', profile.id);
  assert.strictEqual(revoked?.verification_status, 'REVOKED');
  assert.strictEqual(revoked?.revocation_reason, 'Candidate security audit revocation');
  console.log('✓ [8/8] Credential lifecycle revocation flow verified');

  // Clean up test records from database store
  const fs = await import('node:fs');
  const dbData = JSON.parse(fs.readFileSync('data/proof_of_skill_db.json', 'utf8'));
  dbData.profiles = dbData.profiles.filter((p: any) => p.id !== profile.id);
  dbData.assessments = dbData.assessments.filter((a: any) => a.id !== assessment.id);
  dbData.credentials = dbData.credentials.filter((c: any) => c.credential_id !== credentialId);
  dbData.audit_logs = dbData.audit_logs.filter((l: any) => !l.metadata?.reason?.includes('Candidate security audit revocation'));
  fs.writeFileSync('data/proof_of_skill_db.json', JSON.stringify(dbData, null, 2) + '\n', 'utf8');

  console.log('\n======================================================');
  console.log('  ALL END-TO-END WORKFLOW CHECKS PASSED WITH 100% SUCCESS  ');
  console.log('======================================================');
}

runE2ETests().catch((err) => {
  console.error('Fatal E2E test failure:', err);
  process.exit(1);
});
