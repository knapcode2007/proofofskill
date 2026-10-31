import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Layers, ShieldCheck, Eye, EyeOff, RotateCw, Sparkles, Key } from 'lucide-react';

// Pre-allocate module-level vectors to guarantee zero garbage collection in render loop
const _vec3 = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _tempPos = new THREE.Vector3();

interface ThreeCryptovaultProps {
  className?: string;
  initialExploded?: number;
}

export const ThreeCryptovault: React.FC<ThreeCryptovaultProps> = ({
  className = '',
  initialExploded = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [explodedVal, setExplodedVal] = useState<number>(initialExploded);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeFinish, setActiveFinish] = useState<'gold' | 'obsidian' | 'emerald'>('gold');
  const [activeView, setActiveView] = useState<'iso' | 'top' | 'macro'>('iso');

  // Mutable refs for animation loop
  const stateRef = useRef({
    exploded: initialExploded,
    targetExploded: initialExploded,
    autoRotate: true,
    activeFinish: 'gold' as 'gold' | 'obsidian' | 'emerald',
    cameraTargetPos: new THREE.Vector3(5.5, 4.2, 5.5),
    cameraLookAt: new THREE.Vector3(0, 0, 0),
  });

  // Keep stateRef in sync with React state
  useEffect(() => {
    stateRef.current.targetExploded = explodedVal;
  }, [explodedVal]);

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    stateRef.current.activeFinish = activeFinish;
  }, [activeFinish]);

  // Handle camera view presets
  const handleViewPreset = (view: 'iso' | 'top' | 'macro') => {
    setActiveView(view);
    if (view === 'iso') {
      stateRef.current.cameraTargetPos.set(5.5, 4.2, 5.5);
      stateRef.current.cameraLookAt.set(0, 0.2, 0);
    } else if (view === 'top') {
      stateRef.current.cameraTargetPos.set(0.01, 7.8, 0.01);
      stateRef.current.cameraLookAt.set(0, 0, 0);
    } else if (view === 'macro') {
      stateRef.current.cameraTargetPos.set(2.4, 1.4, 2.4);
      stateRef.current.cameraLookAt.set(0, 0.5, 0);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL from renderer string (Directive 129-148)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Initialize Three.js Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04060a, 0.04);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(5.5, 4.2, 5.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Studio Lighting Rig (Key Light + Cool Fill + Subtle Rim)
    const keyLight = new THREE.DirectionalLight(0xffecd1, 2.2);
    keyLight.position.set(6, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x050811, 1.2);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.4);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.5;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;

    // 6. Assemble Composite 3–12 Part Procedural Cryptographic Vault Model (THREE.Group)
    const vaultGroup = new THREE.Group();
    vaultGroup.position.set(0, -0.4, 0);
    scene.add(vaultGroup);

    // Materials Library with distinctive roughness/metalness ratios
    const materials = {
      baseChassis: new THREE.MeshStandardMaterial({
        color: 0x0b1019,
        metalness: 0.85,
        roughness: 0.38,
      }),
      statorRing: new THREE.MeshStandardMaterial({
        color: 0x1f2937,
        metalness: 0.7,
        roughness: 0.3,
      }),
      goldRotor: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.18,
      }),
      obsidianRotor: new THREE.MeshStandardMaterial({
        color: 0x27272a,
        metalness: 0.9,
        roughness: 0.22,
      }),
      emeraldRotor: new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.88,
        roughness: 0.2,
      }),
      gyroRingOuter: new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.8,
        roughness: 0.25,
      }),
      gyroRingInner: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.85,
        roughness: 0.2,
      }),
      goldPins: new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        metalness: 0.95,
        roughness: 0.15,
      }),
      corePrism: new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        metalness: 0.1,
        roughness: 0.08,
        transmission: isSoftwareGl ? 0 : 0.7,
        transparent: true,
        opacity: isSoftwareGl ? 0.6 : 0.88,
        ior: 1.6,
        thickness: 1.2,
        clearcoat: 1.0,
      }),
      innerSeedDiamond: new THREE.MeshStandardMaterial({
        color: 0x34d399,
        emissive: 0x059669,
        emissiveIntensity: 0.6,
        metalness: 0.3,
        roughness: 0.1,
      }),
    };

    // PART 1: Primary Silhouette — Octagonal Foundation Chassis
    const baseChassisGeo = new THREE.CylinderGeometry(3.0, 3.4, 0.45, 8);
    const baseChassisMesh = new THREE.Mesh(baseChassisGeo, materials.baseChassis);
    baseChassisMesh.castShadow = !isSoftwareGl;
    baseChassisMesh.receiveShadow = !isSoftwareGl;
    vaultGroup.add(baseChassisMesh);

    // PART 2: Outer Stator Segmented Ring
    const statorGeo = new THREE.TorusGeometry(2.6, 0.09, 16, 64);
    const statorMesh = new THREE.Mesh(statorGeo, materials.statorRing);
    statorMesh.rotation.x = Math.PI / 2;
    statorMesh.position.y = 0.25;
    vaultGroup.add(statorMesh);

    // PART 3: Ed25519 Cipher Rotor Assembly (Stepped teeth & cipher discs)
    const rotorGroup = new THREE.Group();
    rotorGroup.position.y = 0.45;
    vaultGroup.add(rotorGroup);

    const rotorCoreGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.16, 32);
    const rotorCoreMesh = new THREE.Mesh(rotorCoreGeo, materials.goldRotor);
    rotorCoreMesh.castShadow = !isSoftwareGl;
    rotorGroup.add(rotorCoreMesh);

    // 16 Stepped Cipher Gear Teeth
    const toothGeo = new THREE.BoxGeometry(0.18, 0.18, 0.32);
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const toothMesh = new THREE.Mesh(toothGeo, materials.goldRotor);
      toothMesh.position.set(Math.cos(angle) * 2.15, 0, Math.sin(angle) * 2.15);
      toothMesh.rotation.y = -angle;
      rotorGroup.add(toothMesh);
    }

    // PART 4 & 5: Gimbal Gyroscopic Rings (Quantum Orbitals)
    const gyroOuterGroup = new THREE.Group();
    gyroOuterGroup.position.y = 0.9;
    vaultGroup.add(gyroOuterGroup);

    const gyroOuterGeo = new THREE.TorusGeometry(1.65, 0.045, 16, 64);
    const gyroOuterMesh = new THREE.Mesh(gyroOuterGeo, materials.gyroRingOuter);
    gyroOuterMesh.rotation.x = Math.PI / 3;
    gyroOuterGroup.add(gyroOuterMesh);

    const gyroInnerGroup = new THREE.Group();
    gyroInnerGroup.position.y = 0.9;
    vaultGroup.add(gyroInnerGroup);

    const gyroInnerGeo = new THREE.TorusGeometry(1.35, 0.04, 16, 64);
    const gyroInnerMesh = new THREE.Mesh(gyroInnerGeo, materials.gyroRingInner);
    gyroInnerMesh.rotation.z = Math.PI / 3.5;
    gyroInnerGroup.add(gyroInnerMesh);

    // PART 6: Central Holographic SHA-256 Seed Core (Faceted Octahedron)
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 1.1;
    vaultGroup.add(coreGroup);

    const corePrismGeo = new THREE.OctahedronGeometry(0.72, 0);
    const corePrismMesh = new THREE.Mesh(corePrismGeo, materials.corePrism);
    coreGroup.add(corePrismMesh);

    // PART 7: Inner Quantum Key Diamond
    const innerDiamondGeo = new THREE.OctahedronGeometry(0.36, 0);
    const innerDiamondMesh = new THREE.Mesh(innerDiamondGeo, materials.innerSeedDiamond);
    coreGroup.add(innerDiamondMesh);

    // PART 8: 8 Radial Gold Terminal Pins / Bus Contacts
    const pinsGroup = new THREE.Group();
    pinsGroup.position.y = 0.1;
    vaultGroup.add(pinsGroup);

    const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 12);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const pinMesh = new THREE.Mesh(pinGeo, materials.goldPins);
      pinMesh.rotation.z = Math.PI / 2;
      pinMesh.rotation.y = -angle;
      pinMesh.position.set(Math.cos(angle) * 3.0, 0, Math.sin(angle) * 3.0);
      pinsGroup.add(pinMesh);
    }

    // PART 9: Zero-Dependency Procedural Soft Radial Contact Shadow Ground Plane (Directives 313-318)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const gradient = shadowCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.4)');
      gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      shadowCtx.fillStyle = gradient;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;

    const shadowPlaneGeo = new THREE.PlaneGeometry(8, 8);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.55,
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.22;
    vaultGroup.add(shadowPlane);

    // PART 10: Instanced Ambient Cryptographic Bit Field (InstancedMesh)
    const particleCount = 28;
    const bitGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const bitMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.65 });
    const instancedBits = new THREE.InstancedMesh(bitGeo, bitMat, particleCount);
    const dummy = new THREE.Object3D();
    const particleAngles = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleHeights = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particleAngles[i] = (i / particleCount) * Math.PI * 2;
      particleRadii[i] = 1.8 + (i % 5) * 0.45;
      particleHeights[i] = 0.2 + (i % 6) * 0.35;
      dummy.position.set(
        Math.cos(particleAngles[i]) * particleRadii[i],
        particleHeights[i],
        Math.sin(particleAngles[i]) * particleRadii[i]
      );
      dummy.updateMatrix();
      instancedBits.setMatrixAt(i, dummy.matrix);
    }
    instancedBits.instanceMatrix.needsUpdate = true;
    instancedBits.computeBoundingSphere();
    vaultGroup.add(instancedBits);

    // 7. Software-WebGL Paced Loop / Standard rAF Loop (Directives 188-230)
    let animationFrameId = 0;
    let clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          animationFrameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          animationFrameId = window.setTimeout(cb, 80);
        }
      };
      animationFrameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const state = stateRef.current;

      // Frame-rate independent exponential damping for exploded view
      state.exploded = THREE.MathUtils.damp(state.exploded, state.targetExploded, 8, delta);
      const exp = state.exploded;

      // Kinematic coordinate spacing on exploded slider
      statorMesh.position.y = 0.25 + exp * 0.4;
      rotorGroup.position.y = 0.45 + exp * 1.1;
      gyroOuterGroup.position.y = 0.9 + exp * 1.7;
      gyroInnerGroup.position.y = 0.9 + exp * 2.2;
      coreGroup.position.y = 1.1 + exp * 2.9;

      // Radial pin expansion
      pinsGroup.children.forEach((child, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const rad = 3.0 + exp * 0.9;
        child.position.set(Math.cos(angle) * rad, 0, Math.sin(angle) * rad);
      });

      // Material finish dynamic updates
      if (state.activeFinish === 'gold') {
        rotorCoreMesh.material = materials.goldRotor;
      } else if (state.activeFinish === 'obsidian') {
        rotorCoreMesh.material = materials.obsidianRotor;
      } else {
        rotorCoreMesh.material = materials.emeraldRotor;
      }

      // Continuous Rotations
      if (state.autoRotate) {
        vaultGroup.rotation.y += delta * 0.25;
      }
      rotorGroup.rotation.y -= delta * 0.6;
      gyroOuterGroup.rotation.y += delta * 0.8;
      gyroInnerGroup.rotation.x -= delta * 0.7;
      corePrismMesh.rotation.y += delta * 0.4;
      corePrismMesh.rotation.x += delta * 0.3;
      innerDiamondMesh.rotation.y -= delta * 0.9;

      // Smooth camera transition to target presets
      camera.position.lerp(state.cameraTargetPos, 0.06);
      controls.target.lerp(state.cameraLookAt, 0.06);
      controls.update();

      // Render
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    }

    // Pre-warm shaders
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    tick();

    // 8. Responsive Resize Handling
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 9. Thorough Cleanup on Unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(animationFrameId);

      // Dispose Geometries and Materials to prevent WebGL leaks
      [
        baseChassisGeo,
        statorGeo,
        rotorCoreGeo,
        toothGeo,
        gyroOuterGeo,
        gyroInnerGeo,
        corePrismGeo,
        innerDiamondGeo,
        pinGeo,
        shadowPlaneGeo,
        bitGeo,
      ].forEach((g) => g.dispose());

      Object.values(materials).forEach((m) => m.dispose());
      shadowTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`relative w-full h-[540px] sm:h-[620px] bg-[#04060a] border border-zinc-800/80 overflow-hidden pixel-card ${className}`}
    >
      {/* 3D SCENE VIEWPORT: Dedicated empty container (100% Unobstructed Center) */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: Minimal Spec Badge */}
      <div className="absolute top-5 left-5 z-20 pointer-events-none space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 px-2 py-0.5">
            CRYPTOGRAPHIC VAULT
          </span>
          <span className="font-mono text-[10px] text-zinc-400">Ed25519 KEY MATRIX</span>
        </div>
        <div className="font-mono text-[11px] text-zinc-400">
          PROVABLE DETERMINISTIC MERKLE ENGINE
        </div>
      </div>

      {/* Top Right: Status Telemetry Indicator (Static typography, zero pulsating dots!) */}
      <div className="absolute top-5 right-5 z-20 pointer-events-none font-mono text-[10px] text-zinc-400 space-y-0.5 text-right hidden sm:block">
        <div>HASH: SHA-256 / CANONICAL</div>
        <div>SIGNATURE: RFC 8032 / EDWARDS25519</div>
        <div className="text-emerald-400 font-pixel">STATUS: LIVE INSPECTION</div>
      </div>

      {/* ERGONOMIC UNIFIED BOTTOM CONTROL DOCK (Directives 360-396) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4 pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center">
          {/* Collapse / Expand Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mb-2 px-3.5 py-1 bg-[#090d15] hover:bg-[#121824] border border-zinc-700 font-pixel text-[10px] text-zinc-300 hover:text-amber-400 transition-colors shadow-lg cursor-reactive-target flex items-center gap-1.5"
          >
            {isCollapsed ? (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>▴ INSPECT 3D VAULT</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                <span>▾ HIDE 3D VAULT</span>
              </>
            )}
          </button>

          {/* Unified Horizontal Control Bar (Smoothly collapses downward) */}
          <div
            className={`w-full transition-all duration-300 ease-in-out ${
              isCollapsed
                ? 'opacity-0 translate-y-6 pointer-events-none h-0 overflow-hidden'
                : 'opacity-100 translate-y-0'
            }`}
          >
            <div className="bg-[#070a0f]/95 border border-zinc-800 p-4 space-y-3.5 shadow-2xl backdrop-blur-none">
              {/* Row 1: Exploded View Slider */}
              <div className="flex items-center justify-between gap-4 font-mono text-xs">
                <span className="font-pixel text-[10px] text-zinc-400 uppercase tracking-wider shrink-0">
                  EXPLODED VIEW:
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explodedVal}
                  onChange={(e) => setExplodedVal(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-zinc-800 rounded-none"
                />
                <span className="font-pixel text-[10px] text-amber-400 shrink-0 w-10 text-right">
                  {Math.round(explodedVal * 100)}%
                </span>
              </div>

              {/* Row 2: Swatches, View Presets, Auto-Rotate */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-800/80 font-pixel text-[10px]">
                {/* Material Finish Swatches */}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400 mr-1 hidden sm:inline">FINISH:</span>
                  <button
                    onClick={() => setActiveFinish('gold')}
                    className={`px-2 py-1 border transition ${
                      activeFinish === 'gold'
                        ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                        : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    GOLD
                  </button>
                  <button
                    onClick={() => setActiveFinish('obsidian')}
                    className={`px-2 py-1 border transition ${
                      activeFinish === 'obsidian'
                        ? 'border-zinc-400 text-zinc-200 bg-zinc-800/40'
                        : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    STEEL
                  </button>
                  <button
                    onClick={() => setActiveFinish('emerald')}
                    className={`px-2 py-1 border transition ${
                      activeFinish === 'emerald'
                        ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                        : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    EMERALD
                  </button>
                </div>

                {/* Camera Presets */}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400 mr-1 hidden sm:inline">VIEW:</span>
                  <button
                    onClick={() => handleViewPreset('iso')}
                    className={`px-2 py-1 border transition ${
                      activeView === 'iso'
                        ? 'border-amber-400 text-amber-400'
                        : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    ISO
                  </button>
                  <button
                    onClick={() => handleViewPreset('top')}
                    className={`px-2 py-1 border transition ${
                      activeView === 'top'
                        ? 'border-amber-400 text-amber-400'
                        : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    TOP
                  </button>
                  <button
                    onClick={() => handleViewPreset('macro')}
                    className={`px-2 py-1 border transition ${
                      activeView === 'macro'
                        ? 'border-amber-400 text-amber-400'
                        : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    CORE
                  </button>
                </div>

                {/* Auto-Rotate Toggle */}
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-2.5 py-1 border flex items-center gap-1 transition ${
                    autoRotate
                      ? 'border-emerald-500/60 text-emerald-400 bg-emerald-500/10'
                      : 'border-zinc-800 text-zinc-400'
                  }`}
                >
                  <RotateCw className="w-3 h-3" />
                  <span>{autoRotate ? 'SPIN ON' : 'SPIN OFF'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
