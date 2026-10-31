# Proof of Skill — Vercel Production Deployment Guide
**Platform:** Vercel (Edge CDN + Serverless Functions) | **Source Control:** GitHub  
**Application:** PROOF OF SKILL (AI-Powered Practical Assessment & Ed25519 Cryptographic Credentialing)  
**Document Version:** 1.0.0 (Production Release)

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [System Requirements](#2-system-requirements)
3. [Local Development Setup](#3-local-development-setup)
4. [Environment Variable Reference](#4-environment-variable-reference)
5. [Supabase Setup & PostgreSQL Schema](#5-supabase-setup--postgresql-schema)
6. [Database Migration Procedure](#6-database-migration-procedure)
7. [Google Gemini AI API Setup](#7-google-gemini-ai-api-setup)
8. [Judge0 Isolated Code Execution Setup](#8-judge0-isolated-code-execution-setup)
9. [Ed25519 Key Generation & Management](#9-ed25519-key-generation--management)
10. [GitHub Repository & CI/CD Setup](#10-github-repository--cicd-setup)
11. [Vercel Project Configuration](#11-vercel-project-configuration)
12. [Preview Deployment Procedure](#12-preview-deployment-procedure)
13. [Production Deployment Procedure](#13-production-deployment-procedure)
14. [Custom Domain Configuration](#14-custom-domain-configuration)
15. [Rollback & Incident Recovery Procedure](#15-rollback--incident-recovery-procedure)
16. [Troubleshooting Guide](#16-troubleshooting-guide)
17. [Production Security Checklist](#17-production-security-checklist)

---

## 1. Architecture Overview

Proof of Skill operates as a hybrid static Single-Page Application (SPA) paired with serverless REST API functions hosted on Vercel:

```
[ User Browser ]
       |
       v
+-------------------------------------------------------------+
| Vercel Global Edge Network (Anycast CDN)                   |
| - Static Assets: /assets/* (1-year immutable caching)       |
| - SPA Shell: index.html (client-side routing fallback)       |
| - Security Headers: Strict HSTS, CSP, X-Content-Type-Options |
+-------------------------------------------------------------+
       |
       | /api/* rewrites
       v
+-------------------------------------------------------------+
| Vercel Serverless Function (/api/index.ts)                  |
| Express 4.21 Application Gateway (Node.js runtime)          |
+-------------------------------------------------------------+
   |          |                     |                  |
   v          v                     v                  v
+----------+ +-------------------+ +----------------+ +------------------+
| Database | | Gemini 3.8 Flash  | | Judge0 Cloud   | | Ed25519 Crypto   |
| Supabase | | Coding Challenge  | | Isolated Code  | | Digital Signer   |
| or ACID  | | Generation &      | | Execution      | | & Canonical JSON |
| /tmp JSON| | Rubric Defense    | | Sandbox        | | Hash Verifier    |
+----------+ +-------------------+ +----------------+ +------------------+
```

### Component Breakdown
- **Frontend SPA:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Monaco Editor (code authoring), Three.js (3D cryptographic vault rendering), Lucide icons.
- **Serverless API Gateway:** Express 4.21 exported via `api/index.ts`. All `/api/*` endpoints (authentication, challenge generation, defense questioning, scoring, credential issuance, and public cryptographic verification) run server-side in isolated serverless invocations.
- **Storage Subsystem:** Dual-mode storage architecture:
  1. Default: In-memory & persistent store with automatic `/tmp` fallback for serverless read-only filesystems.
  2. Production Cloud: Supabase PostgreSQL with pre-configured Row Level Security (RLS) policies.
- **Cryptographic Authority:** Ed25519 asymmetric signatures and SHA-256 canonical digest generation using `node:crypto`.

---

## 2. System Requirements

### Runtime & Tooling
- **Node.js:** `v20.x` or `v22.x` LTS (local development and Vercel Serverless Functions).
- **Package Manager:** `npm` v10+ (using `--legacy-peer-deps` for React 19 compatibility).
- **Operating System:** Cross-platform (Windows, macOS, Linux).

---

## 3. Local Development Setup

1. **Clone repository:**
   ```bash
   git clone https://github.com/your-org/proofofskill.git
   cd proofofskill
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

4. **Verify test suite:**
   ```bash
   npm test
   ```

5. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 4. Environment Variable Reference

| Variable Name | Required | Environment | Description |
|---|---|---|---|
| `APP_URL` | Yes | All | Root public URL used for canonical verification links & QR codes |
| `NODE_ENV` | Yes | Vercel sets auto | Set to `production` in live deployments |
| `GEMINI_API_KEY` | Recommended | Server-Only | Google Gemini API key for dynamic challenge and rubric defense generation |
| `JUDGE0_API_URL` | Recommended | Server-Only | Cloud execution endpoint (`https://judge0-ce.p.rapidapi.com` or self-hosted) |
| `JUDGE0_API_KEY` | Recommended | Server-Only | RapidAPI key or Judge0 authentication key |
| `JUDGE0_API_HOST` | Recommended | Server-Only | RapidAPI host header (`judge0-ce.p.rapidapi.com`) |
| `ED25519_PRIVATE_KEY` | Recommended | Server-Only | Ed25519 authority private key in PEM format (NEVER expose to client) |
| `ED25519_PUBLIC_KEY` | Recommended | Server-Only | Ed25519 authority public key in PEM format |
| `PUBLIC_KEY_VERSION` | Optional | Server-Only | Version string for key rotation (`v1-ed25519` by default) |
| `SUPABASE_URL` | Optional | Server-Only | Supabase project URL for cloud database persistence |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-Only | Supabase elevated key for administrative server queries |
| `SUPABASE_ANON_KEY` | Optional | Server-Only | Supabase client anon key |

---

## 5. Supabase Setup & PostgreSQL Schema

When connecting an external Supabase PostgreSQL database:

1. Create a new Supabase project in the target region (e.g., `us-east-1` or `eu-central-1`).
2. Navigate to **SQL Editor** in the Supabase Dashboard.
3. Open `supabase/migrations/20261031000000_proof_of_skill_schema.sql`.
4. Run the entire migration script.

### Protected Entities & RLS Rules
- `profiles`: Readable by everyone; candidate/recruiter owners can only update their own records.
- `skills`: Public read-only catalog.
- `assessments`: Candidates can view, create, and update only their own assessments (`auth.uid() = candidate_id`).
- `challenges`: Candidates can only view challenges assigned to their assessment; **hidden tests are strictly withheld from candidate responses**.
- `submissions`: Isolated per candidate.
- `credentials`: Publicly verifiable by `credential_id` without exposing raw private candidate records.

---

## 6. Database Migration Procedure

For CI/CD and production migrations with the Supabase CLI:

```bash
# 1. Login to Supabase CLI
npx supabase login

# 2. Link your production project
npx supabase link --project-ref <your-supabase-project-id>

# 3. Apply schema migrations
npx supabase db push
```

---

## 7. Google Gemini AI API Setup

1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Create an API Key in your Google Cloud Project.
3. Add the key to Vercel Environment Variables:
   - Key: `GEMINI_API_KEY`
   - Value: `AIzaSy...`
   - Target: Production, Preview
4. Resilient Fallbacks: If `GEMINI_API_KEY` is omitted or experiences a transient outage, the server automatically switches to certified offline challenge templates and rubric matrices without breaking the candidate assessment flow.

---

## 8. Judge0 Isolated Code Execution Setup

In production, candidate code runs in an isolated, multi-tenant sandbox provided by Judge0:

1. Subscribe to [Judge0 CE on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce) or host an instance on AWS/GCP.
2. In Vercel Environment Variables:
   - `JUDGE0_API_URL`: `https://judge0-ce.p.rapidapi.com`
   - `JUDGE0_API_KEY`: `<your-rapidapi-key>`
   - `JUDGE0_API_HOST`: `judge0-ce.p.rapidapi.com`
3. Network Resilience: The Judge0 client implements a strict 10-second bounded timeout (`AbortSignal.timeout(10000)`). If Judge0 is temporarily unavailable, candidate evaluation fails gracefully with structured diagnostics rather than hanging Vercel serverless execution.

---

## 9. Ed25519 Key Generation & Management

To generate a dedicated, production-grade Ed25519 authority keypair:

```bash
node -e "
const crypto = require('crypto');
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});
console.log('--- ED25519_PUBLIC_KEY ---');
console.log(JSON.stringify(publicKey));
console.log('--- ED25519_PRIVATE_KEY ---');
console.log(JSON.stringify(privateKey));
"
```

Copy the JSON stringified values (or multi-line PEMs) into Vercel Project Settings. Proof of Skill's `normalizeKey` utility automatically normalizes escaped `\n` characters and validates key decodability upon server boot.

---

## 10. GitHub Repository & CI/CD Setup

The repository is configured with GitHub Actions CI in `.github/workflows/ci.yml`.

### Automated Pipeline Stages
1. **Source Checkout & Node Setup:** Installs Node.js 20.x and 22.x with npm caching.
2. **Dependency Resolution:** Installs exact dependencies via `npm ci --legacy-peer-deps`.
3. **Type Checking & Linting:** Executes `npm run lint` (`tsc --noEmit`).
4. **Automated Testing:** Runs cryptographic authority unit tests, end-to-end candidate workflows, and Vercel serverless function export integration tests.
5. **Production Build:** Validates `vite build` compilation and artifact integrity.

Every pull request must pass this automated pipeline before merging to `main`.

---

## 11. Vercel Project Configuration

### Connecting GitHub to Vercel
1. Open the [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository `proofofskill`.
4. Configure Project Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install --legacy-peer-deps`
   - **Node.js Version:** `20.x` or `22.x`

### Routing, Functions & Rewrites (`vercel.json`)
The committed `vercel.json` automatically establishes:
- **Serverless Function Artifact Packaging:** Explicitly bundles `data/**` via `includeFiles` to guarantee offline/seed database hydration, and sets `maxDuration: 30` to permit bounded Gemini and Judge0 processing without timeouts.
- **Rewrites:**
  - `/api` -> `/api` (exact root API route to serverless handler)
  - `/api/(.*)` -> `/api` (routes all `/api/*` subroutes to `api/index.ts` serverless function).
  - `/(.*)` -> `/index.html` (routes all non-API paths to Vite SPA for client-side routing).
- **Asset Caching:** 1-year immutable caching (`public, max-age=31536000, immutable`) for `/assets/*`.
- **HTTP Security Headers:** Strict HSTS with preload, X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy, and tailored Content-Security-Policy permitting Monaco web workers and Google Fonts.

---

## 12. Preview Deployment Procedure

1. Push your branch to GitHub:
   ```bash
   git checkout -b feature/credential-enhancement
   git push -u origin feature/credential-enhancement
   ```
2. Open a Pull Request on GitHub.
3. GitHub Actions CI automatically runs type checks, unit tests, and production build.
4. Vercel automatically deploys a Preview Deployment with an isolated preview URL (e.g., `https://proofofskill-git-feature-credential-enhancement.vercel.app`).
5. Verify API health on the preview URL:
   - `GET /api/health`
   - `GET /api/health/integrations`

---

## 13. Production Deployment Procedure

1. Merge your approved PR into `main` (or `master`).
2. GitHub Actions runs the release validation suite.
3. Vercel automatically compiles the production build and deploys to the production domain.
4. Run post-deployment smoke tests:
   ```bash
   curl -s https://proofofskill.vercel.app/api/health
   curl -s https://proofofskill.vercel.app/api/crypto/public-key
   curl -s https://proofofskill.vercel.app/api/skills
   ```

---

## 14. Custom Domain Configuration

1. In Vercel Project Settings, navigate to **Domains**.
2. Add your custom domain (e.g., `proofofskill.io`).
3. In your DNS provider (Cloudflare, Route 53, etc.), configure DNS records:
   - `CNAME` for `www.proofofskill.io` -> `cname.vercel-dns.com`
   - `A` for `proofofskill.io` -> `76.76.21.21`
4. Update `APP_URL` in Vercel Environment Variables to `https://proofofskill.io`.

---

## 15. Rollback & Incident Recovery Procedure

If an incident occurs in production:

1. **Instant Rollback via Vercel Dashboard:**
   - Go to **Deployments**.
   - Select the last known good deployment.
   - Click the three dots (`...`) -> **Promote to Production**.
   - The rollback takes effect instantly at Vercel edge nodes without rebuilding.
2. **Key Compromise Recovery (Ed25519):**
   - Generate a new keypair using the Node command from Section 9.
   - Set `ED25519_PRIVATE_KEY`, `ED25519_PUBLIC_KEY`, and increment `PUBLIC_KEY_VERSION="v2-ed25519"`.
   - Redeploy. Historical credentials signed under `v1-ed25519` remain verifiable against public key records, while all newly minted credentials use `v2-ed25519`.

---

## 16. Troubleshooting Guide

### Issue: Build Fails with `ERESOLVE could not resolve` during install
- **Cause:** React 19 peer dependency constraints in secondary libraries.
- **Resolution:** Verify Vercel Install Command is set to `npm install --legacy-peer-deps`.

### Issue: 500 Error on Serverless API Routes
- **Cause:** Read-only filesystem writes or missing environment keys.
- **Resolution:** The platform includes an automatic `/tmp` storage fallback. Check Vercel Function Logs under **Functions** -> **Logs** for specific stack traces.

### Issue: Monaco Editor Worker Blocked by CSP
- **Cause:** Strict Content Security Policy blocking blob or CDN scripts.
- **Resolution:** The provided `vercel.json` explicitly permits `script-src https://cdn.jsdelivr.net 'unsafe-inline' 'unsafe-eval'` and `worker-src 'self' blob: https://cdn.jsdelivr.net`.

---

## 17. Production Security Checklist

- [x] Sensitive server keys (`ED25519_PRIVATE_KEY`, `GEMINI_API_KEY`, `JUDGE0_API_KEY`) are NOT prefixed with `VITE_` or `NEXT_PUBLIC_`.
- [x] `.env` files are ignored by git (`.gitignore` enforces `.env*` exclusion).
- [x] Strict Transport Security (HSTS) configured with `includeSubDomains; preload`.
- [x] X-Content-Type-Options: `nosniff` enforced.
- [x] Content-Security-Policy tailored for Monaco editor, Google fonts, and 3D canvas.
- [x] Hidden assessment tests are stripped server-side and NEVER exposed to candidates.
- [x] Candidate solutions execute in isolated sandbox runtimes with bounded CPU and memory limits.
- [x] Public credential verification verifies canonical SHA-256 evidence hashes and Ed25519 signatures without exposing private candidate data.
- [x] Automated CI pipeline prevents unverified builds from reaching production.
