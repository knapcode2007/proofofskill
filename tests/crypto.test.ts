import assert from 'node:assert';
import {
  initCryptoKeys,
  getPublicKey,
  canonicalizeJson,
  computeSha256,
  createCryptographicProof,
  verifyEvidenceSignature,
  normalizeKey,
  CanonicalEvidencePayload,
} from '../server/crypto.ts';

console.log('--- Running Cryptographic Proof System Tests ---');

// 1. Initialize keys
const { publicKey, version } = initCryptoKeys();
assert.ok(publicKey.includes('BEGIN PUBLIC KEY'), 'Public key must be in PEM format');
assert.strictEqual(version, 'v1-ed25519', 'Default version should be v1-ed25519');
console.log('✓ Ed25519 key generation verified');

// 2. Canonical JSON sorting
const objA = { b: 2, a: 1, c: { y: 20, x: 10 } };
const objB = { c: { x: 10, y: 20 }, a: 1, b: 2 };
const jsonA = canonicalizeJson(objA);
const jsonB = canonicalizeJson(objB);
assert.strictEqual(jsonA, jsonB, 'Canonical JSON must be key-order invariant');
assert.strictEqual(jsonA, '{"a":1,"b":2,"c":{"x":10,"y":20}}');
console.log('✓ Canonical JSON serializer verified');

// 3. SHA-256 Hash
const hash1 = computeSha256(jsonA);
const hash2 = computeSha256(jsonB);
assert.strictEqual(hash1, hash2, 'Identical canonical JSON must produce identical SHA-256');
assert.strictEqual(hash1.length, 64, 'SHA-256 hex digest must be 64 characters');
console.log('✓ SHA-256 hash generation verified');

// 4. End-to-End Proof Generation and Signature Verification
const samplePayload: CanonicalEvidencePayload = {
  credential_id: 'POS-2026-PY-9A4B',
  candidate_id: 'cand-12345',
  candidate_name: 'Alex Rivera',
  assessment_id: 'asm-67890',
  skill_name: 'Python Debugging',
  difficulty: 'Intermediate',
  language: 'python',
  test_summary: {
    total_tests: 6,
    passed_tests: 6,
    visible_tests_passed: 3,
    hidden_tests_passed: 3,
    execution_time_ms: 84,
  },
  defense_score: 95,
  overall_score: 98,
  issued_at: '2026-10-31T01:00:00Z',
  issuer: 'Proof of Skill Authority',
  public_key_version: 'v1-ed25519',
};

const proof = createCryptographicProof(samplePayload);
assert.ok(proof.signature.length > 20, 'Signature should be valid base64');
console.log('✓ Ed25519 digital signature created');

const isValid = verifyEvidenceSignature(proof.evidenceHash, proof.signature, publicKey);
assert.strictEqual(isValid, true, 'Original signature must verify against original hash and public key');
console.log('✓ Signature verified with public key: VALID');

// 5. Tampering Detection Test
const tamperedPayload = {
  ...samplePayload,
  overall_score: 100, // Attacker increased score by 2 points
};
const tamperedJson = canonicalizeJson(tamperedPayload);
const tamperedHash = computeSha256(tamperedJson);

// Verify with original signature should fail
const isTamperedValid = verifyEvidenceSignature(tamperedHash, proof.signature, publicKey);
assert.strictEqual(isTamperedValid, false, 'Tampered evidence hash must fail verification');
console.log('✓ Tampering detection verified: attacker score change successfully rejected');

// 6. PEM Key Normalization Test (Escaped newlines)
const rawKeyWithEscapedNewlines = '-----BEGIN PRIVATE KEY-----\\nMC4CAQAwBQYDK2VwBCIEIM+Pj39bKm48HICgrDvdQEr+KHD2ExFI6YprEeGbIide\\n-----END PRIVATE KEY-----\\n';
const normalized = normalizeKey(rawKeyWithEscapedNewlines, 'PRIVATE KEY');
assert.ok(normalized !== null, 'Key with escaped newlines must be parsed');
assert.ok(!normalized.includes('\\n'), 'Normalized key must not contain escaped newlines');
assert.ok(normalized.includes('\n'), 'Normalized key must contain real newlines');
console.log('✓ PEM key normalization (escaped newlines) verified');

console.log('--- All Cryptographic Tests Passed Successfully! ---');
