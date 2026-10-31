# Graph Report - proofofskill  (2026-10-31)

## Corpus Check
- 45 files · ~36,932 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .lock 1)

## Summary
- 420 nodes · 777 edges · 16 communities (15 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f284199d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- server.ts
- Proof of Skill — Vercel Production Deployment Guide
- DatabaseStore
- crypto.test.ts
- validate
- compilerOptions
- scripts
- App.tsx
- normalizeKey
- vercel.json
- devDependencies
- LandingPage.tsx
- PROOF OF SKILL
- Proof of Skill — Production Readiness & Vercel Verification Report
- vite

## God Nodes (most connected - your core abstractions)
1. `DatabaseStore` - 28 edges
2. `react` - 22 edges
3. `PixelCrest()` - 21 edges
4. `Proof of Skill — Vercel Production Deployment Guide` - 19 edges
5. `MainApp()` - 16 edges
6. `compilerOptions` - 16 edges
7. `lucide-react` - 15 edges
8. `PixelPageLoader()` - 15 edges
9. `useAuth()` - 11 edges
10. `2. Confirmed Deployment Blockers & Root-Cause Resolutions` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Proof of Skill — Bug Fix Log & Issue Ledger` --references--> `normalizeKey()`  [INFERRED]
  docs/BUG_FIX_LOG.md → server/crypto.ts
- `9. Ed25519 Key Generation & Management` --references--> `normalizeKey()`  [INFERRED]
  docs/DEPLOYMENT_GUIDE.md → server/crypto.ts
- `4. Initial Execution Plan` --references--> `normalizeKey()`  [INFERRED]
  docs/REPOSITORY_AUDIT.md → server/crypto.ts
- `Finding 1: `server/crypto.ts` — PEM Key Literal `\n` Decoder Failure` --references--> `normalizeKey()`  [INFERRED]
  docs/REPOSITORY_AUDIT.md → server/crypto.ts
- `Problem 7: Static Module Import Order in `server.ts` Nullifying Gemini API Client` --references--> `getAiClient()`  [INFERRED]
  docs/PRODUCTION_READINESS_REPORT.md → server/gemini.ts

## Import Cycles
- None detected.

## Communities (16 total, 1 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, canvas-confetti@^1.9.4, dotenv@^17.2.3, express@^4.21.2, @google/genai@^2.4.0, lucide-react@^0.546.0, @monaco-editor/react@^4.7.0, motion@^12.23.24 (+11 more)

### Community 1 - "server.ts"
Cohesion: 0.05
Nodes (52): 2. Confirmed Deployment Blockers & Root-Cause Resolutions, Problem 10: Missing Serverless Function Packaging Configuration for Seed Database, Problem 3: Unbounded External Fetch Calls (Judge0), Problem 4: Main JavaScript Bundle Size Exceeding 500 kB, Problem 5: Missing Vercel Routing Configuration & Headers, Problem 6: Global Express Rewrite Middleware Corrupting Frontend SPA Routes & Vite Dev Assets, Problem 7: Static Module Import Order in `server.ts` Nullifying Gemini API Client, Problem 8: Unbounded Latency on Gemini Content Generation (+44 more)

### Community 2 - "Proof of Skill — Vercel Production Deployment Guide"
Cohesion: 0.07
Nodes (27): 10. GitHub Repository & CI/CD Setup, 11. Vercel Project Configuration, 12. Preview Deployment Procedure, 13. Production Deployment Procedure, 14. Custom Domain Configuration, 15. Rollback & Incident Recovery Procedure, 16. Troubleshooting Guide, 17. Production Security Checklist (+19 more)

### Community 4 - "crypto.test.ts"
Cohesion: 0.07
Nodes (35): handler(), app, canonicalizeJson(), computeSha256(), createCryptographicProof(), getPublicKey(), initCryptoKeys(), signEvidenceHash() (+27 more)

### Community 5 - "validate"
Cohesion: 0.08
Nodes (23): concurrency, cancel-in-progress, group, jobs, validate, node-version, name, on (+15 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 7 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 8 - "App.tsx"
Cohesion: 0.09
Nodes (55): lucide-react, react, App(), MainApp(), AuthModal(), Footer(), Navbar(), NavbarProps (+47 more)

### Community 9 - "normalizeKey"
Cohesion: 0.14
Nodes (13): Proof of Skill — Bug Fix Log & Issue Ledger, 9. Ed25519 Key Generation & Management, 1. Executive Summary & Architecture Map, 2. Baseline Verification Results (Post-Repair), 3. Discovered Findings & Root-Cause Analysis, 4. Initial Execution Plan, Finding 1: `server/crypto.ts` — PEM Key Literal `\n` Decoder Failure, Finding 2: `server/judge0.ts` — Hardcoded `python3` Spawning on Windows (+5 more)

### Community 10 - "vercel.json"
Cohesion: 0.18
Nodes (10): includeFiles, maxDuration, buildCommand, framework, functions, api/index.ts, headers, outputDirectory (+2 more)

### Community 11 - "devDependencies"
Cohesion: 0.09
Nodes (29): devDependencies, autoprefixer@^10.4.21, esbuild@^0.25.0, tailwindcss@^4.3.3, tsx@^4.21.0, @types/canvas-confetti@^1.9.0, @types/express@^4.17.21, @types/node@^22.14.0 (+21 more)

### Community 12 - "LandingPage.tsx"
Cohesion: 0.17
Nodes (14): three@^0.187.0, three, PixelProofIllustration(), PixelTerminalVisual(), VisualPipeline(), _camTarget, _tempPos, ThreeCryptovault() (+6 more)

### Community 13 - "PROOF OF SKILL"
Cohesion: 0.13
Nodes (14): 1. Vision & Architecture, 2. Quickstart & Local Development, 3. Cryptographic Key Generation, 4. Supabase Setup & Migrations, 5. Automated Testing, 6. Vercel Deployment Guide, 7. Security & Integrity Guarantees, Don't Claim It. Demonstrate It. (+6 more)

### Community 14 - "Proof of Skill — Production Readiness & Vercel Verification Report"
Cohesion: 0.22
Nodes (8): 1. Executive Summary & Production Status, 3. Verification Test Record, 4. External Integrations Assessment, 5. Security & Isolation Matrix, 6. Deployment Prerequisites Checklist for Production Release, Deep Verification (Executed Test Suites), Proof of Skill — Production Readiness & Vercel Verification Report, Static Analysis & Build Record

### Community 17 - "vite"
Cohesion: 0.18
Nodes (8): Problem 1: Monolithic Server Architecture Incompatible with Vercel Serverless, @tailwindcss/vite@^4.3.3, vite@^8.3.0, @vitejs/plugin-react@^6.1.1, @tailwindcss/vite, vite, @vitejs/plugin-react, bootstrapServer()

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `dependencies`, `devDependencies`, `LandingPage.tsx`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `normalizeKey()` connect `normalizeKey` to `crypto.test.ts`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Should `server.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05143191116306254 - nodes in this community are weakly interconnected._
- **Why does `Proof of Skill — Vercel Production Deployment Guide` connect `Proof of Skill — Vercel Production Deployment Guide` to `normalizeKey`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Should `Proof of Skill — Vercel Production Deployment Guide` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `DatabaseStore` be split into smaller, more focused modules?**
  _Cohesion score 0.10344827586206896 - nodes in this community are weakly interconnected._