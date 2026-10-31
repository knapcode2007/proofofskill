import React, { useEffect, useState, useRef } from 'react';

/**
 * ReactiveCursor
 * 
 * High-precision cybernetic 8-bit reactive cursor:
 * - Instant zero-latency crosshair core (+)
 * - Trailing tactical reticle with stepped mechanical lerp
 * - Dynamic target lock-on with corner brackets for interactive elements
 * - Expanding stepped click pulse shockwave
 * - Telemetry coordinate readout in terminal monospace
 * - Pure 8-bit retro aesthetic with zero smooth gradient slop
 */

interface ClickWave {
  id: number;
  x: number;
  y: number;
}

export const ReactiveCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string>('LOCK');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [clickWaves, setClickWaves] = useState<ClickWave[]>([]);
  const waveIdRef = useRef(0);

  useEffect(() => {
    // Check if device has a fine pointer (mouse/trackpad)
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    if (!hasMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Check if target or parent is interactive
      const target = e.target as HTMLElement | null;
      if (!target) {
        setIsHovering(false);
        return;
      }

      const interactiveEl =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-reactive-target') ||
        target.getAttribute('role') === 'button';

      if (interactiveEl) {
        setIsHovering(true);
        // Contextual micro-label for HUD
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          setHoverLabel('INPUT');
        } else if (target.closest('button')?.textContent?.includes('VERIFY') || target.textContent?.includes('VERIFY')) {
          setHoverLabel('AUDIT');
        } else if (target.closest('button')?.textContent?.includes('START') || target.textContent?.includes('START')) {
          setHoverLabel('EXEC');
        } else {
          setHoverLabel('LOCK');
        }
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newWaveId = ++waveIdRef.current;
      setClickWaves((prev) => [...prev.slice(-3), { id: newWaveId, x: e.clientX, y: e.clientY }]);

      // Remove after shockwave completes
      setTimeout(() => {
        setClickWaves((prev) => prev.filter((w) => w.id !== newWaveId));
      }, 350);
    };

    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Smooth stepped lerp for trailing reticle
  useEffect(() => {
    let animId: number;
    const lerp = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.24,
        y: prev.y + (pos.y - prev.y) * 0.24,
      }));
      animId = requestAnimationFrame(lerp);
    };
    animId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animId);
  }, [pos]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* 1. Click Stepped Shockwave Pulses */}
      {clickWaves.map((wave) => (
        <div
          key={wave.id}
          className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 border border-amber-400 pointer-events-none"
          style={{
            transform: `translate3d(${wave.x}px, ${wave.y}px, 0)`,
            animation: 'pixel-click-pulse 320ms steps(4, jump-none) forwards',
          }}
        />
      ))}

      {/* 2. Trailing Tactical Reticle with 8-Bit Stepped Brackets */}
      <div
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out ${
          isClicking
            ? 'w-6 h-6 rotate-45 scale-90'
            : isHovering
            ? 'w-9 h-9 scale-110'
            : 'w-7 h-7 scale-100'
        }`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`,
        }}
      >
        {/* Reticle Boundary Wireframe */}
        <div
          className={`w-full h-full border transition-colors ${
            isClicking
              ? 'border-emerald-400 bg-emerald-500/10'
              : isHovering
              ? 'border-amber-400/80 bg-amber-400/10'
              : 'border-zinc-600/30'
          }`}
          style={{
            clipPath:
              'polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))',
          }}
        />

        {/* 4 Precision Corner Notches (8-Bit Pixels) */}
        <span
          className={`absolute -top-0.5 -left-0.5 w-1.5 h-1.5 ${
            isHovering ? 'bg-amber-400' : 'bg-zinc-400'
          }`}
        />
        <span
          className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 ${
            isHovering ? 'bg-amber-400' : 'bg-zinc-400'
          }`}
        />
        <span
          className={`absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 ${
            isHovering ? 'bg-amber-400' : 'bg-zinc-400'
          }`}
        />
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 ${
            isHovering ? 'bg-amber-400' : 'bg-zinc-400'
          }`}
        />

        {/* Cardinal Crosshair Ticks */}
        {isHovering && (
          <>
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400" />
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400" />
            <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-1 h-1 bg-amber-400" />
            <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-1 h-1 bg-amber-400" />
          </>
        )}
      </div>

      {/* 3. Instant Lead Reticle: Ultra-Crisp Precision Pixel Crosshair (+) */}
      <div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 17 17"
          fill="none"
          className="shape-rendering-crispEdges -translate-x-1/2 -translate-y-1/2"
        >
          {/* Center 3x3 Micro Box */}
          <rect
            x="7"
            y="7"
            width="3"
            height="3"
            fill={isClicking ? '#22d3ee' : isHovering ? '#10b981' : '#f59e0b'}
          />
          {/* North Pip */}
          <rect
            x="7"
            y="2"
            width="3"
            height="2"
            fill={isHovering ? '#10b981' : '#f59e0b'}
          />
          {/* South Pip */}
          <rect
            x="7"
            y="13"
            width="3"
            height="2"
            fill={isHovering ? '#10b981' : '#f59e0b'}
          />
          {/* West Pip */}
          <rect
            x="2"
            y="7"
            width="2"
            height="3"
            fill={isHovering ? '#10b981' : '#f59e0b'}
          />
          {/* East Pip */}
          <rect
            x="13"
            y="7"
            width="2"
            height="3"
            fill={isHovering ? '#10b981' : '#f59e0b'}
          />
        </svg>

        {/* 4. Contextual Micro-HUD Badge (Right Flank) */}
        <div
          className={`absolute left-4 top-2 flex items-center gap-1.5 px-1.5 py-0.5 border text-[8px] font-pixel transition-opacity duration-100 ${
            isHovering
              ? 'bg-[#060910] border-amber-400 text-amber-400 opacity-95'
              : 'opacity-0'
          }`}
          style={{
            clipPath: 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px))',
          }}
        >
          <span className="w-1 h-1 bg-amber-400 inline-block animate-pixel-blink" />
          <span>{hoverLabel}</span>
        </div>

        {/* 5. Minimal Coordinates Readout in Low-Opacity Terminal Mono */}
        <div className="absolute left-4 -bottom-3 text-[7px] font-mono text-zinc-500 opacity-40 select-none whitespace-nowrap">
          {Math.round(pos.x)}:{Math.round(pos.y)}
        </div>
      </div>
    </div>
  );
};
