import React, { useEffect, useState } from 'react';

export interface PixelSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | number;
  color?: 'amber' | 'emerald' | 'cyan' | 'zinc';
  className?: string;
}

/**
 * PixelClipSpinner
 * Pure Tailwind + CSS clip-path 8-bit stepped spinner.
 * Uses 20-vertex stepped polygon cutouts with animate-pixel-spin keyframes.
 */
export const PixelClipSpinner: React.FC<{
  size?: number;
  color?: 'amber' | 'emerald' | 'cyan' | 'zinc';
  className?: string;
}> = ({ size = 32, color = 'amber', className = '' }) => {
  const bgColors = {
    amber: 'bg-amber-400 border-amber-500',
    emerald: 'bg-emerald-400 border-emerald-500',
    cyan: 'bg-cyan-400 border-cyan-500',
    zinc: 'bg-zinc-300 border-zinc-400',
  }[color];

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none animate-pixel-spin ${className}`}
    >
      {/* Outer 8-bit stepped cross polygon using Tailwind clip-path */}
      <div
        className={`absolute inset-0 ${bgColors}`}
        style={{
          clipPath:
            'polygon(35% 0%, 65% 0%, 65% 25%, 75% 25%, 75% 35%, 100% 35%, 100% 65%, 75% 65%, 75% 75%, 65% 75%, 65% 100%, 35% 100%, 35% 75%, 25% 75%, 25% 65%, 0% 65%, 0% 35%, 25% 35%, 25% 25%, 35% 25%)',
        }}
      />
      {/* Dark Inner Hollow Hub */}
      <div
        className="absolute bg-[#060910] border border-zinc-900"
        style={{
          width: Math.max(6, Math.round(size * 0.42)),
          height: Math.max(6, Math.round(size * 0.42)),
          clipPath:
            'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px))',
        }}
      />
    </div>
  );
};

/**
 * PixelSpinner
 * Custom pixelated loading spinner using animate-pixel-spin keyframes
 * and Tailwind clip-path housing.
 */
export const PixelSpinner: React.FC<PixelSpinnerProps> = ({
  size = 'md',
  color = 'amber',
  className = '',
}) => {
  const pixelDimensions =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 18
      : size === 'lg'
      ? 44
      : 28;

  const colorMap = {
    amber: {
      core: '#f59e0b',
      rim: '#fbbf24',
      trail: '#92400e',
      dark: '#451a03',
      border: 'rgba(245, 158, 11, 0.35)',
    },
    emerald: {
      core: '#10b981',
      rim: '#34d399',
      trail: '#065f46',
      dark: '#022c22',
      border: 'rgba(16, 185, 129, 0.35)',
    },
    cyan: {
      core: '#06b6d4',
      rim: '#38bdf8',
      trail: '#0e7490',
      dark: '#083344',
      border: 'rgba(6, 182, 212, 0.35)',
    },
    zinc: {
      core: '#e4e4e7',
      rim: '#f4f4f5',
      trail: '#52525b',
      dark: '#18181b',
      border: 'rgba(161, 161, 170, 0.35)',
    },
  }[color];

  const housingPadding = size === 'sm' ? 4 : 8;
  const housingSize = pixelDimensions + housingPadding * 2;

  return (
    <div
      style={{ width: housingSize, height: housingSize }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
    >
      {/* Outer Stepped Chamfer Frame with Tailwind Clip-Path */}
      <div
        className="absolute inset-0 bg-[#060910] border"
        style={{
          borderColor: colorMap.border,
          clipPath:
            'polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))',
        }}
      />

      {/* Discrete 8-Step Rotating SVG Core using animate-pixel-spin */}
      <svg
        width={pixelDimensions}
        height={pixelDimensions}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 animate-pixel-spin shape-rendering-crispEdges select-none"
      >
        {/* Central Core Box */}
        <rect
          x="9"
          y="9"
          width="6"
          height="6"
          fill="#060910"
          stroke={colorMap.core}
          strokeWidth="1"
        />

        {/* 8 Stepped Orbiting Pixel Teeth (North, NE, East, SE, South, SW, West, NW) */}
        {/* N */}
        <rect x="10" y="2" width="4" height="4" fill={colorMap.rim} />
        {/* NE */}
        <rect x="16" y="4" width="4" height="4" fill={colorMap.rim} />
        {/* E */}
        <rect x="18" y="10" width="4" height="4" fill={colorMap.core} />
        {/* SE */}
        <rect x="16" y="16" width="4" height="4" fill={colorMap.trail} />
        {/* S */}
        <rect x="10" y="18" width="4" height="4" fill={colorMap.trail} />
        {/* SW */}
        <rect x="4" y="16" width="4" height="4" fill={colorMap.dark} />
        {/* W */}
        <rect x="2" y="10" width="4" height="4" fill={colorMap.dark} />
        {/* NW */}
        <rect x="4" y="4" width="4" height="4" fill={colorMap.trail} />

        {/* Center Pixel Hub */}
        <rect x="11" y="11" width="2" height="2" fill={colorMap.rim} />
      </svg>
    </div>
  );
};

export interface PixelLoadingBarProps {
  progress?: number; // 0 to 100, or undefined for indeterminate retro scanner
  label?: string;
  className?: string;
  segmentsCount?: number;
  color?: 'amber' | 'emerald' | 'cyan';
  showPercentage?: boolean;
}

/**
 * PixelLoadingBar
 * Stepped 8-bit segmented loading bar with clip-path chamfered container,
 * discrete pixel blocks, and terminal percentage readout.
 */
export const PixelLoadingBar: React.FC<PixelLoadingBarProps> = ({
  progress,
  label,
  className = '',
  segmentsCount = 12,
  color = 'amber',
  showPercentage = true,
}) => {
  // For indeterminate mode: cycle a scanning block across segments
  const [activeScanIndex, setActiveScanIndex] = useState(0);

  useEffect(() => {
    if (progress !== undefined) return;
    const interval = setInterval(() => {
      setActiveScanIndex((prev) => (prev + 1) % segmentsCount);
    }, 120);
    return () => clearInterval(interval);
  }, [progress, segmentsCount]);

  const activeColorClasses = {
    amber: 'bg-amber-400 border-amber-300 shadow-[0_0_6px_rgba(245,158,11,0.5)]',
    emerald: 'bg-emerald-400 border-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.5)]',
    cyan: 'bg-cyan-400 border-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.5)]',
  }[color];

  const calculatedFillCount =
    progress !== undefined
      ? Math.round((Math.max(0, Math.min(100, progress)) / 100) * segmentsCount)
      : 0;

  const displayPercentage =
    progress !== undefined
      ? Math.round(Math.max(0, Math.min(100, progress)))
      : Math.round(((activeScanIndex + 1) / segmentsCount) * 100);

  return (
    <div className={`space-y-2 w-full max-w-md ${className}`}>
      {/* Header with label & percentage */}
      <div className="flex items-center justify-between font-pixel text-[10px] text-zinc-400 tracking-wider">
        <span className="text-zinc-300 uppercase truncate">
          {label || 'COMPUTING...'}
        </span>
        {showPercentage && (
          <span className="font-mono text-amber-400 ml-2 shrink-0">
            [{displayPercentage.toString().padStart(3, '0')}%]
          </span>
        )}
      </div>

      {/* 8-bit Stepped Bar Frame with Cut Corners */}
      <div className="p-1 pixel-bar-container">
        <div className="grid grid-flow-col auto-cols-fr gap-1 h-3.5 bg-[#03060a]">
          {Array.from({ length: segmentsCount }).map((_, index) => {
            const isFilled =
              progress !== undefined
                ? index < calculatedFillCount
                : index === activeScanIndex ||
                  index === (activeScanIndex - 1 + segmentsCount) % segmentsCount;

            const isLeadHead =
              progress !== undefined
                ? index === calculatedFillCount - 1
                : index === activeScanIndex;

            return (
              <div
                key={index}
                className={`transition-colors duration-75 ${
                  isFilled
                    ? `${activeColorClasses} ${isLeadHead ? 'animate-pixel-blink' : ''}`
                    : 'bg-zinc-900/60 border border-zinc-800/60'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export interface PixelPageLoaderProps {
  label?: string;
  sublabel?: string;
  progress?: number;
  color?: 'amber' | 'emerald' | 'cyan';
  variant?: 'fullscreen' | 'container' | 'card';
  className?: string;
}

/**
 * PixelPageLoader
 * Standalone asynchronous transition component for full screens or major view containers.
 * Employs PixelSpinner, PixelLoadingBar, and retro terminal telemetry.
 */
export const PixelPageLoader: React.FC<PixelPageLoaderProps> = ({
  label = 'INITIALIZING SYSTEM...',
  sublabel = 'ISOLATING SECURE RUNTIME MATRIX',
  progress,
  color = 'amber',
  variant = 'container',
  className = '',
}) => {
  const containerClasses =
    variant === 'fullscreen'
      ? 'min-h-[85vh] flex flex-col items-center justify-center'
      : variant === 'card'
      ? 'p-12 pixel-card flex flex-col items-center justify-center my-6'
      : 'min-h-[60vh] flex flex-col items-center justify-center';

  return (
    <div className={`${containerClasses} space-y-6 text-center select-none ${className}`}>
      {/* 8-Bit Stepped Rotating Core with Tailwind clip-path housing */}
      <PixelSpinner size="lg" color={color} />

      {/* Primary Status Label */}
      <div className="space-y-1.5 max-w-md px-4">
        <div className="font-pixel text-xs sm:text-sm text-zinc-100 uppercase tracking-widest">
          {label}
        </div>
        {sublabel && (
          <div className="font-mono text-[11px] text-zinc-400 uppercase tracking-tight">
            {sublabel}
          </div>
        )}
      </div>

      {/* Segmented Pixel Loading Bar */}
      <div className="w-full max-w-xs px-2">
        <PixelLoadingBar
          progress={progress}
          color={color}
          segmentsCount={12}
          showPercentage={progress !== undefined}
        />
      </div>

      {/* Retro Telemetry Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950/80 border border-zinc-800 font-mono text-[9px] text-zinc-400">
        <span className="w-1.5 h-1.5 bg-amber-400" />
        <span>ASYNC_PIPELINE // SECURE_EXECUTION</span>
      </div>
    </div>
  );
};
