# Graph Report - proofofskill  (2026-10-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 255 nodes · 479 edges · 8 communities (7 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1daadce6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- server.ts
- index.ts
- DatabaseStore
- crypto.test.ts
- App.tsx
- compilerOptions
- scripts

## God Nodes (most connected - your core abstractions)
1. `DatabaseStore` - 28 edges
2. `react` - 17 edges
3. `compilerOptions` - 16 edges
4. `MainApp()` - 15 edges
5. `lucide-react` - 15 edges
6. `useAuth()` - 11 edges
7. `api` - 10 edges
8. `scripts` - 8 edges
9. `CredentialRecord` - 7 edges
10. `canonicalizeJson()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `ProofCardProps` --references--> `CredentialRecord`  [EXTRACTED]
  src/components/ProofCard.tsx → src/types/index.ts
- `ProofPage()` --calls--> `ProofCard()`  [EXTRACTED]
  src/pages/ProofPage.tsx → src/components/ProofCard.tsx
- `CredentialRecord` --references--> `CanonicalEvidencePayload`  [EXTRACTED]
  server/db.ts → server/crypto.ts
- `CredentialRecord` --references--> `CompetencyBreakdown`  [EXTRACTED]
  server/db.ts → server/gemini.ts
- `DefenseSession` --references--> `DefenseEvaluation`  [EXTRACTED]
  server/db.ts → server/gemini.ts

## Import Cycles
- None detected.

## Communities (8 total, 1 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (52): dependencies, canvas-confetti@^1.9.4, dotenv@^17.2.3, express@^4.21.2, @google/genai@^2.4.0, lucide-react@^0.546.0, @monaco-editor/react@^4.7.0, motion@^12.23.24 (+44 more)

### Community 1 - "server.ts"
Cohesion: 0.06
Nodes (44): zod@^4.6.7, zod, app, CanonicalEvidencePayload, Assessment, AuditLog, CredentialRecord, DATA_DIR (+36 more)

### Community 2 - "index.ts"
Cohesion: 0.13
Nodes (29): lucide-react, react, ProofCard(), ProofCardProps, AuthContext, AuthContextType, api, DashboardPageProps (+21 more)

### Community 4 - "crypto.test.ts"
Cohesion: 0.12
Nodes (21): canonicalizeJson(), computeSha256(), createCryptographicProof(), getPublicKey(), initCryptoKeys(), signEvidenceHash(), verifyEvidenceSignature(), hash1 (+13 more)

### Community 5 - "App.tsx"
Cohesion: 0.17
Nodes (18): App(), MainApp(), AuthModal(), Footer(), Navbar(), NavbarProps, AuthProvider(), useAuth() (+10 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 7 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, lint, preview, start, test

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DatabaseStore` connect `DatabaseStore` to `server.ts`?**
  _High betweenness centrality (0.185) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.052525252525252523 - nodes in this community are weakly interconnected._
- **Why does `react` connect `index.ts` to `package.json`, `App.tsx`?**
  _High betweenness centrality (0.184) - this node is a cross-community bridge._
- **Should `server.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05870020964360587 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `index.ts` to `package.json`, `App.tsx`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1254355400696864 - nodes in this community are weakly interconnected._
- **Should `DatabaseStore` be split into smaller, more focused modules?**
  _Cohesion score 0.10582010582010581 - nodes in this community are weakly interconnected._