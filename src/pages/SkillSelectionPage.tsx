import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Skill } from '../types';
import {
  Sparkles,
  Bug,
  Code,
  BarChart3,
  Database,
  Globe,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Terminal,
  Cpu,
} from 'lucide-react';

interface SkillSelectionPageProps {
  onAssessmentStarted: (assessmentId: string) => void;
  onCancel: () => void;
}

const SKILL_ICONS: Record<string, React.ReactNode> = {
  'python-debugging': <Bug className="w-6 h-6 text-amber-400" />,
  'python-programming': <Code className="w-6 h-6 text-orange-400" />,
  'data-analysis': <BarChart3 className="w-6 h-6 text-cyan-400" />,
  sql: <Database className="w-6 h-6 text-purple-400" />,
  'web-dev': <Globe className="w-6 h-6 text-emerald-400" />,
  javascript: <Layers className="w-6 h-6 text-yellow-400" />,
};

export const SkillSelectionPage: React.FC<SkillSelectionPageProps> = ({
  onAssessmentStarted,
  onCancel,
}) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>('python-debugging');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getSkills().then((res) => {
      setSkills(res.skills);
      if (res.skills.length > 0) {
        setSelectedSkillId(res.skills[0].id);
      }
    });
  }, []);

  const handleStart = async () => {
    setError(null);
    setIsGenerating(true);
    try {
      setGenerationStep('Initializing secure assessment record in database...');
      const res = await api.createAssessment(selectedSkillId, selectedDifficulty, 'python');
      const assessmentId = res.assessment.id;

      setGenerationStep('Calling Gemini AI to craft tailored problem & isolated test suites...');
      await api.generateChallenge(assessmentId);

      setGenerationStep('Finalizing sandbox execution environment...');
      setTimeout(() => {
        onAssessmentStarted(assessmentId);
      }, 500);
    } catch (err: any) {
      console.error('[SkillSelection] Error starting assessment:', err);
      setError(err.message || 'Failed to start assessment. Please check backend status.');
      setIsGenerating(false);
    }
  };

  const currentSkill = skills.find((s) => s.id === selectedSkillId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 of 4 • Skill & Proficiency Selection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
          Select Your Competency Domain
        </h1>
        <p className="text-sm text-zinc-400">
          Choose the skill you wish to demonstrate. Gemini will generate a unique practical problem with automated visible and hidden test criteria.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* 1. Skill Selection Grid */}
      <div className="space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
          Available Technical Domains
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => {
            const isSelected = skill.id === selectedSkillId;
            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkillId(skill.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                    {SKILL_ICONS[skill.id] || <Code className="w-6 h-6 text-amber-400" />}
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-zinc-100 text-base">{skill.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-800/80">
                  Target Language: <span className="text-zinc-300 font-semibold">{skill.supported_language}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Difficulty Level */}
      <div className="space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
          Proficiency Tier
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              level: 'Beginner' as const,
              tag: 'Foundational Mastery',
              time: '~15-20 min',
              desc: 'Core syntax, fundamental algorithms, basic edge cases.',
            },
            {
              level: 'Intermediate' as const,
              tag: 'Production Ready',
              time: '~25-35 min',
              desc: 'Optimal time/space bounds, cache eviction, concurrency faults.',
            },
            {
              level: 'Advanced' as const,
              tag: 'Systems Architect',
              time: '~40-50 min',
              desc: 'Distributed systems logic, high-throughput scaling, subtle boundary hazards.',
            },
          ].map((tier) => {
            const isSelected = selectedDifficulty === tier.level;
            return (
              <div
                key={tier.level}
                onClick={() => setSelectedDifficulty(tier.level)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/40'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-100 text-base">{tier.level}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {tier.time}
                  </span>
                </div>
                <div className="text-xs text-amber-400 font-medium">{tier.tag}</div>
                <p className="text-xs text-zinc-400">{tier.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Summary & Launch Action */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="text-xs text-zinc-400 uppercase font-semibold">Configured Assessment</div>
          <div className="font-extrabold text-xl text-zinc-100">
            {currentSkill?.name || 'Selected Domain'} •{' '}
            <span className="text-amber-400">{selectedDifficulty} Level</span>
          </div>
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <span>External Sandbox Execution</span>
            <span>•</span>
            <span>AI Code Defense</span>
            <span>•</span>
            <span>Ed25519 Signed Credential</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={isGenerating}
            className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleStart}
            disabled={isGenerating}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition disabled:opacity-60 cursor-pointer"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>Preparing Sandbox...</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Challenge & Begin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Toast overlay when generating */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto animate-pulse">
              <Cpu className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">AI Challenge Architect</h3>
              <p className="text-xs text-zinc-400 mt-2 font-mono">{generationStep}</p>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full animate-[progress_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
