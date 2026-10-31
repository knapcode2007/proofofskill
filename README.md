# PROOF OF SKILL
### Don't Claim It. Demonstrate It.
**A Hacktoberfest 2026 Project by Team KAIZOKU O NAKAMA**

---

## 1. Vision & Architecture

Resumes and multiple-choice certificates fail to demonstrate real-world engineering competency. Recruiters are forced to spend hundreds of hours filtering unqualified applicants.

**Proof of Skill** solves this crisis with a portable, evidence-backed Skill Passport:
1. **AI-Generated Challenges**: Dynamic real-world scenarios tailored to skill and difficulty tier using Google Gemini.
2. **Zero-Trust Code Execution**: Isolated test runner evaluating visible unit tests and server-side hidden test suites.
3. **AI Code Defense**: Adversarial technical questioning directly targeting lines of code written by the candidate to evaluate architectural trade-offs and complexity comprehension.
4. **Ed25519 Cryptographic Signatures**: The canonicalized assessment record is hashed with SHA-256 and signed with the server's Ed25519 private key.
5. **Instant Public Verification**: Recruiters verify authenticity, tamper-evidence, and revocation status in real time without creating an account.

```
+-------------------------------------------------------------------------+
|                              CANDIDATE                                  |
|   Select Skill -> Code in Monaco -> Run Isolated Tests -> AI Defense    |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                           SERVER PIPELINE                               |
|   1. Canonicalize Evidence Record (deterministic key sorting)           |
|   2. Compute SHA-256 Hash Digest                                        |
|   3. Sign Hash with Ed25519 Private Key                                 |
|   4. Store Credential & Audit Log                                       |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                              RECRUITER                                  |
|   Scan QR / Visit /verify/:id -> Recompute SHA-256 -> Verify Signature  |
+-------------------------------------------------------------------------+
```

---

## 2. Quickstart & Local Development

### Prerequisites
- Node.js >= 20.0.0
- npm >= 9.0.0

### Installation
```bash
# Clone the repository
git clone https://github.com/kaizoku-o-nakama/proof-of-skill.git
cd proof-of-skill

# Install dependencies
npm install
```

### Environment Setup
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Key environment variables:
- `GEMINI_API_KEY`: Google Gemini API key for dynamic challenge generation and code defense. (Falls back to certified challenge templates if omitted).
- `JUDGE0_API_URL` & `JUDGE0_API_KEY`: Isolated code execution provider.
- `ED25519_PRIVATE_KEY` & `ED25519_PUBLIC_KEY`: Private signing key and public verification key. (Auto-generated on startup if not specified).
- `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`: Supabase PostgreSQL and auth credentials. (Uses built-in ACID persistent storage if not configured).

### Run Locally
```bash
# Start development server on port 3000
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Cryptographic Key Generation

To generate your own persistent Ed25519 keypair for production:

```bash
node -e "
const crypto = require('crypto');
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});
console.log('--- ED25519_PUBLIC_KEY ---');
console.log(publicKey);
console.log('--- ED25519_PRIVATE_KEY ---');
console.log(privateKey);
"
```
Paste the outputs into `ED25519_PUBLIC_KEY` and `ED25519_PRIVATE_KEY` in your production environment variables.

---

## 4. Supabase Setup & Migrations

For production deployment with Supabase PostgreSQL:
1. Create a new Supabase project at [https://supabase.com](https://supabase.com).
2. Navigate to **SQL Editor** in your Supabase dashboard.
3. Open and run the migration script:
   ```
   supabase/migrations/20261031000000_proof_of_skill_schema.sql
   ```
4. Copy your project URL, anon key, and service role key into `.env`:
   ```env
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

All Row Level Security (RLS) policies are pre-configured to ensure candidates can only read and write their own assessment records, while public credential verification allows unauthenticated reads of verified credentials.

---

## 5. Automated Testing

Run the cryptographic verification and tampering test suite:
```bash
npm test
```

Tests validate:
- Key-order-invariant canonical JSON serialization.
- SHA-256 hash generation consistency.
- Ed25519 digital signature generation and verification.
- Tamper detection: modifying a single byte in the canonical payload causes verification to fail immediately.

---

## 6. Vercel Deployment Guide

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), select **Import Project**.
3. Configure your Environment Variables:
   - `GEMINI_API_KEY`
   - `APP_URL` (set to your Vercel deployment URL, e.g. `https://proof-of-skill.vercel.app`)
   - `ED25519_PRIVATE_KEY` & `ED25519_PUBLIC_KEY`
   - `JUDGE0_API_URL` & `JUDGE0_API_KEY` (if using external Judge0 cluster)
   - `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY` (if using Supabase)
4. Build command: `npm run build`
5. Deploy!

---

## 7. Security & Integrity Guarantees

- **No Secret Leakage**: Private Ed25519 keys, database service-role keys, and Judge0 credentials are kept strictly server-side.
- **Hidden Tests Remain Hidden**: Candidates are only supplied visible test fixtures. Hidden tests are evaluated exclusively inside isolated server execution runtimes.
- **Adversarial Authorship**: AI interrogates candidates on their exact code syntax and architectural decisions before proofs are minted.
- **Idempotent Issuance**: Each assessment can only produce one canonical credential ID, preventing duplicate issuance.

---

## Team KAIZOKU O NAKAMA
Hacktoberfest 2026 Hackathon Submission
