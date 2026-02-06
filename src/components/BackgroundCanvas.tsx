"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// USER CONFIGURATION SECTION
// ═══════════════════════════════════════════════════════════════════════════

// Parallax movement speeds — per .cursorrules: "y: -50 to 50"
// Higher values = more dramatic scroll-driven movement
const BLOB_MOVEMENT = {
  hero: 45,           // Hero gradient — drifts down fast
  aboutLeft: -40,     // About left — drifts up (counter-scroll)
  aboutRight: 55,     // About right — drifts down fast
  midPrimary: 70,     // Mid spacer primary — long travel distance
  midSecondary: -50,  // Mid spacer secondary — counter-direction for depth
  midBronze: 85,      // Bronze accent — fastest, most dramatic
  works: -45,         // Works — drifts up
  worksRight: 60,     // Works right accent
  contact: 25,        // Contact — slow, grounded
};

// Palette — from .cursorrules Turbonite system
const GRADIENT_COLORS = {
  turbonite: "140, 130, 121",   // #8C8279 — Primary metallic grey-bronze
  bronze: "196, 152, 102",      // #C49866 — 'Legends' accent
  warm: "160, 140, 110",        // Warm mid-tone
  cool: "100, 110, 125",        // Cool steel for depth contrast
};

// Gradient max opacity values — MUCH more prevalent
const GRADIENT_OPACITY = {
  hero: 0.25,
  aboutLeft: 0.15,
  aboutRight: 0.18,
  midPrimary: 0.03,
  midSecondary: 0.10,
  midBronze: 0.08,       // Bronze accent — subtle but visible
  works: 0.16,
  worksRight: 0.12,
  contact: 0.45,
  horizon: 0.5,
};

// Blur intensities (px) — softer = more atmospheric
const BLUR_INTENSITY = {
  gradients: 80,
  large: 100,       // Extra soft for large mid blobs
  horizon: 30,
};

// Spotlight (mouse-following radial glow)
const SPOTLIGHT = {
  radius: 500,
  opacity: 0.04,
  transition: "0.2s",
  throttleFps: 30,
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: smooth fade curve between two scroll points
// ═══════════════════════════════════════════════════════════════════════════
function smoothFade(
  scroll: number,
  fadeIn: number,
  fullStart: number,
  fullEnd: number,
  fadeOut: number,
): number {
  if (scroll < fadeIn || scroll >= fadeOut) return 0;
  if (scroll >= fullStart && scroll <= fullEnd) return 1;
  if (scroll < fullStart) return (scroll - fadeIn) / (fullStart - fadeIn);
  return (fadeOut - scroll) / (fadeOut - fullEnd);
}

// ═══════════════════════════════════════════════════════════════════════════

export default function BackgroundCanvas() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const lastScrollUpdate = useRef(0);
  const lastMouseUpdate = useRef(0);
  const rafRef = useRef<number>(0);

  const updateScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
    setScrollProgress(progress);
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollUpdate.current < 50) return;
      lastScrollUpdate.current = now;
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

  // Global mouse spotlight
  useEffect(() => {
    const interval = 1000 / SPOTLIGHT.throttleFps;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseUpdate.current < interval) return;
      lastMouseUpdate.current = now;
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // SCROLL-BASED PARALLAX TRANSFORMS
  // Each blob moves at a different speed for depth (per .cursorrules)
  // ═══════════════════════════════════════════════════════════════════════
  const p = scrollProgress;

  const heroY = p * BLOB_MOVEMENT.hero;
  const aboutLeftY = p * BLOB_MOVEMENT.aboutLeft;
  const aboutRightY = p * BLOB_MOVEMENT.aboutRight;
  const midPrimaryY = p * BLOB_MOVEMENT.midPrimary;
  const midSecondaryY = p * BLOB_MOVEMENT.midSecondary;
  const midBronzeY = p * BLOB_MOVEMENT.midBronze;
  const worksY = p * BLOB_MOVEMENT.works;
  const worksRightY = p * BLOB_MOVEMENT.worksRight;

  // ═══════════════════════════════════════════════════════════════════════
  // OPACITY CURVES — wider overlapping ranges for seamless transitions
  // ═══════════════════════════════════════════════════════════════════════

  //                                fadeIn  fullStart  fullEnd  fadeOut
  const heroOp        = smoothFade(p, 0.00, 0.00, 0.12, 0.28);
  const aboutLeftOp   = smoothFade(p, 0.04, 0.10, 0.24, 0.38);
  const aboutRightOp  = smoothFade(p, 0.06, 0.13, 0.28, 0.42);
  // Mid blobs — wide range to fill the massive spacers
  const midPrimaryOp  = smoothFade(p, 0.18, 0.26, 0.52, 0.62);
  const midSecondaryOp= smoothFade(p, 0.22, 0.30, 0.55, 0.67);
  const midBronzeOp   = smoothFade(p, 0.28, 0.36, 0.48, 0.58);
  // Works blobs
  const worksOp       = smoothFade(p, 0.42, 0.52, 0.72, 0.82);
  const worksRightOp  = smoothFade(p, 0.48, 0.56, 0.68, 0.78);
  // Contact
  const contactOp     = smoothFade(p, 0.68, 0.78, 1.00, 1.01);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base layer */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* ─── GLOBAL SPOTLIGHT ─── follows cursor across entire page */}
      <div
        className="absolute inset-0 transform-gpu"
        style={{
          background: `radial-gradient(circle ${SPOTLIGHT.radius}px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(${GRADIENT_COLORS.turbonite}, ${SPOTLIGHT.opacity}), transparent 60%)`,
          transition: `background ${SPOTLIGHT.transition} ease-out`,
        }}
      />

      {/* ─── HERO BLOB ─── large turbonite glow, top center */}
      <div
        className="absolute transform-gpu"
        style={{
          top: "-15%",
          left: "5%",
          width: "90vw",
          height: "60vh",
          background: `radial-gradient(ellipse at center, rgba(${GRADIENT_COLORS.turbonite}, ${GRADIENT_OPACITY.hero}) 0%, transparent 55%)`,
          filter: `blur(${BLUR_INTENSITY.gradients}px)`,
          transform: `translate3d(0, ${heroY}%, 0)`,
          opacity: heroOp,
        }}
      />

      {/* ─── ABOUT BLOB LEFT ─── warm accent, counter-scrolls upward */}
      <div
        className="absolute transform-gpu"
        style={{
          top: "15%",
          left: "-15%",
          width: "60vw",
          height: "55vh",
          background: `radial-gradient(ellipse at center, rgba(${GRADIENT_COLORS.warm}, ${GRADIENT_OPACITY.aboutLeft}) 0%, transparent 50%)`,
          filter: `blur(${BLUR_INTENSITY.gradients}px)`,
          transform: `translate3d(0, ${aboutLeftY}%, 0)`,
          opacity: aboutLeftOp,
        }}
      />

      {/* ─── ABOUT BLOB RIGHT ─── turbonite, drifts down fast */}
      <div
        className="absolute transform-gpu"
        style={{
          top: "20%",
          right: "-10%",
          width: "55vw",
          height: "50vh",
          background: `radial-gradient(ellipse at center, rgba(${GRADIENT_COLORS.turbonite}, ${GRADIENT_OPACITY.aboutRight}) 0%, transparent 45%)`,
          filter: `blur(${BLUR_INTENSITY.gradients}px)`,
          transform: `translate3d(0, ${aboutRightY}%, 0)`,
          opacity: aboutRightOp,
        }}
      />

      {/* ─── MID BLOB PRIMARY ─── massive, fills spacer between About/Quote/Engineering */}
      <div
        className="absolute transform-gpu"
        style={{
          top: "10%",
          left: "0%",
          width: "100vw",
          height: "80vh",
          background: `radial-gradient(ellipse 80% 60% at 35% 50%, rgba(${GRADIENT_COLORS.turbonite}, ${GRADIENT_OPACITY.midPrimary}) 0%, transparent 65%)`,
          filter: `blur(${BLUR_INTENSITY.large}px)`,
          transform: `translate3d(0, ${midPrimaryY}%, 0)`,
          opacity: midPrimaryOp,
        }}
      />

      {/* ─── MID BLOB SECONDARY ─── cool steel, counter-direction for depth */}
      <div
        className="absolute transform-gpu"
        style={{
          top: "30%",
          right: "-5%",
          width: "65vw",
          height: "60vh",
          background: `radial-gradient(ellipse at center, rgba(${GRADIENT_COLORS.cool}, ${GRADIENT_OPACITY.midSecondary}) 0%, transparent 55%)`,
          filter: `blur(${BLUR_INTENSITY.large}px)`,
          transform: `translate3d(0, ${midSecondaryY}%, 0)`,
          opacity: midSecondaryOp,
        }}
      />

      {/* ─── MID BLOB BRONZE ─── 'Legends' accent, fastest parallax */}
      <div
        className="absolute transform-gpu"
        style={{
          top: "25%",
          left: "20%",
          width: "45vw",
          height: "40vh",
          background: `radial-gradient(ellipse at center, rgba(${GRADIENT_COLORS.bronze}, ${GRADIENT_OPACITY.midBronze}) 0%, transparent 50%)`,
          filter: `blur(${BLUR_INTENSITY.large}px)`,
          transform: `translate3d(0, ${midBronzeY}%, 0)`,
          opacity: midBronzeOp,
        }}
      />

      {/* ─── WORKS BLOB LEFT ─── turbonite, drifts up during Engineering */}
      <div
        className="absolute transform-gpu"
        style={{
          top: "5%",
          left: "-10%",
          width: "65vw",
          height: "60vh",
          background: `radial-gradient(ellipse at center, rgba(${GRADIENT_COLORS.turbonite}, ${GRADIENT_OPACITY.works}) 0%, transparent 50%)`,
          filter: `blur(${BLUR_INTENSITY.gradients}px)`,
          transform: `translate3d(0, ${worksY}%, 0)`,
          opacity: worksOp,
        }}
      />

      {/* ─── WORKS BLOB RIGHT ─── warm accent, drifts down */}
      <div
        className="absolute transform-gpu"
        style={{
          top: "15%",
          right: "-8%",
          width: "50vw",
          height: "50vh",
          background: `radial-gradient(ellipse at center, rgba(${GRADIENT_COLORS.warm}, ${GRADIENT_OPACITY.worksRight}) 0%, transparent 45%)`,
          filter: `blur(${BLUR_INTENSITY.gradients}px)`,
          transform: `translate3d(0, ${worksRightY}%, 0)`,
          opacity: worksRightOp,
        }}
      />

      {/* ─── CONTACT GRADIENT ─── rises from bottom */}
      <div
        className="absolute transform-gpu"
        style={{
          bottom: "-10%",
          left: "0%",
          width: "100vw",
          height: "50vh",
          background: `radial-gradient(ellipse 100% 60% at 50% 100%, rgba(${GRADIENT_COLORS.turbonite}, ${GRADIENT_OPACITY.contact}) 0%, transparent 100%)`,
          filter: `blur(${BLUR_INTENSITY.gradients}px)`,
          opacity: contactOp,
        }}
      />

      {/* ─── HORIZON LINE ─── always visible, subtle depth cue */}
      <div
        className="absolute transform-gpu"
        style={{
          top: "50%",
          left: "-10%",
          width: "120vw",
          height: "15vh",
          background: "linear-gradient(180deg, transparent 0%, rgba(26, 28, 32, 0.18) 50%, transparent 100%)",
          filter: `blur(${BLUR_INTENSITY.horizon}px)`,
          transform: `translate3d(0, ${midPrimaryY * 0.3}%, 0)`,
          opacity: GRADIENT_OPACITY.horizon,
        }}
      />
    </div>
  );
}
