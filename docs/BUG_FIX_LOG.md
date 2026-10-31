# Proof of Skill — Bug Fix Log & Issue Ledger
**Audit Tracking System (Antigravity Master Prompt V2)**

| ID | Description | Severity | Evidence | Root Cause | Status | Validation Command | Commit Hash |
|---|---|---|---|---|---|---|---|
| **BUG-001** | `server/crypto.ts`: PEM Key Decoder fails on literal `\n` in `.env` | P0 | `error:1E08010C:DECODER routines::unsupported` from `crypto.createPrivateKey` | `normalizeKey` fails to unescape `\\n` when string contains `BEGIN` | VERIFIED | `npm test` (test 6: PEM key normalization) | 135b0f9 |
| **BUG-002** | `server/judge0.ts`: Local Python sandbox fails with `EACCES` on Windows | P1 | `ERROR: EACCES spawn python3 EACCES` | Hardcoded `python3` command fails on Windows | VERIFIED | `npm test` (e2e workflow test 4: isolated sandbox) | 135b0f9 |
| **BUG-003** | `package.json`: NPM scripts fail on Windows shells (`rm -rf`, inline `NODE_ENV`) | P2 | PowerShell/CMD error: `The term 'rm' is not recognized` | POSIX-only shell syntax in `clean` and `start` scripts | VERIFIED | `npm run clean`, `npm run build` | 135b0f9 |
| **BUG-004** | Missing `node_modules`: Dependencies not installed | P0 | `node_modules` directory missing; `tsc`, `vite`, `tsx` unavailable | Sandbox isolates network; requires one-time unsandboxed install | VERIFIED | `node -e "require('fs').existsSync('node_modules')"` | 135b0f9 |
| **BUG-005** | `.env`: Incomplete configuration (`GEMINI_API_KEY` omitted) | P3 | `.env` has only crypto keys; lacks Gemini and URL configs | Template `.env.example` not fully synchronized | ACCEPTED LIMITATION | Certified challenge templates operational without key | N/A |
| **BUG-006** | NPM `ERESOLVE`: Peer dependency strictness conflict on Vite | P1 | `npm error ERESOLVE unable to resolve dependency tree: peer vite from @tailwindcss/vite` | npm 11 strict peer resolution conflicts with bun.lock peer tree | VERIFIED | `npm install --legacy-peer-deps` | 135b0f9 |
| **DEP-001** | `server.ts` & `server/db.ts`: Incompatible with Vercel Serverless (port collisions & lambda `EROFS`) | P0 | `EROFS: read-only file system` on `/var/task` + port bind errors | Persistent port listen and static writes to local disk | VERIFIED | `tsx tests/serverless_export.test.ts` | ae52fe0 |
| **DEP-002** | `server/gemini.ts` & `server/judge0.ts`: Unbounded external API execution latency | P1 | Risk of 504 Gateway Timeouts on Vercel | Missing abort signals / execution timeouts on external fetch | VERIFIED | `AbortSignal.timeout(10000)` and 15s deadline wrappers | ae52fe0 |
| **DEP-003** | `vite.config.ts`: Client bundle chunk size exceeded 500 kB limit | P2 | Monolithic `index-CrDsqKzn.js` (978 kB) warning on `vite build` | Default Vite single-chunk bundling without vendor split | VERIFIED | `vite build` (main bundle reduced 61.3% to 378 kB) | ae52fe0 |
| **DEP-004** | Missing `vercel.json`: Missing Vercel routing, file tracing & security headers | P1 | Serverless functions fail to locate seed data; missing HSTS/CSP | Unconfigured Vercel deployment manifest | VERIFIED | `vercel.json` schema & function tracing verified | ae52fe0 |
| **DEP-005** | Missing CI/CD: No automated validation pipeline for GitHub | P2 | Manual verification required on pull requests | Missing GitHub Actions workflow | VERIFIED | `.github/workflows/ci.yml` matrix pipeline configured | ae52fe0 |

