# Graph Report - proofofskill  (2026-10-31)

## Corpus Check
- 39 files · ~31,642 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .lock 1)

## Summary
- 320 nodes · 657 edges · 12 communities (10 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `135b0f90`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- server.ts
- esbuild@^0.25.0
- DatabaseStore
- crypto.test.ts
- compilerOptions
- scripts
- App.tsx
- devDependencies
- LandingPage.tsx
- PROOF OF SKILL
- vite

## God Nodes (most connected - your core abstractions)
1. `DatabaseStore` - 28 edges
2. `react` - 22 edges
3. `PixelCrest()` - 21 edges
4. `MainApp()` - 16 edges
5. `compilerOptions` - 16 edges
6. `lucide-react` - 15 edges
7. `PixelPageLoader()` - 15 edges
8. `useAuth()` - 11 edges
9. `PixelSpinner()` - 10 edges
10. `api` - 10 edges

## Surprising Connections (you probably didn't know these)
- `4. Initial Execution Plan` --references--> `normalizeKey()`  [INFERRED]
  docs/REPOSITORY_AUDIT.md → server/crypto.ts
- `Finding 1: `server/crypto.ts` — PEM Key Literal `\n` Decoder Failure` --references--> `normalizeKey()`  [INFERRED]
  docs/REPOSITORY_AUDIT.md → server/crypto.ts
- `Proof of Skill — Bug Fix Log & Issue Ledger` --references--> `normalizeKey()`  [INFERRED]
  docs/BUG_FIX_LOG.md → server/crypto.ts
- `1. Executive Summary & Architecture Map` --references--> `WorkspacePage()`  [INFERRED]
  docs/REPOSITORY_AUDIT.md → src/pages/WorkspacePage.tsx
- `1. Executive Summary & Architecture Map` --references--> `ThreeCryptovault()`  [INFERRED]
  docs/REPOSITORY_AUDIT.md → src/components/ThreeCryptovault.tsx

## Import Cycles
- None detected.

## Communities (12 total, 2 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, canvas-confetti@^1.9.4, dotenv@^17.2.3, express@^4.21.2, @google/genai@^2.4.0, lucide-react@^0.546.0, @monaco-editor/react@^4.7.0, motion@^12.23.24 (+11 more)

### Community 1 - "server.ts"
Cohesion: 0.06
Nodes (44): zod@^4.6.7, zod, app, CanonicalEvidencePayload, Assessment, AuditLog, CredentialRecord, DATA_DIR (+36 more)

### Community 4 - "crypto.test.ts"
Cohesion: 0.11
Nodes (26): Proof of Skill — Bug Fix Log & Issue Ledger, canonicalizeJson(), computeSha256(), createCryptographicProof(), getPublicKey(), initCryptoKeys(), normalizeKey(), signEvidenceHash() (+18 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 7 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 8 - "App.tsx"
Cohesion: 0.09
Nodes (54): lucide-react, react, App(), MainApp(), AuthModal(), Footer(), Navbar(), NavbarProps (+46 more)

### Community 11 - "devDependencies"
Cohesion: 0.10
Nodes (27): devDependencies, autoprefixer@^10.4.21, tailwindcss@^4.3.3, tsx@^4.21.0, @types/canvas-confetti@^1.9.0, @types/express@^4.17.21, @types/node@^22.14.0, @types/qrcode@^1.5.6 (+19 more)

### Community 12 - "LandingPage.tsx"
Cohesion: 0.09
Nodes (25): 1. Executive Summary & Architecture Map, 2. Baseline Verification Results (Post-Repair), 3. Discovered Findings & Root-Cause Analysis, 4. Initial Execution Plan, Finding 1: `server/crypto.ts` — PEM Key Literal `\n` Decoder Failure, Finding 2: `server/judge0.ts` — Hardcoded `python3` Spawning on Windows, Finding 3: `package.json` — Windows Incompatibility in NPM Scripts, Finding 4: Missing `node_modules` & Sandboxed Package Installation Barrier (+17 more)

### Community 13 - "PROOF OF SKILL"
Cohesion: 0.13
Nodes (14): 1. Vision & Architecture, 2. Quickstart & Local Development, 3. Cryptographic Key Generation, 4. Supabase Setup & Migrations, 5. Automated Testing, 6. Vercel Deployment Guide, 7. Security & Integrity Guarantees, Don't Claim It. Demonstrate It. (+6 more)

### Community 17 - "vite"
Cohesion: 0.25
Nodes (6): @tailwindcss/vite@^4.3.3, vite@^8.3.0, @vitejs/plugin-react@^6.1.1, @tailwindcss/vite, vite, @vitejs/plugin-react

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `dependencies`, `devDependencies`, `LandingPage.tsx`?**
  _High betweenness centrality (0.197) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `DatabaseStore` connect `DatabaseStore` to `server.ts`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Should `server.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0593990216631726 - nodes in this community are weakly interconnected._
- **Why does `zod` connect `server.ts` to `devDependencies`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Should `DatabaseStore` be split into smaller, more focused modules?**
  _Cohesion score 0.10582010582010581 - nodes in this community are weakly interconnected._
- **Should `crypto.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1051693404634581 - nodes in this community are weakly interconnected._