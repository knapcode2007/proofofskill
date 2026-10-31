import React from 'react';

/**
 * Pixelated Cryptographic Crest (Pure SVG Pixel Art, zero emojis, zero ascii)
 */
export const PixelCrest: React.FC<{ size?: number; className?: string }> = ({
  size = 64,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shape-rendering-crispEdges ${className}`}
    >
      {/* Outer pixel shield silhouette */}
      <rect x="10" y="2" width="12" height="2" fill="#f59e0b" className="pixel-rect-stepped" />
      <rect x="6" y="4" width="20" height="2" fill="#f59e0b" className="pixel-rect-stepped" />
      <rect x="4" y="6" width="24" height="4" fill="#f59e0b" className="pixel-rect-stepped" />
      <rect x="4" y="10" width="24" height="8" fill="#d97706" className="pixel-rect-stepped" />
      <rect x="6" y="18" width="20" height="4" fill="#b45309" className="pixel-rect-stepped" />
      <rect x="8" y="22" width="16" height="4" fill="#92400e" className="pixel-rect-stepped" />
      <rect x="12" y="26" width="8" height="3" fill="#78350f" className="pixel-rect-stepped" />
      <rect x="14" y="29" width="4" height="2" fill="#451a03" className="pixel-rect-stepped" />

      {/* Inner dark core */}
      <rect x="8" y="6" width="16" height="12" fill="#090d16" className="pixel-rect-stepped-subtle" />
      <rect x="10" y="18" width="12" height="4" fill="#090d16" className="pixel-rect-stepped-subtle" />
      <rect x="12" y="22" width="8" height="3" fill="#090d16" className="pixel-rect-stepped-subtle" />

      {/* Cybernetic cryptographic key pixel pattern inside */}
      <rect x="14" y="8" width="4" height="4" fill="#10b981" className="pixel-rect-stepped-indicator" />
      <rect x="15" y="12" width="2" height="8" fill="#10b981" className="pixel-rect-stepped-indicator" />
      <rect x="17" y="14" width="2" height="2" fill="#10b981" className="pixel-rect-stepped-indicator" />
      <rect x="17" y="18" width="3" height="2" fill="#10b981" className="pixel-rect-stepped-indicator" />

      {/* Pixel highlights */}
      <rect x="10" y="4" width="4" height="2" fill="#fef3c7" className="pixel-rect-stepped-indicator" />
      <rect x="6" y="6" width="2" height="4" fill="#fef3c7" className="pixel-rect-stepped-indicator" />
    </svg>
  );
};

/**
 * Pixelated Code Sandbox Visual
 */
export const PixelTerminalVisual: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-4 rounded-none border border-zinc-800 bg-[#070a0f] font-mono text-xs ${className}`}>
      {/* Top pixel bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-amber-500" />
          <span className="w-2 h-2 bg-zinc-700" />
          <span className="w-2 h-2 bg-zinc-800" />
          <span className="ml-2 font-pixel text-[10px] text-zinc-400 uppercase tracking-widest">
            SANDBOX_RUNNER
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-pixel">
          <span>ISOLATED</span>
        </div>
      </div>

      {/* Visual code matrix representation instead of paragraph */}
      <div className="space-y-2 text-[11px] leading-relaxed">
        <div className="flex items-center gap-3">
          <span className="text-zinc-600 select-none">01</span>
          <div className="h-2 bg-amber-500/40 w-24" />
          <div className="h-2 bg-zinc-700 w-16" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-600 select-none">02</span>
          <div className="w-4" />
          <div className="h-2 bg-emerald-500/50 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-600 select-none">03</span>
          <div className="w-4" />
          <div className="h-2 bg-zinc-600 w-20" />
          <div className="h-2 bg-amber-500/60 w-12" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-600 select-none">04</span>
          <div className="h-2 bg-purple-500/40 w-28" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
        <span className="font-pixel text-amber-400">TEST_SUITE_EXECUTION</span>
        <span className="font-mono text-emerald-400 font-bold">100% PASSED</span>
      </div>
    </div>
  );
};

/**
 * Visual Competency Radar (Polygon SVG replacing dense tables)
 */
export const CompetencyRadar: React.FC<{
  scores: {
    logical_thinking: number;
    debugging: number;
    problem_solving: number;
    code_quality: number;
    edge_case_handling: number;
    technical_understanding: number;
  };
  size?: number;
}> = ({ scores, size = 260 }) => {
  const center = size / 2;
  const radius = center * 0.75;
  const categories = [
    { key: 'logical_thinking', label: 'LOGIC', score: scores.logical_thinking },
    { key: 'debugging', label: 'DEBUG', score: scores.debugging },
    { key: 'problem_solving', label: 'SOLVE', score: scores.problem_solving },
    { key: 'code_quality', label: 'QUALITY', score: scores.code_quality },
    { key: 'edge_case_handling', label: 'EDGES', score: scores.edge_case_handling },
    { key: 'technical_understanding', label: 'DEFENSE', score: scores.technical_understanding },
  ];

  const total = categories.length;
  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = (val / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Background radar rings
  const rings = [0.25, 0.5, 0.75, 1];

  // Polygon points
  const points = categories
    .map((c, i) => {
      const coord = getCoordinates(i, c.score);
      return `${coord.x},${coord.y}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible select-none">
        {/* Background rings */}
        {rings.map((ring, idx) => {
          const ringPoints = categories
            .map((_, i) => {
              const coord = getCoordinates(i, ring * 100);
              return `${coord.x},${coord.y}`;
            })
            .join(' ');
          return (
            <polygon
              key={idx}
              points={ringPoints}
              fill="none"
              stroke="#27272a"
              strokeWidth="1"
              strokeDasharray={idx === 3 ? 'none' : '2 2'}
            />
          );
        })}

        {/* Spokes */}
        {categories.map((_, i) => {
          const outer = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={outer.x}
              y2={outer.y}
              stroke="#27272a"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon with amber glow */}
        <polygon
          points={points}
          fill="rgba(245, 158, 11, 0.2)"
          stroke="#f59e0b"
          strokeWidth="2"
        />

        {/* Data point vertices */}
        {categories.map((c, i) => {
          const coord = getCoordinates(i, c.score);
          const outer = getCoordinates(i, 116);
          return (
            <g key={i}>
              <rect
                x={coord.x - 2.5}
                y={coord.y - 2.5}
                width={5}
                height={5}
                fill="#fbbf24"
                className="pixel-rect-stepped-indicator"
              />
              <text
                x={outer.x}
                y={outer.y + 3}
                fill="#a1a1aa"
                fontSize="9"
                fontFamily="Silkscreen, monospace"
                textAnchor="middle"
                className="select-none"
              >
                {c.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/**
 * Visual 4-Step Interactive Pipeline
 */
export const VisualPipeline: React.FC<{
  activeStep?: number;
  onStepSelect?: (step: number) => void;
}> = ({ activeStep = 1, onStepSelect }) => {
  const steps = [
    { num: '01', title: 'SYNTHESIS', subtitle: 'Gemini AI' },
    { num: '02', title: 'SANDBOX', subtitle: 'Isolated Tests' },
    { num: '03', title: 'DEFENSE', subtitle: 'Adversarial Q&A' },
    { num: '04', title: 'Ed25519', subtitle: 'Cryptographic Proof' },
  ];

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3">
      {steps.map((st, idx) => {
        const stepNum = idx + 1;
        const isActive = activeStep === stepNum;
        return (
          <div
            key={st.num}
            onClick={() => onStepSelect && onStepSelect(stepNum)}
            className={`p-4 border transition-all cursor-pointer relative overflow-hidden group ${
              isActive
                ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/30'
                : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            {/* Top accent square */}
            <div
              className={`w-2 h-2 mb-3 transition-colors ${
                isActive ? 'bg-amber-400' : 'bg-zinc-700 group-hover:bg-zinc-500'
              }`}
            />
            <div className="flex items-center justify-between mb-1">
              <span className="font-pixel text-xs text-amber-400 font-bold tracking-wider">
                {st.num}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">PHASE</span>
            </div>
            <div className="font-pixel text-sm font-bold text-zinc-100 tracking-tight">
              {st.title}
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-1">
              {st.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
};
