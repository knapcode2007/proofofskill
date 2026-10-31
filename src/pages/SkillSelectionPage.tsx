import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Skill } from '../types';
import { PixelCrest } from '../components/PixelVisuals';
import {
  Bug,
  Code,
  BarChart3,
  Database,
  Globe,
  Layers,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { PixelSpinner, PixelLoadingBar } from '../components/PixelLoader';

interface SkillSelectionPageProps {
  onAssessmentStarted: (assessmentId: string) => void;
  onCancel: () => void;
}

const SKILL_ICONS: Record<string, React.ReactNode> = {
  'python-debugging': <Bug className="w-5 h-5 text-amber-400" />,
  'python-programming': <Code className="w-5 h-5 text-orange-400" />,
  'data-analysis': <BarChart3 className="w-5 h-5 text-cyan-400" />,
  sql: <Database className="w-5 h-5 text-purple-400" />,
  'web-dev': <Globe className="w-5 h-5 text-emerald-400" />,
  javascript: <Layers className="w-5 h-5 text-yellow-400" />,
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
      setGenerationStep('INITIALIZING ASSESSMENT...');
      const res = await api.createAssessment(selectedSkillId, selectedDifficulty, 'python');
      const assessmentId = res.assessment.id;

      setGenerationStep('SYNTHESIZING CHALLENGE (GEMINI 3.8 FLASH)...');
      await api.generateChallenge(assessmentId);

      setGenerationStep('ISOLATING SANDBOX...');
      setTimeout(() => {
        onAssessmentStarted(assessmentId);
      }, 400);
    } catch (err: any) {
      console.error('[SkillSelection] Error starting assessment:', err);
      setError(err.message || 'Failed to start assessment.');
      setIsGenerating(false);
    }
  };

  const currentSkill = skills.find((s) => s.id === selectedSkillId);

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24 space-y-16">
      {/* Header (Negative space, pixel font) */}
      <div className="space-y-3 border-b border-zinc-800 pb-8">
        <div className="font-pixel text-[11px] text-amber-400 uppercase tracking-widest">
          STEP 01 • SELECTION
        </div>
        <h1 className="font-pixel text-2xl sm:text-4xl lg:text-5xl text-zinc-100 tracking-tight">
          SELECT TECHNICAL DOMAIN
        </h1>
      </div>

      {error && (
        <div className="p-5 border border-red-800 bg-red-950/40 text-red-200 font-mono text-xs">
          ERROR: {error}
        </div>
      )}

      {/* 1. Skill Selection Grid */}
      <div className="space-y-6">
        <label className="block font-pixel text-xs text-zinc-400 uppercase tracking-wider">
          TECHNICAL DOMAINS
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => {
            const isSelected = skill.id === selectedSkillId;
            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkillId(skill.id)}
                className={`p-7 pixel-card transition-all cursor-pointer flex flex-col justify-between gap-6 cursor-reactive-target ${
                  isSelected
                    ? 'ring-2 ring-amber-400/80 shadow-amber-500/10'
                    : 'opacity-85 hover:opacity-100 hover:ring-1 hover:ring-zinc-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 border border-zinc-800 bg-zinc-950">
                    {SKILL_ICONS[skill.id] || <Code className="w-5 h-5 text-amber-400" />}
                  </div>
                  {isSelected && (
                    <span className="font-pixel text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5">
                      SELECTED
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-pixel text-sm sm:text-base text-zinc-100 uppercase">{skill.name}</h3>
                  <p className="font-mono text-xs text-zinc-400 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                <div className="font-mono text-[10px] text-zinc-500 pt-3 border-t border-zinc-800/80 uppercase">
                  RUNTIME: {skill.supported_language}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Proficiency Tier */}
      <div className="space-y-6">
        <label className="block font-pixel text-xs text-zinc-400 uppercase tracking-wider">
          PROFICIENCY LEVEL
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { level: 'Beginner' as const, time: '15-20 MIN', desc: 'Core syntax, fundamental algorithms, basic edge cases.' },
            { level: 'Intermediate' as const, time: '25-35 MIN', desc: 'Optimal time/space bounds, cache eviction, concurrency faults.' },
            { level: 'Advanced' as const, time: '40-50 MIN', desc: 'Distributed systems logic, high-throughput scaling, subtle boundary hazards.' },
          ].map((tier) => {
            const isSelected = selectedDifficulty === tier.level;
            return (
              <div
                key={tier.level}
                onClick={() => setSelectedDifficulty(tier.level)}
                className={`p-7 pixel-card transition-all cursor-pointer space-y-3 cursor-reactive-target ${
                  isSelected
                    ? 'ring-2 ring-amber-400/80 shadow-amber-500/10'
                    : 'opacity-85 hover:opacity-100 hover:ring-1 hover:ring-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-sm text-zinc-100 uppercase">{tier.level}</span>
                  <span className="font-mono text-[10px] text-zinc-500">{tier.time}</span>
                </div>
                <p className="font-mono text-xs text-zinc-400 leading-relaxed">{tier.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Launch Bar in Pixel Card */}
      <div className="p-8 sm:p-10 pixel-card flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="font-mono text-xs space-y-1.5">
          <div className="text-zinc-500 uppercase">CONFIGURED ASSESSMENT:</div>
          <div className="font-pixel text-base sm:text-lg text-zinc-100 uppercase">
            {currentSkill?.name} • <span className="text-amber-400">{selectedDifficulty}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            disabled={isGenerating}
            className="px-6 py-3.5 pixel-btn-secondary text-xs cursor-reactive-target"
          >
            CANCEL
          </button>

          <button
            onClick={handleStart}
            disabled={isGenerating}
            className="px-8 py-3.5 pixel-btn-primary text-xs tracking-wider cursor-reactive-target flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <PixelSpinner size="sm" color="zinc" />
                <span>SYNTHESIZING...</span>
              </>
            ) : (
              <>
                <span>BEGIN CHALLENGE</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal on Generating with PixelSpinner & PixelLoadingBar */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="p-10 pixel-card max-w-sm w-full text-center space-y-6">
            <PixelSpinner size="lg" color="amber" className="mx-auto" />
            <div className="space-y-1.5">
              <div className="font-pixel text-sm text-amber-400">CHALLENGE SYNTHESIS</div>
              <div className="font-mono text-xs text-zinc-400">{generationStep}</div>
            </div>
            <PixelLoadingBar
              label="SYNTHESIZING BENCHMARK"
              color="amber"
              segmentsCount={10}
              showPercentage={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
