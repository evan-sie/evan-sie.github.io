"use client";

import { useRef, useMemo, Suspense, useEffect, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { appleEase } from "@/lib/constants";

// Shared scroll state
const scrollState = { progress: 0 };

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                        CALIBRATION CONSTANTS                                  ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// MASTER SCALE
const MODEL_SCALE = 0.05;

// PIVOT CORRECTION
const MESH_OFFSET_X = 50;
const MESH_OFFSET_Y = 0;
const MESH_OFFSET_Z = 100;
const MESH_ROTATION_Y = Math.PI;

// AFTERBURNER CONFIG
const AFTERBURNER = {
  leftPos: [-1.19, 0.77, 5.0] as [number, number, number],
  rightPos: [1.25, 0.77, 5.0] as [number, number, number],
  scale: 1.5,
  length: 3,
  radius: 0.15,
  // Flicker animation parameters
  flickerSpeed: 42,           // Base frequency
  flickerIntensity: 0.02,     // Opacity variation range
  baseOpacity: 0.01,
};

// ENGINE NACELLE OUTLINES
const ENGINE_CONFIG = {
  enabled: true,
  leftPos: [-1.19, 0.79, 1.13] as [number, number, number],
  rightPos: [1.25, 0.77, 1.13] as [number, number, number],
  radius: 0.28,
  length: 3.19,
  segments: 10,
  color: "#8C8279",
  opacity: 0.2,
};

// DEBUG MODE
const DEBUG_AXES = false;

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                           INTRO ANIMATION                                     ║
// ║  Plane "wooshes" in from far away before text reveals                        ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

const INTRO = {
  startZ: -20,                // Start far away
  endZ: 0,                    // End at origin
  duration: 1.5,              // Seconds to fly in
  easing: (t: number) => 1 - Math.pow(1 - t, 3), // Ease out cubic
};

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                           EDGE WIREFRAME CONFIG                               ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

const EDGE_CONFIG = {
  thresholdAngle: 11.27,
  color: "#8C8279",
  opacity: 0.4,
};

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                           ANIMATION CONFIG                                    ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

const ANIMATION = {
  bob: { amplitude: 0.25, speed: 0.5 },
  bank: { amplitude: 0.25, speed: 0.3, pitchFactor: 0.25 },
  yaw: { amplitude: 0.04, speed: 0.2 },
  lerpFactor: 0.3,
};

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                           CAMERA KEYFRAMES CONFIG                             ║
// ║  Interpolate between these states based on scroll position                   ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

// Desktop camera keyframes
const CAMERA_KEYFRAMES_DESKTOP = [
  { scroll: 0.0, pos: [-4, 3, -8], target: [0, 1, -2], label: "Hero" },
  { scroll: 0.13, pos: [-4, 4, -8], target: [1, 1.5, -4], label: "About" },
  // { scroll: 0.24, pos: [-4, 4, -5],    target: [1, 1.5, 0],  label: "About" },
  // { scroll: 0.39, pos: [-9, 3, -4],    target: [1, 1.5, -4],  label: "About" },
  { scroll: 0.57, pos: [-3, 3, 9], target: [1.0, 1, -6], label: "Engineering" },
  // { scroll: 0.7,  pos: [-3, 2, 9],     target: [1.0, 1, -6],  label: "Engineering" },
  { scroll: 1.0, pos: [-2, -3, 11], target: [-3.5, 5, -9], label: "Contact" },
];

// Mobile camera keyframes - centered SR-71 on contact page
const CAMERA_KEYFRAMES_MOBILE = [
  { scroll: 0.0, pos: [-4, 3, -8], target: [0, 3, -2], label: "Hero" },
  { scroll: 0.13, pos: [-3, 4, -6], target: [0, 1, -2], label: "About" },
  // { scroll: 0, pos: [-3, 4, -6],    target: [0, 1, -2],   label: "About" },
  { scroll: 0.67, pos: [-3, 3, 9], target: [1.0, 1, -6], label: "Engineering" },
  // { scroll: 0.786453,  pos: [-3, 3, 9],     target: [1.0, 1, -6],  label: "Engineering" },
  // Mobile contact: SR-71 centered, viewed from below
  { scroll: 1.0, pos: [0, 4, 12], target: [0, 10, -3], label: "Contact" },
];

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                           SCENE CONFIG                                        ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

const SCENE = {
  ambientIntensity: 0.1,
  keyLight: { position: [5, 10, 5] as [number, number, number], intensity: 0.8, color: "#F2F2F2" },
  rimLight: { position: [-5, 2, -5] as [number, number, number], intensity: 0.5, color: "#C49866" },
};

// ============================================================================
// PROCEDURAL ENGINE NACELLE
// ============================================================================
function EngineNacelle({ position }: { position: [number, number, number] }) {
  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(
      ENGINE_CONFIG.radius,
      ENGINE_CONFIG.radius * 0.8,
      ENGINE_CONFIG.length,
      ENGINE_CONFIG.segments,
      1,
      true
    );
    return new THREE.EdgesGeometry(geo, 1);
  }, []);

  return (
    <lineSegments position={position} rotation={[Math.PI / 2, 0, 0]} geometry={geometry}>
      <lineBasicMaterial
        color={ENGINE_CONFIG.color}
        transparent
        opacity={ENGINE_CONFIG.opacity}
      />
    </lineSegments>
  );
}

// ============================================================================
// FLICKERING AFTERBURNER
// ============================================================================
function Afterburner({ position }: { position: [number, number, number] }) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;

    const t = clock.elapsedTime;
    const { flickerSpeed, flickerIntensity, baseOpacity } = AFTERBURNER;

    // Multi-frequency flicker for realistic effect
    const flicker =
      Math.sin(t * flickerSpeed) * 0.4 +
      Math.sin(t * flickerSpeed * 1.7 + 1.3) * 0.35 +
      Math.sin(t * flickerSpeed * 2.3 + 2.1) * 0.25;

    const normalizedFlicker = (flicker + 1) / 2; // 0 to 1
    materialRef.current.opacity = baseOpacity + normalizedFlicker * flickerIntensity;
    materialRef.current.emissiveIntensity = 1.0 + normalizedFlicker * 0.8;
  });

  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]} scale={AFTERBURNER.scale}>
      <coneGeometry args={[AFTERBURNER.radius, AFTERBURNER.length, 6]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#FF6B35"
        emissive="#FFAA00"
        emissiveIntensity={0.4}
        wireframe
        transparent
        opacity={AFTERBURNER.baseOpacity}
      />
    </mesh>
  );
}

// ============================================================================
// SR-71 MODEL with Intro Animation
// ============================================================================
function SR71Model() {
  const groupRef = useRef<THREE.Group>(null);
  const introProgress = useRef(0);
  const startTime = useRef<number | null>(null);
  const { scene } = useGLTF("/sr71.gltf");

  // Create clean edge wireframe
  const edgeLines = useMemo(() => {
    const lines: THREE.LineSegments[] = [];

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geometry = mesh.geometry;

        const edgesGeometry = new THREE.EdgesGeometry(geometry, EDGE_CONFIG.thresholdAngle);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: EDGE_CONFIG.color,
          transparent: true,
          opacity: EDGE_CONFIG.opacity,
        });

        const lineSegments = new THREE.LineSegments(edgesGeometry, lineMaterial);
        lineSegments.position.copy(mesh.position);
        lineSegments.rotation.copy(mesh.rotation);
        lineSegments.scale.copy(mesh.scale);

        lines.push(lineSegments);
      }
    });

    return lines;
  }, [scene]);

  // Animation loop with intro fly-in
  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Initialize start time
    if (startTime.current === null) {
      startTime.current = clock.elapsedTime;
    }

    // Intro animation (plane flies in from far away)
    const introElapsed = clock.elapsedTime - startTime.current;
    if (introElapsed < INTRO.duration) {
      introProgress.current = INTRO.easing(introElapsed / INTRO.duration);
    } else {
      introProgress.current = 1;
    }

    const introZ = THREE.MathUtils.lerp(INTRO.startZ, INTRO.endZ, introProgress.current);

    const elapsed = clock.elapsedTime;
    const { bob, bank, yaw, lerpFactor } = ANIMATION;

    const autoBob = Math.sin(elapsed * bob.speed) * bob.amplitude;
    const autoBank = Math.cos(elapsed * bank.speed) * bank.amplitude;
    const autoYaw = Math.sin(elapsed * yaw.speed) * yaw.amplitude;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      autoBank * bank.pitchFactor,
      lerpFactor
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      autoYaw,
      lerpFactor
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      autoBank,
      lerpFactor
    );

    // Apply intro animation to Z position + bob
    groupRef.current.position.y = autoBob;
    groupRef.current.position.z = introZ;
  });

  return (
    <group ref={groupRef} position={[0, 0, INTRO.startZ]}>
      {DEBUG_AXES && <axesHelper args={[5]} />}

      {/* GLTF Model */}
      <group scale={MODEL_SCALE}>
        <group
          position={[MESH_OFFSET_X, MESH_OFFSET_Y, MESH_OFFSET_Z]}
          rotation={[0, MESH_ROTATION_Y, 0]}
        >
          {edgeLines.map((line, i) => (
            <primitive key={i} object={line} />
          ))}
        </group>
      </group>

      {/* Procedural Engine Nacelles */}
      {ENGINE_CONFIG.enabled && (
        <>
          <EngineNacelle position={ENGINE_CONFIG.leftPos} />
          <EngineNacelle position={ENGINE_CONFIG.rightPos} />
        </>
      )}

      {/* Flickering Afterburners */}
      <Afterburner position={AFTERBURNER.leftPos} />
      <Afterburner position={AFTERBURNER.rightPos} />
    </group>
  );
}

// ============================================================================
// FLIGHT DIRECTOR (Keyframe-based camera)
// ============================================================================
function FlightDirector({ isMobile }: { isMobile: boolean }) {
  const { camera } = useThree();
  const currentPosition = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  // Select keyframes based on device
  const KEYFRAMES = isMobile ? CAMERA_KEYFRAMES_MOBILE : CAMERA_KEYFRAMES_DESKTOP;

  useEffect(() => {
    const firstKeyframe = KEYFRAMES[0];
    currentPosition.current.set(...firstKeyframe.pos as [number, number, number]);
    currentLookAt.current.set(...firstKeyframe.target as [number, number, number]);
    camera.position.copy(currentPosition.current);
    camera.lookAt(currentLookAt.current);
  }, [camera, KEYFRAMES]);

  useFrame(() => {
    const progress = scrollState.progress;

    // Find the two keyframes we're between
    let startKeyframe = KEYFRAMES[0];
    let endKeyframe = KEYFRAMES[1];

    for (let i = 0; i < KEYFRAMES.length - 1; i++) {
      if (progress >= KEYFRAMES[i].scroll && progress <= KEYFRAMES[i + 1].scroll) {
        startKeyframe = KEYFRAMES[i];
        endKeyframe = KEYFRAMES[i + 1];
        break;
      }
    }

    // If past last keyframe, stay at last
    if (progress >= KEYFRAMES[KEYFRAMES.length - 1].scroll) {
      startKeyframe = KEYFRAMES[KEYFRAMES.length - 1];
      endKeyframe = startKeyframe;
    }

    // Calculate segment progress
    const segmentRange = endKeyframe.scroll - startKeyframe.scroll;
    const segmentProgress = segmentRange > 0
      ? (progress - startKeyframe.scroll) / segmentRange
      : 1;

    // Smooth easing
    const easedProgress = segmentProgress < 0.5
      ? 2 * segmentProgress * segmentProgress
      : 1 - Math.pow(-2 * segmentProgress + 2, 2) / 2;

    // Interpolate position and lookAt
    targetPosition.current.set(
      THREE.MathUtils.lerp(startKeyframe.pos[0], endKeyframe.pos[0], easedProgress),
      THREE.MathUtils.lerp(startKeyframe.pos[1], endKeyframe.pos[1], easedProgress),
      THREE.MathUtils.lerp(startKeyframe.pos[2], endKeyframe.pos[2], easedProgress)
    );
    targetLookAt.current.set(
      THREE.MathUtils.lerp(startKeyframe.target[0], endKeyframe.target[0], easedProgress),
      THREE.MathUtils.lerp(startKeyframe.target[1], endKeyframe.target[1], easedProgress),
      THREE.MathUtils.lerp(startKeyframe.target[2], endKeyframe.target[2], easedProgress)
    );

    // Smooth camera movement
    currentPosition.current.lerp(targetPosition.current, 0.08);
    currentLookAt.current.lerp(targetLookAt.current, 0.08);

    camera.position.copy(currentPosition.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

// ============================================================================
// STREAMLINES
// ============================================================================
function Streamlines() {
  const particlesRef = useRef<{ mesh: THREE.Line; speed: number; xOffset: number; yOffset: number }[]>([]);

  const particles = useMemo(() => {
    const result: typeof particlesRef.current = [];
    const count = 20;
    const spreadX = 6;
    const spreadY = 8;

    for (let i = 0; i < count; i++) {
      const xOffset = (Math.random() - 0.5) * spreadX;
      const yOffset = (Math.random() - 0.5) * spreadY;
      const length = 1.5 + Math.random() * 2;
      const speed = 2 + Math.random() * 2;
      const initialZ = -8 - Math.random() * 4;

      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: EDGE_CONFIG.color,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Line(geometry, material);
      mesh.position.set(xOffset, yOffset, initialZ);

      result.push({ mesh, speed, xOffset, yOffset });
    }

    particlesRef.current = result;
    return result;
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;

    particlesRef.current.forEach((particle) => {
      particle.mesh.position.z += particle.speed * 0.03;

      const waveX = Math.sin(elapsed * 0.5 + particle.xOffset) * 0.3;
      const waveY = Math.cos(elapsed * 0.3 + particle.yOffset) * 0.2;
      particle.mesh.position.x = particle.xOffset + waveX;
      particle.mesh.position.y = particle.yOffset + waveY;

      if (particle.mesh.position.z > 12) {
        particle.mesh.position.z = -10 - Math.random() * 2;
        particle.xOffset = (Math.random() - 0.5) * 8;
        particle.yOffset = (Math.random() - 0.5) * 4;
      }

      const mat = particle.mesh.material as THREE.LineBasicMaterial;
      const fadeIn = Math.min(1, (particle.mesh.position.z + 10) / 4);
      const fadeOut = Math.min(1, (12 - particle.mesh.position.z) / 4);
      mat.opacity = 0.2 * fadeIn * fadeOut;
    });
  });

  return (
    <group>
      {particles.map((particle, i) => (
        <primitive key={i} object={particle.mesh} />
      ))}
    </group>
  );
}

// ============================================================================
// SCENE
// ============================================================================
function Scene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <FlightDirector isMobile={isMobile} />
      <SR71Model />
      <Streamlines />

      <ambientLight intensity={SCENE.ambientIntensity} />
      <directionalLight
        position={SCENE.keyLight.position}
        intensity={SCENE.keyLight.intensity}
        color={SCENE.keyLight.color}
      />
      <pointLight
        position={SCENE.rimLight.position}
        intensity={SCENE.rimLight.intensity}
        color={SCENE.rimLight.color}
      />
    </>
  );
}

// ============================================================================
// FALLBACK
// ============================================================================
function Fallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="-50 -60 100 120" className="w-full h-full max-w-md opacity-20" stroke={EDGE_CONFIG.color} strokeWidth="0.4" fill="none">
        <path d="M0,-55 L2,-30 L3,-10 L3,25 L0,35 L-3,25 L-3,-10 L-2,-30 Z" />
        <path d="M3,0 L40,30 L5,25 Z" />
        <path d="M-3,0 L-40,30 L-5,25 Z" />
      </svg>
    </div>
  );
}

// ============================================================================
// MAIN EXPORT
// ============================================================================
interface AeroWireframeProps {
  className?: string;
}

export default function AeroWireframe({ className }: AeroWireframeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastUpdate = useRef(0);
  const rafRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const updateScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
    scrollState.progress = Math.max(0, Math.min(1, progress));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastUpdate.current < 16) return;
      lastUpdate.current = now;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateScroll]);

  // Mobile: larger FOV makes plane appear smaller/further away
  const fov = isMobile ? 115 : 65;

  // Select initial camera position based on device
  const initialCameraPos = (isMobile ? CAMERA_KEYFRAMES_MOBILE : CAMERA_KEYFRAMES_DESKTOP)[0].pos as [number, number, number];

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: appleEase }}
    >
      <Suspense fallback={<Fallback />}>
        <Canvas
          camera={{ position: initialCameraPos, fov }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
          style={{ background: "transparent" }}
        >
          <Scene isMobile={isMobile} />
        </Canvas>
      </Suspense>
    </motion.div>
  );
}

// Preload the model
useGLTF.preload("/sr71.gltf");
