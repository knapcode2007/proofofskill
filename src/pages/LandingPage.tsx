import React from 'react';
import {
  ShieldCheck,
  Code2,
  Terminal,
  Cpu,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileBadge,
  Search,
  Sparkles,
  Zap,
  Layers,
  ChevronRight,
  EyeOff,
  UserCheck,
} from 'lucide-react';

interface LandingPageProps {
  onStartAssessment: () => void;
  onVerifyCredential: () => void;
  onOpenRecruiter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onVerifyCredential,
  onOpenRecruiter,
}) => {
  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8 relative">
          {/* Hackathon Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 text-amber-300 text-xs font-medium shadow-md shadow-amber-500/5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Hacktoberfest 2026</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 font-mono">Team KAIZOKU O NAKAMA</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-100 max-w-4xl mx-auto leading-[1.1]">
            Don't Claim It.{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
              Demonstrate It.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The portable, evidence-backed Skill Passport. Candidates solve practical coding challenges in isolated sandboxes, defend architectural decisions with AI, and issue mathematically signed Ed25519 digital credentials.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartAssessment}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Skill Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onVerifyCredential}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verify a Credential</span>
            </button>
          </div>

          {/* Trust stats pill bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="text-2xl font-black text-amber-400 font-mono">Ed25519</div>
              <div className="text-xs text-zinc-400 mt-1">Cryptographic Digital Signatures</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="text-2xl font-black text-emerald-400 font-mono">Zero-Trust</div>
              <div className="text-xs text-zinc-400 mt-1">Hidden Tests Strictly Server-Side</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="text-2xl font-black text-orange-400 font-mono">AI Defense</div>
              <div className="text-xs text-zinc-400 mt-1">Adversarial Code Interrogation</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="text-2xl font-black text-cyan-400 font-mono">SHA-256</div>
              <div className="text-xs text-zinc-400 mt-1">Canonical Evidence Hashing</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE SKILL CREDIBILITY GAP */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900/50 border border-zinc-800 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
              The Problem
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
              The Developer Credibility Crisis
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Resumes claim proficiency in Python, SQL, and distributed systems. Multiple-choice certificates test rote memorization. In reality, recruiters struggle to verify if candidates can actually debug broken code, architect clean algorithms, or defend their technical decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-5 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <AlertCircle className="w-4 h-4" /> Traditional Certifications & Resumes
              </div>
              <ul className="text-xs text-zinc-400 space-y-2">
                <li>• Unverified self-reported skill bullets on PDF resumes.</li>
                <li>• Easily gameable multiple-choice quizzes without running code.</li>
                <li>• Zero proof of actual algorithmic complexity or edge case handling.</li>
                <li>• Fakeable credentials with no cryptographic signature or tamper check.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" /> The Proof of Skill Standard
              </div>
              <ul className="text-xs text-zinc-400 space-y-2">
                <li>• Real sandboxed code execution against visible and hidden test suites.</li>
                <li>• AI interrogates candidate on lines of code they actually authored.</li>
                <li>• Transparent multi-dimensional competency scoring (Debug, Logic, Quality).</li>
                <li>• Ed25519 digital signature verified mathematically by any recruiter in 1 second.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE 4-STEP WORKFLOW */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
            End-To-End Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
            Solve → Validate → Defend → Verify
          </h2>
          <p className="text-sm text-zinc-400">
            An unbroken chain of evidence from code keystrokes to digital signatures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-amber-500/50 transition group space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-lg group-hover:bg-amber-500 group-hover:text-zinc-950 transition">
              01
            </div>
            <h3 className="text-lg font-bold text-zinc-100">AI Challenge & Solve</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Google Gemini generates realistic practical challenges based on skill and difficulty. Candidates code in a Monaco editor.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-amber-500/50 transition group space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-mono font-bold text-lg group-hover:bg-orange-500 group-hover:text-zinc-950 transition">
              02
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Isolated Test Suite</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Code executes in external sandboxes against visible tests and confidential hidden tests. Metrics like runtime and memory are measured.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-amber-500/50 transition group space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-lg group-hover:bg-purple-500 group-hover:text-zinc-950 transition">
              03
            </div>
            <h3 className="text-lg font-bold text-zinc-100">AI Code Defense</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              AI reviews candidate's submitted source code and generates 2-3 deep architectural and algorithmic defense questions evaluated with a rubric.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-amber-500/50 transition group space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg group-hover:bg-emerald-500 group-hover:text-zinc-950 transition">
              04
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Ed25519 Proof & Verify</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Canonical evidence is hashed with SHA-256 and signed with Ed25519. Recruiters verify authenticity via instant public QR links.
            </p>
          </div>
        </div>
      </section>

      {/* 4. RECRUITER & CANDIDATE DUAL VALUE PROPOSITIONS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Candidates */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 space-y-5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileBadge className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-100">For Candidates</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Stop relying on resume buzzwords. Build a permanent, portable digital portfolio backed by mathematical cryptography that proves you can build real software.
            </p>
            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Shareable digital card with embedded QR code.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Transparent competency meters across 6 engineering dimensions.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Demonstrate defense reasoning, not just passing tests.</span>
              </div>
            </div>
            <button
              onClick={onStartAssessment}
              className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition"
            >
              <span>Begin Your First Assessment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* For Recruiters */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 space-y-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-100">For Hiring Teams & Recruiters</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Eliminate technical screening guesswork. Inspect cryptographically verified evidence records without needing access to private candidate code.
            </p>
            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-login public verification link checks Ed25519 signatures.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant tampering detection: even 1 modified byte invalidates proof.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Revocation registry prevents reuse of outdated or revoked credentials.</span>
              </div>
            </div>
            <button
              onClick={onOpenRecruiter}
              className="mt-4 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center gap-2 transition"
            >
              <span>Explore Recruiter Portal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-600/20 via-orange-600/10 to-zinc-900 border border-amber-500/30 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-100 tracking-tight">
            Ready to Prove Your Technical Merit?
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            Choose from Python Debugging, System Programming, Data Analysis, or SQL. Take the assessment in 15 minutes.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={onStartAssessment}
              className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Select a Skill & Start</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
