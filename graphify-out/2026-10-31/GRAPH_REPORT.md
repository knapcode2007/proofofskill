# Graph Report - proofofskill  (2026-10-31)

## Corpus Check
- 36 files · ~29,423 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .lock 1)

## Summary
- 301 nodes · 610 edges · 22 communities (17 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8d205a71`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- db.ts
- index.ts
- DatabaseStore
- crypto.test.ts
- App.tsx
- compilerOptions
- scripts
- PixelLoader.tsx
- react
- server.ts
- devDependencies
- LandingPage.tsx
- PROOF OF SKILL
- gemini.ts
- judge0.ts
- package.json
- vite
- react-dom
- tailwindcss@^4.3.3
- @types/react-dom@^19.3.0
- typescript@^7.0.2

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
- `MainApp()` --calls--> `DefensePage()`  [EXTRACTED]
  src/App.tsx → src/pages/DefensePage.tsx
- `MainApp()` --calls--> `LandingPage()`  [EXTRACTED]
  src/App.tsx → src/pages/LandingPage.tsx
- `MainApp()` --calls--> `ProofPage()`  [EXTRACTED]
  src/App.tsx → src/pages/ProofPage.tsx
- `MainApp()` --calls--> `SkillSelectionPage()`  [EXTRACTED]
  src/App.tsx → src/pages/SkillSelectionPage.tsx
- `MainApp()` --calls--> `VerifyPage()`  [EXTRACTED]
  src/App.tsx → src/pages/VerifyPage.tsx

## Import Cycles
- None detected.

## Communities (22 total, 5 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, dotenv@^17.2.3, express@^4.21.2, @google/genai@^2.4.0, lucide-react@^0.546.0, @monaco-editor/react@^4.7.0, motion@^12.23.24, qrcode@^1.5.4 (+9 more)

### Community 1 - "db.ts"
Cohesion: 0.12
Nodes (19): CanonicalEvidencePayload, Assessment, AuditLog, CredentialRecord, DATA_DIR, DatabaseSchema, db, DB_FILE (+11 more)

### Community 2 - "index.ts"
Cohesion: 0.19
Nodes (14): AuthContext, AuthContextType, WorkspacePageProps, Assessment, AssessmentRunSummary, Challenge, CompetencyBreakdown, DefenseEvaluation (+6 more)

### Community 4 - "crypto.test.ts"
Cohesion: 0.12
Nodes (14): hash1, hash2, isTamperedValid, isValid, jsonA, jsonB, objA, objB (+6 more)

### Community 5 - "App.tsx"
Cohesion: 0.25
Nodes (12): App(), MainApp(), AuthModal(), Footer(), Navbar(), ClickWave, ReactiveCursor(), AuthProvider() (+4 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 7 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

### Community 8 - "PixelLoader.tsx"
Cohesion: 0.17
Nodes (16): PixelLoadingBar(), PixelLoadingBarProps, PixelPageLoader(), PixelPageLoaderProps, PixelSpinner(), PixelSpinnerProps, DefensePage(), DefensePageProps (+8 more)

### Community 9 - "react"
Cohesion: 0.26
Nodes (12): lucide-react, react, NavbarProps, PixelCrest(), ProofCard(), ProofCardProps, api, DashboardPageProps (+4 more)

### Community 10 - "server.ts"
Cohesion: 0.18
Nodes (12): app, canonicalizeJson(), computeSha256(), createCryptographicProof(), getPublicKey(), initCryptoKeys(), normalizeKey(), signEvidenceHash() (+4 more)

### Community 11 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, autoprefixer@^10.4.21, esbuild@^0.25.0, tsx@^4.21.0, @types/express@^4.17.21, @types/node@^22.14.0, @types/qrcode@^1.5.6, @types/react@^19.3.0 (+9 more)

### Community 12 - "LandingPage.tsx"
Cohesion: 0.19
Nodes (13): PixelProofIllustration(), CompetencyRadar(), PixelTerminalVisual(), VisualPipeline(), _camTarget, _tempPos, ThreeCryptovault(), afterDraw() (+5 more)

### Community 13 - "PROOF OF SKILL"
Cohesion: 0.13
Nodes (14): 1. Vision & Architecture, 2. Quickstart & Local Development, 3. Cryptographic Key Generation, 4. Supabase Setup & Migrations, 5. Automated Testing, 6. Vercel Deployment Guide, 7. Security & Integrity Guarantees, Don't Claim It. Demonstrate It. (+6 more)

### Community 14 - "gemini.ts"
Cohesion: 0.17
Nodes (11): zod@^4.6.7, zod, calculateCompetencies(), ChallengeSchema, CompetencyBreakdownSchema, DefenseEvaluationSchema, DefenseQuestionSchema, evaluateDefenseAnswer() (+3 more)

### Community 15 - "judge0.ts"
Cohesion: 0.23
Nodes (10): TestCaseSchema, executeIsolatedCode(), executeWithJudge0(), executeWithLocalPython(), ExecutionResult, getExecutionProviderStatus(), runSingleTestCase(), runTestCases() (+2 more)

### Community 16 - "package.json"
Cohesion: 0.22
Nodes (8): canvas-confetti@^1.9.4, @types/canvas-confetti@^1.9.0, name, private, type, version, canvas-confetti, @types/canvas-confetti

### Community 17 - "vite"
Cohesion: 0.25
Nodes (6): @tailwindcss/vite@^4.3.3, vite@^8.3.0, @vitejs/plugin-react@^6.1.1, @tailwindcss/vite, vite, @vitejs/plugin-react

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `dependencies`, `index.ts`, `App.tsx`, `PixelLoader.tsx`, `LandingPage.tsx`, `package.json`?**
  _High betweenness centrality (0.214) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `DatabaseStore` connect `DatabaseStore` to `db.ts`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12380952380952381 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `dependencies`, `index.ts`, `App.tsx`, `PixelLoader.tsx`, `LandingPage.tsx`, `package.json`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Should `DatabaseStore` be split into smaller, more focused modules?**
  _Cohesion score 0.10582010582010581 - nodes in this community are weakly interconnected._
- **Should `crypto.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._