import React, { useState } from 'react';

/**
 * PixelProofIllustration
 * 
 * Large, responsive vector pixel-art illustration representing the 'Proof of Skill' concept:
 * - Sovereign Cryptographic Skill Passport Core (Master Shield)
 * - 4 Interconnected Satellite Verification Engines:
 *     1. Deterministic Test Matrix (Hidden & Visible Test Suite)
 *     2. AI Defense & Code Interrogation Engine (Gemini)
 *     3. Ed25519 Asymmetric Keyring & Digital Signature Engine
 *     4. SHA-256 Merkle Evidence Ledger (Tamper-Evident Digest)
 * - Pure 8-bit vector SVG geometry with crispEdges rendering
 * - Discrete step-based CSS transitions on rect elements for true retro feel
 * - Mathematically balanced negative space with zero colliding text
 */

export const PixelProofIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  return (
    <div className={`relative w-full max-w-4xl mx-auto ${className}`}>
      {/* Outer Tactical HUD Corner Frame */}
      <div className="relative p-2 sm:p-4 bg-[#05080e]/90 border border-zinc-800/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
        {/* Top & Bottom Pixel Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500/80 pointer-events-none" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500/80 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500/80 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500/80 pointer-events-none" />

        {/* Header HUD status bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 mb-3 bg-[#030509]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 inline-block shadow-[0_0_8px_#10b981]" />
            <span className="font-pixel text-[9px] sm:text-[10px] text-zinc-300 tracking-wider">
              PROOF_OF_SKILL // MERKLE_VERIFIER_V2.6
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 font-mono text-[10px] text-zinc-500">
            <span>SIG: ED25519</span>
            <span>HASH: SHA-256</span>
            <span className="text-amber-400 font-pixel text-[9px]">ONLINE</span>
          </div>
        </div>

        {/* Master SVG Vector Pixel Art Canvas */}
        <svg
          viewBox="0 0 680 430"
          className="w-full h-auto select-none shape-rendering-crispEdges"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Subtle background pixel dot grid */}
            <pattern id="pixelGridPattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="1" height="1" fill="#18202f" />
            </pattern>
          </defs>

          {/* Background Canvas (Static base) */}
          <rect width="680" height="430" fill="#04060b" />
          <rect width="680" height="430" fill="url(#pixelGridPattern)" opacity="0.6" />

          {/* =================================================================
              BUS LINES / CIRCUIT TRACES (Connecting Center to 4 Satellites)
              ================================================================= */}
          {/* Top-Left Bus (Center -> Test Matrix) */}
          <path
            d="M 270 190 H 210 V 105 H 175"
            stroke={activeNode === 1 ? '#10b981' : '#273449'}
            strokeWidth="3"
            fill="none"
          />
          <rect
            x="207"
            y="102"
            width="6"
            height="6"
            fill={activeNode === 1 ? '#10b981' : '#3b82f6'}
            className="pixel-rect-stepped-indicator"
          />
          <rect
            x="172"
            y="102"
            width="6"
            height="6"
            fill="#10b981"
            className="pixel-rect-stepped-indicator"
          />

          {/* Top-Right Bus (Center -> AI Defense) */}
          <path
            d="M 410 190 H 470 V 105 H 505"
            stroke={activeNode === 2 ? '#f59e0b' : '#273449'}
            strokeWidth="3"
            fill="none"
          />
          <rect
            x="467"
            y="102"
            width="6"
            height="6"
            fill={activeNode === 2 ? '#f59e0b' : '#d97706'}
            className="pixel-rect-stepped-indicator"
          />
          <rect
            x="502"
            y="102"
            width="6"
            height="6"
            fill="#f59e0b"
            className="pixel-rect-stepped-indicator"
          />

          {/* Bottom-Left Bus (Center -> Ed25519 Engine) */}
          <path
            d="M 270 250 H 210 V 325 H 175"
            stroke={activeNode === 3 ? '#06b6d4' : '#273449'}
            strokeWidth="3"
            fill="none"
          />
          <rect
            x="207"
            y="322"
            width="6"
            height="6"
            fill={activeNode === 3 ? '#06b6d4' : '#0284c7'}
            className="pixel-rect-stepped-indicator"
          />
          <rect
            x="172"
            y="322"
            width="6"
            height="6"
            fill="#06b6d4"
            className="pixel-rect-stepped-indicator"
          />

          {/* Bottom-Right Bus (Center -> Merkle Ledger) */}
          <path
            d="M 410 250 H 470 V 325 H 505"
            stroke={activeNode === 4 ? '#a855f7' : '#273449'}
            strokeWidth="3"
            fill="none"
          />
          <rect
            x="467"
            y="322"
            width="6"
            height="6"
            fill={activeNode === 4 ? '#a855f7' : '#7e22ce'}
            className="pixel-rect-stepped-indicator"
          />
          <rect
            x="502"
            y="322"
            width="6"
            height="6"
            fill="#a855f7"
            className="pixel-rect-stepped-indicator"
          />

          {/* Central Radiating Signal Bars */}
          <rect
            x="330"
            y="36"
            width="20"
            height="4"
            fill="#f59e0b"
            className="pixel-rect-stepped-indicator"
          />
          <rect
            x="336"
            y="44"
            width="8"
            height="4"
            fill="#fbbf24"
            className="pixel-rect-stepped-indicator"
          />
          <rect
            x="338"
            y="52"
            width="4"
            height="6"
            fill="#fef3c7"
            className="pixel-rect-stepped-indicator"
          />

          {/* =================================================================
              1. SATELLITE NODE TOP-LEFT: TEST MATRIX / HARNESS
              ================================================================= */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setActiveNode(1)}
            onMouseLeave={() => setActiveNode(null)}
          >
            {/* Outer Box */}
            <rect
              x="15"
              y="45"
              width="160"
              height="115"
              fill="#080d16"
              stroke={activeNode === 1 ? '#10b981' : '#1f2937'}
              strokeWidth="2"
              className="pixel-rect-stepped-subtle"
            />
            {/* Header Strip */}
            <rect
              x="18"
              y="48"
              width="154"
              height="20"
              fill="#0f172a"
              className="pixel-rect-stepped"
            />
            <rect
              x="23"
              y="54"
              width="8"
              height="8"
              fill="#10b981"
              className="pixel-rect-stepped-indicator"
            />
            <text
              x="37"
              y="58"
              dominantBaseline="central"
              fill="#10b981"
              fontFamily="Silkscreen"
              fontSize="9"
              fontWeight="bold"
            >
              TEST HARNESS
            </text>

            {/* Test Matrix Items */}
            {/* Item 1 */}
            <rect
              x="24"
              y="74"
              width="12"
              height="12"
              fill="#032e1e"
              stroke="#10b981"
              strokeWidth="1"
              className="pixel-rect-stepped"
            />
            <text
              x="30"
              y="80"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#34d399"
              fontFamily="JetBrains Mono"
              fontSize="9"
              fontWeight="bold"
            >
              ✓
            </text>
            <text
              x="44"
              y="80"
              dominantBaseline="central"
              fill="#e2e8f0"
              fontFamily="JetBrains Mono"
              fontSize="8.5"
            >
              VISIBLE_TESTS
            </text>
            <text
              x="160"
              y="80"
              textAnchor="end"
              dominantBaseline="central"
              fill="#10b981"
              fontFamily="Silkscreen"
              fontSize="8"
            >
              100%
            </text>

            {/* Item 2 */}
            <rect
              x="24"
              y="92"
              width="12"
              height="12"
              fill="#032e1e"
              stroke="#10b981"
              strokeWidth="1"
              className="pixel-rect-stepped"
            />
            <text
              x="30"
              y="98"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#34d399"
              fontFamily="JetBrains Mono"
              fontSize="9"
              fontWeight="bold"
            >
              ✓
            </text>
            <text
              x="44"
              y="98"
              dominantBaseline="central"
              fill="#e2e8f0"
              fontFamily="JetBrains Mono"
              fontSize="8.5"
            >
              HIDDEN_SUITE
            </text>
            <text
              x="160"
              y="98"
              textAnchor="end"
              dominantBaseline="central"
              fill="#10b981"
              fontFamily="Silkscreen"
              fontSize="8"
            >
              PASS
            </text>

            {/* Item 3 */}
            <rect
              x="24"
              y="110"
              width="12"
              height="12"
              fill="#032e1e"
              stroke="#10b981"
              strokeWidth="1"
              className="pixel-rect-stepped"
            />
            <text
              x="30"
              y="116"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#34d399"
              fontFamily="JetBrains Mono"
              fontSize="9"
              fontWeight="bold"
            >
              ✓
            </text>
            <text
              x="44"
              y="116"
              dominantBaseline="central"
              fill="#e2e8f0"
              fontFamily="JetBrains Mono"
              fontSize="8.5"
            >
              DETERMINISM
            </text>
            <text
              x="160"
              y="116"
              textAnchor="end"
              dominantBaseline="central"
              fill="#10b981"
              fontFamily="Silkscreen"
              fontSize="8"
            >
              PASS
            </text>

            {/* Bottom status block */}
            <rect
              x="22"
              y="130"
              width="146"
              height="20"
              fill="#031f14"
              stroke="#064e3b"
              strokeWidth="1"
              className="pixel-rect-stepped"
            />
            <rect
              x="28"
              y="136"
              width="8"
              height="8"
              fill="#10b981"
              className="pixel-rect-stepped-indicator"
            />
            <text
              x="42"
              y="140"
              dominantBaseline="central"
              fill="#34d399"
              fontFamily="Silkscreen"
              fontSize="7.5"
            >
              0 ERRORS DETECTED
            </text>
          </g>

          {/* =================================================================
              2. SATELLITE NODE TOP-RIGHT: AI DEFENSE INTERROGATOR
              ================================================================= */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setActiveNode(2)}
            onMouseLeave={() => setActiveNode(null)}
          >
            {/* Outer Box */}
            <rect
              x="505"
              y="45"
              width="160"
              height="115"
              fill="#080d16"
              stroke={activeNode === 2 ? '#f59e0b' : '#1f2937'}
              strokeWidth="2"
              className="pixel-rect-stepped-subtle"
            />
            {/* Header Strip */}
            <rect
              x="508"
              y="48"
              width="154"
              height="20"
              fill="#0f172a"
              className="pixel-rect-stepped"
            />
            <rect
              x="514"
              y="54"
              width="8"
              height="8"
              fill="#f59e0b"
              className="pixel-rect-stepped-indicator"
            />
            <text
              x="528"
              y="58"
              dominantBaseline="central"
              fill="#f59e0b"
              fontFamily="Silkscreen"
              fontSize="9"
              fontWeight="bold"
            >
              AI DEFENSE
            </text>

            {/* Content */}
            <text
              x="518"
              y="79"
              dominantBaseline="central"
              fill="#94a3b8"
              fontFamily="JetBrains Mono"
              fontSize="8.5"
            >
              ENGINE: GEMINI 3.8
            </text>
            <text
              x="518"
              y="94"
              dominantBaseline="central"
              fill="#cbd5e1"
              fontFamily="JetBrains Mono"
              fontSize="8.5"
            >
              DEFENSE: 3/3 PROVED
            </text>

            {/* Stepped Competency Bar */}
            <text
              x="518"
              y="110"
              dominantBaseline="central"
              fill="#fbbf24"
              fontFamily="Silkscreen"
              fontSize="7.5"
            >
              COMPETENCY: 96%
            </text>
            <rect
              x="518"
              y="118"
              width="134"
              height="7"
              fill="#18202d"
              className="pixel-rect-stepped"
            />
            <rect
              x="518"
              y="118"
              width="128"
              height="7"
              fill="#f59e0b"
              className="pixel-rect-stepped"
            />

            {/* Bottom status block */}
            <rect
              x="512"
              y="130"
              width="146"
              height="20"
              fill="#2d1704"
              stroke="#78350f"
              strokeWidth="1"
              className="pixel-rect-stepped"
            />
            <rect
              x="518"
              y="136"
              width="8"
              height="8"
              fill="#f59e0b"
              className="pixel-rect-stepped-indicator"
            />
            <text
              x="532"
              y="140"
              dominantBaseline="central"
              fill="#fbbf24"
              fontFamily="Silkscreen"
              fontSize="7.5"
            >
              REASONING VALIDATED
            </text>
          </g>

          {/* =================================================================
              3. SATELLITE NODE BOTTOM-LEFT: Ed25519 ASYMMETRIC KEYRING
              ================================================================= */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setActiveNode(3)}
            onMouseLeave={() => setActiveNode(null)}
          >
            {/* Outer Box */}
            <rect
              x="15"
              y="270"
              width="160"
              height="115"
              fill="#080d16"
              stroke={activeNode === 3 ? '#06b6d4' : '#1f2937'}
              strokeWidth="2"
              className="pixel-rect-stepped-subtle"
            />
            {/* Header Strip */}
            <rect
              x="18"
              y="273"
              width="154"
              height="20"
              fill="#0f172a"
              className="pixel-rect-stepped"
            />
            <rect
              x="23"
              y="279"
              width="8"
              height="8"
              fill="#06b6d4"
              className="pixel-rect-stepped-indicator"
            />
            <text
              x="37"
              y="283"
              dominantBaseline="central"
              fill="#06b6d4"
              fontFamily="Silkscreen"
              fontSize="9"
              fontWeight="bold"
            >
              Ed25519 VAULT
            </text>

            {/* Key Graphic */}
            <rect
              x="26"
              y="302"
              width="16"
              height="10"
              fill="#0e7490"
              className="pixel-rect-stepped"
            />
            <rect
              x="29"
              y="305"
              width="10"
              height="4"
              fill="#080d16"
              className="pixel-rect-stepped"
            />
            <rect
              x="42"
              y="305"
              width="22"
              height="4"
              fill="#06b6d4"
              className="pixel-rect-stepped"
            />
            <rect
              x="52"
              y="309"
              width="4"
              height="5"
              fill="#06b6d4"
              className="pixel-rect-stepped"
            />
            <rect
              x="60"
              y="309"
              width="4"
              height="5"
              fill="#06b6d4"
              className="pixel-rect-stepped"
            />
            <text
              x="74"
              y="307"
              dominantBaseline="central"
              fill="#38bdf8"
              fontFamily="Silkscreen"
              fontSize="7.5"
            >
              ASYMMETRIC
            </text>

            <text
              x="26"
              y="327"
              dominantBaseline="central"
              fill="#94a3b8"
              fontFamily="JetBrains Mono"
              fontSize="8"
            >
              PUB_KEY: RFC 8032
            </text>
            <text
              x="26"
              y="341"
              dominantBaseline="central"
              fill="#64748b"
              fontFamily="JetBrains Mono"
              fontSize="7.5"
            >
              0x3b89...f91a2c
            </text>

            {/* Bottom status block */}
            <rect
              x="22"
              y="355"
              width="146"
              height="20"
              fill="#04232c"
              stroke="#0e7490"
              strokeWidth="1"
              className="pixel-rect-stepped"
            />
            <rect
              x="28"
              y="361"
              width="8"
              height="8"
              fill="#06b6d4"
              className="pixel-rect-stepped-indicator"
            />
            <text
              x="42"
              y="365"
              dominantBaseline="central"
              fill="#22d3ee"
              fontFamily="Silkscreen"
              fontSize="7.5"
            >
              KEYPAIR VERIFIED
            </text>
          </g>

          {/* =================================================================
              4. SATELLITE NODE BOTTOM-RIGHT: SHA-256 EVIDENCE LEDGER
              ================================================================= */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setActiveNode(4)}
            onMouseLeave={() => setActiveNode(null)}
          >
            {/* Outer Box */}
            <rect
              x="505"
              y="270"
              width="160"
              height="115"
              fill="#080d16"
              stroke={activeNode === 4 ? '#a855f7' : '#1f2937'}
              strokeWidth="2"
              className="pixel-rect-stepped-subtle"
            />
            {/* Header Strip */}
            <rect
              x="508"
              y="273"
              width="154"
              height="20"
              fill="#0f172a"
              className="pixel-rect-stepped"
            />
            <rect
              x="514"
              y="279"
              width="8"
              height="8"
              fill="#a855f7"
              className="pixel-rect-stepped-indicator"
            />
            <text
              x="528"
              y="283"
              dominantBaseline="central"
              fill="#a855f7"
              fontFamily="Silkscreen"
              fontSize="8.5"
              fontWeight="bold"
            >
              CANONICAL MERKLE
            </text>

            {/* Ledger content */}
            <text
              x="518"
              y="306"
              dominantBaseline="central"
              fill="#94a3b8"
              fontFamily="JetBrains Mono"
              fontSize="8"
            >
              HASH: SHA-256 RFC 4634
            </text>
            <text
              x="518"
              y="320"
              dominantBaseline="central"
              fill="#64748b"
              fontFamily="JetBrains Mono"
              fontSize="7.5"
            >
              e3b0c44298fc1c14...
            </text>
            <text
              x="518"
              y="334"
              dominantBaseline="central"
              fill="#cbd5e1"
              fontFamily="JetBrains Mono"
              fontSize="8"
            >
              TAMPER-EVIDENT: 100%
            </text>

            {/* Bottom status block */}
            <rect
              x="512"
              y="355"
              width="146"
              height="20"
              fill="#240c36"
              stroke="#7e22ce"
              strokeWidth="1"
              className="pixel-rect-stepped"
            />
            <rect
              x="518"
              y="361"
              width="8"
              height="8"
              fill="#a855f7"
              className="pixel-rect-stepped-indicator"
            />
            <text
              x="532"
              y="365"
              dominantBaseline="central"
              fill="#c084fc"
              fontFamily="Silkscreen"
              fontSize="7.5"
            >
              MERKLE ROOT VALID
            </text>
          </g>

          {/* =================================================================
              MASTER CENTER SHIELD: THE PROOF OF SKILL CREDENTIAL CORE
              ================================================================= */}
          <g transform="translate(240, 50)">
            {/* Outer Shadow Silhouette */}
            <polygon
              points="20,10 180,10 196,26 196,240 100,310 4,240 4,26"
              fill="#060910"
              stroke="#b45309"
              strokeWidth="3"
            />

            {/* Stepped Amber Bezel (8-Bit Pixels) */}
            <rect
              x="24"
              y="16"
              width="152"
              height="6"
              fill="#f59e0b"
              className="pixel-rect-stepped"
            />
            <rect
              x="18"
              y="22"
              width="6"
              height="210"
              fill="#d97706"
              className="pixel-rect-stepped"
            />
            <rect
              x="176"
              y="22"
              width="6"
              height="210"
              fill="#d97706"
              className="pixel-rect-stepped"
            />

            {/* Top Crown Pixels */}
            <rect
              x="80"
              y="2"
              width="40"
              height="8"
              fill="#fbbf24"
              className="pixel-rect-stepped"
            />
            <rect
              x="90"
              y="-4"
              width="20"
              height="6"
              fill="#fef3c7"
              className="pixel-rect-stepped"
            />
            <rect
              x="74"
              y="6"
              width="6"
              height="4"
              fill="#d97706"
              className="pixel-rect-stepped-indicator"
            />
            <rect
              x="120"
              y="6"
              width="6"
              height="4"
              fill="#d97706"
              className="pixel-rect-stepped-indicator"
            />

            {/* Shield Inner Dark Core */}
            <polygon
              points="26,24 174,24 186,36 186,232 100,296 14,232 14,36"
              fill="#080c14"
            />

            {/* Top Banner Ribbon */}
            <rect
              x="28"
              y="28"
              width="144"
              height="20"
              fill="#141c2b"
              stroke="#253248"
              strokeWidth="1"
              className="pixel-rect-stepped"
            />
            <rect
              x="34"
              y="34"
              width="8"
              height="8"
              fill="#f59e0b"
              className="pixel-rect-stepped-indicator"
            />
            <text
              x="48"
              y="38"
              dominantBaseline="central"
              fill="#fbbf24"
              fontFamily="Silkscreen"
              fontSize="9"
              fontWeight="bold"
            >
              PROOF OF SKILL
            </text>

            {/* Code Interrogation Terminal Display Inside Core */}
            <rect
              x="28"
              y="56"
              width="144"
              height="96"
              fill="#040609"
              stroke="#1c2638"
              strokeWidth="1"
              className="pixel-rect-stepped"
            />

            {/* Terminal Header */}
            <rect
              x="28"
              y="56"
              width="144"
              height="14"
              fill="#0f172a"
              className="pixel-rect-stepped"
            />
            <rect
              x="33"
              y="61"
              width="4"
              height="4"
              fill="#ef4444"
              className="pixel-rect-stepped-indicator"
            />
            <rect
              x="40"
              y="61"
              width="4"
              height="4"
              fill="#f59e0b"
              className="pixel-rect-stepped-indicator"
            />
            <rect
              x="47"
              y="61"
              width="4"
              height="4"
              fill="#10b981"
              className="pixel-rect-stepped-indicator"
            />
            <text
              x="58"
              y="63"
              dominantBaseline="central"
              fill="#64748b"
              fontFamily="JetBrains Mono"
              fontSize="7"
            >
              EXEC_ENV: PYTHON 3.11
            </text>

            {/* Code / Logic Pixel Glyph */}
            <text
              x="34"
              y="80"
              dominantBaseline="central"
              fill="#38bdf8"
              fontFamily="JetBrains Mono"
              fontSize="7.5"
            >
              &gt; def solve(matrix):
            </text>
            <text
              x="42"
              y="92"
              dominantBaseline="central"
              fill="#cbd5e1"
              fontFamily="JetBrains Mono"
              fontSize="7.5"
            >
              &gt; return verify()
            </text>
            <text
              x="34"
              y="104"
              dominantBaseline="central"
              fill="#10b981"
              fontFamily="JetBrains Mono"
              fontSize="7.5"
            >
              &gt; [OK] 12/12 TESTS
            </text>

            {/* Pixel Binary Stream */}
            <rect
              x="34"
              y="112"
              width="132"
              height="1"
              fill="#1e293b"
              className="pixel-rect-stepped"
            />
            <text
              x="34"
              y="122"
              dominantBaseline="central"
              fill="#f59e0b"
              fontFamily="Silkscreen"
              fontSize="7"
            >
              SIG: Ed25519_PASS
            </text>
            <text
              x="34"
              y="134"
              dominantBaseline="central"
              fill="#10b981"
              fontFamily="Silkscreen"
              fontSize="7"
            >
              AI_DEFENSE: APPROVED
            </text>
            <rect
              x="34"
              y="142"
              width="132"
              height="5"
              fill="#064e3b"
              className="pixel-rect-stepped"
            />
            <rect
              x="34"
              y="142"
              width="132"
              height="5"
              fill="#10b981"
              opacity="0.85"
              className="pixel-rect-stepped"
            />

            {/* Large 8-Bit Stamp at Bottom of Shield (Symmetrical width 144) */}
            <g transform="translate(28, 162)">
              {/* Stepped Pixel Stamp Frame */}
              <polygon
                points="0,6 6,0 138,0 144,6 144,38 138,44 6,44 0,38"
                fill="#022c22"
                stroke="#10b981"
                strokeWidth="2"
              />
              <rect
                x="6"
                y="4"
                width="132"
                height="36"
                fill="#041f18"
                className="pixel-rect-stepped"
              />

              {/* Big Pixel Checkmark */}
              <rect
                x="14"
                y="18"
                width="4"
                height="8"
                fill="#34d399"
                className="pixel-rect-stepped-indicator"
              />
              <rect
                x="18"
                y="22"
                width="4"
                height="8"
                fill="#34d399"
                className="pixel-rect-stepped-indicator"
              />
              <rect
                x="22"
                y="14"
                width="4"
                height="8"
                fill="#34d399"
                className="pixel-rect-stepped-indicator"
              />
              <rect
                x="26"
                y="10"
                width="4"
                height="8"
                fill="#34d399"
                className="pixel-rect-stepped-indicator"
              />
              <rect
                x="30"
                y="6"
                width="4"
                height="8"
                fill="#34d399"
                className="pixel-rect-stepped-indicator"
              />

              {/* Stamp Text with generous margin and no overflow */}
              <text
                x="38"
                y="17"
                dominantBaseline="central"
                fill="#34d399"
                fontFamily="Silkscreen"
                fontSize="8"
                fontWeight="bold"
              >
                COMPETENCY
              </text>
              <text
                x="38"
                y="30"
                dominantBaseline="central"
                fill="#fef3c7"
                fontFamily="Silkscreen"
                fontSize="8"
                fontWeight="bold"
              >
                DEMONSTRATED
              </text>
            </g>

            {/* Cryptographic Keyhole Icon near bottom tip */}
            <circle cx="100" cy="244" r="6" fill="#f59e0b" />
            <polygon points="98,244 102,244 104,260 96,260" fill="#f59e0b" />
            <rect
              x="99"
              y="242"
              width="2"
              height="4"
              fill="#05080e"
              className="pixel-rect-stepped-indicator"
            />

            {/* Bottom Tip Accent */}
            <rect
              x="98"
              y="294"
              width="4"
              height="12"
              fill="#f59e0b"
              className="pixel-rect-stepped"
            />
            <rect
              x="99"
              y="306"
              width="2"
              height="4"
              fill="#fbbf24"
              className="pixel-rect-stepped-indicator"
            />
          </g>

          {/* Stepped Corner Pixel Brackets */}
          {/* Top-Left */}
          <rect
            x="8"
            y="8"
            width="16"
            height="4"
            fill="#f59e0b"
            className="pixel-rect-stepped-indicator"
          />
          <rect
            x="8"
            y="8"
            width="4"
            height="16"
            fill="#f59e0b"
            className="pixel-rect-stepped-indicator"
          />

          {/* Top-Right */}
          <rect
            x="656"
            y="8"
            width="16"
            height="4"
            fill="#f59e0b"
            className="pixel-rect-stepped-indicator"
          />
          <rect
            x="668"
            y="8"
            width="4"
            height="16"
            fill="#f59e0b"
            className="pixel-rect-stepped-indicator"
          />

          {/* Bottom-Left */}
          <rect
            x="8"
            y="418"
            width="16"
            height="4"
            fill="#f59e0b"
            className="pixel-rect-stepped-indicator"
          />
          <rect
            x="8"
            y="406"
            width="4"
            height="16"
            fill="#f59e0b"
            className="pixel-rect-stepped-indicator"
          />

          {/* Bottom-Right */}
          <rect
            x="656"
            y="418"
            width="16"
            height="4"
            fill="#f59e0b"
            className="pixel-rect-stepped-indicator"
          />
          <rect
            x="668"
            y="406"
            width="4"
            height="16"
            fill="#f59e0b"
            className="pixel-rect-stepped-indicator"
          />
        </svg>

        {/* Tactical Legend Strip */}
        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-zinc-400 px-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 inline-block" />
              <span>TEST VERIFICATION</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-amber-400 inline-block" />
              <span>AI CODE DEFENSE</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-cyan-400 inline-block" />
              <span>ASYMMETRIC SIGNATURE</span>
            </span>
          </div>
          <span className="font-pixel text-[9px] text-zinc-500 uppercase tracking-widest">
            PORTABLE • UNFORGEABLE • RECRUITER VERIFIED
          </span>
        </div>
      </div>
    </div>
  );
};
