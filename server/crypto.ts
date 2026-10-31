import crypto from 'node:crypto';

// Global keypair storage in-memory or loaded from environment
let serverPrivateKey: string | null = process.env.ED25519_PRIVATE_KEY || null;
let serverPublicKey: string | null = process.env.ED25519_PUBLIC_KEY || null;
const publicKeyVersion: string = process.env.PUBLIC_KEY_VERSION || 'v1-ed25519';

// Initialize Ed25519 keypair if not present
export function initCryptoKeys(): { publicKey: string; version: string } {
  if (!serverPrivateKey || !serverPublicKey) {
    try {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      serverPublicKey = publicKey;
      serverPrivateKey = privateKey;
      console.log('[Crypto] Initialized fresh Ed25519 keypair successfully');
    } catch (err) {
      console.error('[Crypto] Failed to generate Ed25519 keypair:', err);
      throw err;
    }
  }
  return {
    publicKey: serverPublicKey,
    version: publicKeyVersion,
  };
}

export function getPublicKey(): { publicKey: string; version: string } {
  if (!serverPublicKey) {
    initCryptoKeys();
  }
  return {
    publicKey: serverPublicKey!,
    version: publicKeyVersion,
  };
}

/**
 * Deterministically canonicalizes a JavaScript object into a sorted, normalized JSON string.
 * This guarantees that two objects with identical properties in any order produce the exact same byte sequence.
 */
export function canonicalizeJson(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map((item) => canonicalizeJson(item)).join(',') + ']';
  }

  const sortedKeys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = sortedKeys.map((key) => {
    const val = (obj as Record<string, unknown>)[key];
    return `${JSON.stringify(key)}:${canonicalizeJson(val)}`;
  });

  return '{' + pairs.join(',') + '}';
}

/**
 * Computes a SHA-256 cryptographic hash of canonicalized evidence.
 */
export function computeSha256(canonicalJson: string): string {
  return crypto.createHash('sha256').update(canonicalJson, 'utf8').digest('hex');
}

/**
 * Signs a canonical evidence hash with the server's Ed25519 private key.
 * Returns the base64-encoded digital signature.
 */
export function signEvidenceHash(evidenceHash: string): string {
  if (!serverPrivateKey) {
    initCryptoKeys();
  }
  const signBuffer = Buffer.from(evidenceHash, 'utf8');
  const signature = crypto.sign(null, signBuffer, serverPrivateKey!);
  return signature.toString('base64');
}

/**
 * Verifies an Ed25519 digital signature against a canonical evidence hash and public key.
 */
export function verifyEvidenceSignature(
  evidenceHash: string,
  signatureBase64: string,
  publicKeyPem?: string
): boolean {
  try {
    const keyToUse = publicKeyPem || serverPublicKey;
    if (!keyToUse) return false;

    const dataBuffer = Buffer.from(evidenceHash, 'utf8');
    const signatureBuffer = Buffer.from(signatureBase64, 'base64');

    return crypto.verify(null, dataBuffer, keyToUse, signatureBuffer);
  } catch (err) {
    console.error('[Crypto] Verification error:', err);
    return false;
  }
}

/**
 * Canonical evidence payload structure
 */
export interface CanonicalEvidencePayload {
  credential_id: string;
  candidate_id: string;
  candidate_name: string;
  assessment_id: string;
  skill_name: string;
  difficulty: string;
  language: string;
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
  issuer: string;
  public_key_version: string;
}

/**
 * Creates canonical evidence, computes hash, and generates signature.
 */
export function createCryptographicProof(payload: CanonicalEvidencePayload): {
  canonicalEvidenceJson: string;
  evidenceHash: string;
  signature: string;
  publicKeyVersion: string;
} {
  const canonicalEvidenceJson = canonicalizeJson(payload);
  const evidenceHash = computeSha256(canonicalEvidenceJson);
  const signature = signEvidenceHash(evidenceHash);

  return {
    canonicalEvidenceJson,
    evidenceHash,
    signature,
    publicKeyVersion,
  };
}
