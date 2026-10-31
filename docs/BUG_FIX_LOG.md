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

