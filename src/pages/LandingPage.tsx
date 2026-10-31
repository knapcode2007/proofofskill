import React, { useState } from 'react';
import {
  PixelCrest,
  PixelTerminalVisual,
  VisualPipeline,
  CompetencyRadar,
} from '../components/PixelVisuals';
import { PixelProofIllustration } from '../components/PixelProofIllustration';
import { ThreeCryptovault } from '../components/ThreeCryptovault';
import { ArrowRight, ShieldCheck, Key, Lock, CheckCircle2, Terminal } from 'lucide-react';

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
  const [activePipelineStep, setActivePipelineStep] = useState<number>(1);

  const sampleRadarScores = {
    logical_thinking: 96,
    debugging: 94,
    problem_solving: 98,
    code_quality: 88,
    edge_case_handling: 92,
    technical_understanding: 90,
  };

  return (
    <div className="space-y-32 sm:space-y-40 pb-36">
      {/* 1. HERO SECTION (Ample negative space, high contrast, pixel typography) */}
      <section className="relative pt-16 sm:pt-24 lg:pt-28 pb-12 bg-pixel-grid">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 space-y-16">
          {/* Header Lockup */}
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-3">
              <div className="font-pixel text-xs text-amber-400 tracking-widest uppercase">
                PORTABLE SKILL PASSPORT // ED25519 VERIFICATION
              </div>
              <h1 className="font-pixel text-3xl sm:text-5xl lg:text-6xl text-zinc-100 tracking-tight leading-tight">
                DON'T CLAIM IT.{' '}
                <span className="text-amber-400 block sm:inline">DEMONSTRATE IT.</span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-mono leading-relaxed">
              Solve real engineering challenges in isolated runtimes. Interrogate implementation logic with AI defense. Mint cryptographically signed, tamper-evident Skill Passports.
            </p>

            {/* CTAs with stepped pixel buttons and generous negative space */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
              <button
                onClick={onStartAssessment}
                className="w-full sm:w-auto px-8 py-3.5 pixel-btn-primary text-xs tracking-wider cursor-reactive-target flex items-center justify-center gap-2"
              >
                <span>START ASSESSMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onVerifyCredential}
                className="w-full sm:w-auto px-8 py-3.5 pixel-btn-secondary text-xs tracking-wider cursor-reactive-target flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>VERIFY CREDENTIAL</span>
              </button>
            </div>
          </div>

          {/* Large Responsive Pixel-Art Hero Illustration (Proof of Skill Concept) */}
          <div className="pt-2">
            <PixelProofIllustration />
          </div>

          {/* Quick Metrics Strip (Pixel Card Container with Clean Alignment) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-8 pixel-card text-center space-y-1.5">
              <div className="font-pixel text-xl sm:text-2xl text-amber-400">Ed25519</div>
              <div className="font-mono text-[11px] text-zinc-400 uppercase">SIGNATURES</div>
            </div>
            <div className="p-8 pixel-card text-center space-y-1.5">
              <div className="font-pixel text-xl sm:text-2xl text-emerald-400">0-TRUST</div>
              <div className="font-mono text-[11px] text-zinc-400 uppercase">HIDDEN TESTS</div>
            </div>
            <div className="p-8 pixel-card text-center space-y-1.5">
              <div className="font-pixel text-xl sm:text-2xl text-amber-400">GEMINI</div>
              <div className="font-mono text-[11px] text-zinc-400 uppercase">AI CODE DEFENSE</div>
            </div>
            <div className="p-8 pixel-card text-center space-y-1.5">
              <div className="font-pixel text-xl sm:text-2xl text-cyan-400">SHA-256</div>
              <div className="font-mono text-[11px] text-zinc-400 uppercase">CANONICAL HASH</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE.JS 3D CRYPTOGRAPHIC VAULT INSPECTOR */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <span className="font-pixel text-xs text-amber-400 tracking-wider">HARDWARE MATRIX</span>
            <h2 className="font-pixel text-xl sm:text-2xl text-zinc-100">
              3D CRYPTOGRAPHIC MERKLE ENGINE
            </h2>
          </div>
          <span className="font-mono text-xs text-zinc-400">
            EXPLODE • ROTATE • DISSECT Ed25519 ROTOR
          </span>
        </div>

        {/* Mounted Three.js Cryptovault Scene */}
        <ThreeCryptovault />
      </section>

      {/* 3. VISUAL PIPELINE WORKFLOW (Interactive visual flow over text) */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <span className="font-pixel text-xs text-amber-400 tracking-wider">PIPELINE</span>
            <h2 className="font-pixel text-xl sm:text-2xl text-zinc-100">
              FOUR-STEP VERIFICATION CYCLE
            </h2>
          </div>
          <span className="font-mono text-xs text-zinc-400">SELECT PHASE TO INSPECT</span>
        </div>

        {/* 4-Phase interactive cards */}
        <VisualPipeline
          activeStep={activePipelineStep}
          onStepSelect={(s) => setActivePipelineStep(s)}
        />

        {/* Dynamic Visual Stage Inspector in Pixel Card */}
        <div className="p-8 sm:p-10 pixel-card min-h-[240px] flex flex-col justify-center">
          {activePipelineStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs text-amber-400">PHASE 01 • SYNTHESIS</span>
                <span className="font-mono text-xs text-zinc-400">GEMINI 3.8 FLASH</span>
              </div>
              <div className="font-mono text-xs text-zinc-300 border-l-2 border-amber-500 pl-4 py-1.5 space-y-1.5">
                <div className="text-zinc-400">TARGET: Python Debugging [Intermediate]</div>
                <div>Generating realistic concurrency hazard & LRU cache eviction bug...</div>
                <div className="text-emerald-400">✓ 2 Visible Test Harnesses Generated</div>
                <div className="text-amber-400">✓ 2 Confidential Server Hidden Test Cases Encrypted</div>
              </div>
            </div>
          )}

          {activePipelineStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs text-amber-400">PHASE 02 • SANDBOX EXECUTION</span>
                <span className="font-mono text-xs text-zinc-400">5000MS TIMEOUT • 128MB LIMIT</span>
              </div>
              <PixelTerminalVisual />
            </div>
          )}

          {activePipelineStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs text-amber-400">PHASE 03 • AI CODE DEFENSE</span>
                <span className="font-mono text-xs text-zinc-400">ADVERSARIAL RUBRIC</span>
              </div>
              <div className="font-mono text-xs text-zinc-300 border-l-2 border-amber-500 pl-4 py-1.5 space-y-1.5">
                <div className="text-amber-300">
                  "Explain your time complexity in get() and put() methods. How does your OrderedDict structure scale?"
                </div>
                <div className="text-zinc-400 text-[11px] pt-1">
                  Candidate response evaluated against standardized rubric for Big-O scaling, trade-offs, and boundary hazards.
                </div>
              </div>
            </div>
          )}

          {activePipelineStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs text-amber-400">PHASE 04 • Ed25519 PROOF</span>
                <span className="font-mono text-xs text-emerald-400">STATUS: VALID</span>
              </div>
              <div className="font-mono text-xs text-zinc-400 space-y-1.5 bg-black/60 p-5 border border-zinc-800">
                <div>CANONICAL SHA-256: 3b07abdeeeb2858239f0c0b05f17d7213cf73bdca6c19f...</div>
                <div>Ed25519 SIGNATURE: pmq0MPS0McAuB6dRKxA4tq6krGWWdXMXl+l3zCgG2YJIiFQ...</div>
                <div className="text-emerald-400 pt-1">PUBLIC VERIFICATION URL GENERATED WITH SCANNER QR</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. VISUAL TELEMETRY & COMPETENCY RADAR (Visuals replacing text descriptions) */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 space-y-10">
        <div className="border-b border-zinc-800 pb-5">
          <span className="font-pixel text-xs text-amber-400 tracking-wider">RADAR</span>
          <h2 className="font-pixel text-xl sm:text-2xl text-zinc-100 mt-1">
            SIX-DIMENSIONAL MERIT EVALUATION
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pixel-card p-8 sm:p-12">
          {/* Left: SVG Radar visualization */}
          <div className="flex justify-center">
            <CompetencyRadar scores={sampleRadarScores} size={280} />
          </div>

          {/* Right: Clean minimal score readout */}
          <div className="space-y-5">
            <div className="font-pixel text-xs text-zinc-400 uppercase tracking-widest">
              DETERMINISTIC & QUALITATIVE MATRIX
            </div>
            <div className="grid grid-cols-2 gap-3.5 text-xs font-mono">
              <div className="p-3.5 border border-zinc-800 bg-zinc-950/60">
                <div className="text-zinc-500 text-[10px]">LOGIC</div>
                <div className="text-base font-bold text-amber-400 font-pixel">96%</div>
              </div>
              <div className="p-3.5 border border-zinc-800 bg-zinc-950/60">
                <div className="text-zinc-500 text-[10px]">DEBUGGING</div>
                <div className="text-base font-bold text-amber-400 font-pixel">94%</div>
              </div>
              <div className="p-3.5 border border-zinc-800 bg-zinc-950/60">
                <div className="text-zinc-500 text-[10px]">SOLVING</div>
                <div className="text-base font-bold text-emerald-400 font-pixel">98%</div>
              </div>
              <div className="p-3.5 border border-zinc-800 bg-zinc-950/60">
                <div className="text-zinc-500 text-[10px]">CODE QUALITY</div>
                <div className="text-base font-bold text-zinc-200 font-pixel">88%</div>
              </div>
              <div className="p-3.5 border border-zinc-800 bg-zinc-950/60">
                <div className="text-zinc-500 text-[10px]">EDGE CASES</div>
                <div className="text-base font-bold text-emerald-400 font-pixel">92%</div>
              </div>
              <div className="p-3.5 border border-zinc-800 bg-zinc-950/60">
                <div className="text-zinc-500 text-[10px]">AI DEFENSE</div>
                <div className="text-base font-bold text-amber-400 font-pixel">90%</div>
              </div>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 pt-2">
              Zero resume claims. Every score is mathematically linked to code execution and defense answers.
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION (Minimal, airy negative space) */}
      <section className="max-w-4xl mx-auto px-6 sm:px-10 text-center space-y-8 pt-8">
        <h2 className="font-pixel text-2xl sm:text-3xl text-zinc-100">
          PROVE YOUR MERIT
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button
            onClick={onStartAssessment}
            className="w-full sm:w-auto px-9 py-4 pixel-btn-primary text-xs tracking-wider cursor-reactive-target"
          >
            START ASSESSMENT
          </button>
          <button
            onClick={onOpenRecruiter}
            className="w-full sm:w-auto px-8 py-4 pixel-btn-secondary text-xs tracking-wider cursor-reactive-target"
          >
            RECRUITER PORTAL
          </button>
        </div>
      </section>
    </div>
  );
};
