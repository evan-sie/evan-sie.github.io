"use client";

import { useRef, useEffect, useCallback } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const lastMouseUpdate = useRef(0);
  const rafRef = useRef<number>(0);

  // Refs for each blob element — avoid re-rendering
  const spotlightRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutLeftRef = useRef<HTMLDivElement>(null);
  const aboutRightRef = useRef<HTMLDivElement>(null);
  const midPrimaryRef = useRef<HTMLDivElement>(null);
  const midSecondaryRef = useRef<HTMLDivElement>(null);
  const midBronzeRef = useRef<HTMLDivElement>(null);
  const worksLeftRef = useRef<HTMLDivElement>(null);
  const worksRightRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);

  // Update loop — reads refs, writes to DOM directly (no React re-render)
  const updateVisuals = useCallback(() => {
    const p = scrollRef.current;
    const mouse = mouseRef.current;

    // Parallax positions
    const heroY = p * BLOB_MOVEMENT.hero;
    const aboutLeftY = p * BLOB_MOVEMENT.aboutLeft;
    const aboutRightY = p * BLOB_MOVEMENT.aboutRight;
    const midPrimaryY = p * BLOB_MOVEMENT.midPrimary;
    const midSecondaryY = p * BLOB_MOVEMENT.midSecondary;
    const midBronzeY = p * BLOB_MOVEMENT.midBronze;
    const worksY = p * BLOB_MOVEMENT.works;
    const worksRightY = p * BLOB_MOVEMENT.worksRight;

    // Opacity curves
    const heroOp = smoothFade(p, 0.00, 0.00, 0.12, 0.28);
    const aboutLeftOp = smoothFade(p, 0.04, 0.10, 0.24, 0.38);
    const aboutRightOp = smoothFade(p, 0.06, 0.13, 0.28, 0.42);
    const midPrimaryOp = smoothFade(p, 0.18, 0.26, 0.52, 0.62);
    const midSecondaryOp = smoothFade(p, 0.22, 0.30, 0.55, 0.67);
    const midBronzeOp = smoothFade(p, 0.28, 0.36, 0.48, 0.58);
    const worksOp = smoothFade(p, 0.42, 0.52, 0.72, 0.82);
    const worksRightOp = smoothFade(p, 0.48, 0.56, 0.68, 0.78);
    const contactOp = smoothFade(p, 0.68, 0.78, 1.00, 1.01);

    // Direct DOM writes — no setState
    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(circle ${SPOTLIGHT.radius}px at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(${GRADIENT_COLORS.turbonite}, ${SPOTLIGHT.opacity}), transparent 60%)`;
    }
    if (heroRef.current) {
      heroRef.current.style.transform = `translate3d(0, ${heroY}%, 0)`;
      heroRef.current.style.opacity = String(heroOp);
    }
    if (aboutLeftRef.current) {
      aboutLeftRef.current.style.transform = `translate3d(0, ${aboutLeftY}%, 0)`;
      aboutLeftRef.current.style.opacity = String(aboutLeftOp);
    }
    if (aboutRightRef.current) {
      aboutRightRef.current.style.transform = `translate3d(0, ${aboutRightY}%, 0)`;
      aboutRightRef.current.style.opacity = String(aboutRightOp);
    }
    if (midPrimaryRef.current) {
      midPrimaryRef.current.style.transform = `translate3d(0, ${midPrimaryY}%, 0)`;
      midPrimaryRef.current.style.opacity = String(midPrimaryOp);
    }
    if (midSecondaryRef.current) {
      midSecondaryRef.current.style.transform = `translate3d(0, ${midSecondaryY}%, 0)`;
      midSecondaryRef.current.style.opacity = String(midSecondaryOp);
    }
    if (midBronzeRef.current) {
      midBronzeRef.current.style.transform = `translate3d(0, ${midBronzeY}%, 0)`;
      midBronzeRef.current.style.opacity = String(midBronzeOp);
    }
    if (worksLeftRef.current) {
      worksLeftRef.current.style.transform = `translate3d(0, ${worksY}%, 0)`;
      worksLeftRef.current.style.opacity = String(worksOp);
    }
    if (worksRightRef.current) {
      worksRightRef.current.style.transform = `translate3d(0, ${worksRightY}%, 0)`;
      worksRightRef.current.style.opacity = String(worksRightOp);
    }
    if (contactRef.current) {
      contactRef.current.style.opacity = String(contactOp);
    }
    if (horizonRef.current) {
      horizonRef.current.style.transform = `translate3d(0, ${midPrimaryY * 0.3}%, 0)`;
    }
  }, []);

  // Single rAF loop — updates every frame rather than on throttled events
  useEffect(() => {
    let running = true;

    const tick = () => {
      if (!running) return;
      updateVisuals();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateVisuals]);

  // Scroll listener — just updates the ref, no setState
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = scrollHeight > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollHeight)) : 0;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse listener — just updates the ref, no setState
  useEffect(() => {
    const interval = 1000 / SPOTLIGHT.throttleFps;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseUpdate.current < interval) return;
      lastMouseUpdate.current = now;
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base layer */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Global spotlight — follows cursor */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 transform-gpu"
        style={{ transition: `background ${SPOTLIGHT.transition} ease-out` }}
      />

      {/* Hero blob */}
      <div
        ref={heroRef}
        className="absolute transform-gpu will-change-[transform,opacity]"
        style={{
          top: "-15%", left: "5%", width: "90vw", height: "60vh",
          background: `radial-gradient(ellipse at center, rgba(${GRADIENT_COLORS.turbonite}, ${GRADIENT_OPACITY.hero}) 0%, transparent 55%)`,
          filter: `blur(${BLUR_INTENSITY.gradients}px)`,
          opacity: 0,
        }}
      />

      {/* About blob left */}
      <div
        ref={aboutLeftRef}
        className="absolute transform-gpu will-change-[transform,opacity]"
        style={{
          top: "15%", left: "-15%", width: "60vw", height: "55vh",
          background: `radial-gradient(ellipse at center, rgba(${GRADIENT_COLORS.warm}, ${GRADIENT_OPACITY.aboutLeft}) 0%, transparent 50%)`,
          filter: `blur(${BLUR_INTENSITY.gradients}px)`,
          opacity: 0,
        }}
      />

      {/* About blob right */}
      <div
        ref={aboutRightRef}
        className="absolute transform-gpu will-change-[transform,opacity]"
        style={{
          top: "20%", right: "-10%", width: "55vw", height: "50vh",
          background: `radial-gradient(ellipse at center, rgba(${GRADIENT_COLORS.turbonite}, ${GRADIENT_OPACITY.aboutRight}) 0%, transparent 45%)`,
          filter: `blur(${BLUR_INTENSITY.gradients}px)`,
          opacity: 0,
        }}
      />

      {/* Mid blob primary */}
      <div
        ref={midPrimaryRef}
        className="absolute transform-gpu will-change-[transform,opacity]"
        style={{
          top: "10%", left: "0%", width: "100vw", height: "80vh",
          background: `radial-gradient(ellipse 80% 60% at 35% 50%, rgba(${GRADIENT_COLORS.turbonite}, ${GRADIENT_OPACITY.midPrimary}) 0%, transparent 65%)`,
          filter: `blur(${BLUR_INTENSITY.large}px)`,
          opacity: 0,
        }}
      />

      {/* Mid blob secondary */}
      <div
        ref={midSecondaryRef}
        className="absolute transform-gpu will-change-[transform,opacity]"
        style={{
          top: "30%", right: "-5%", width: "65vw", height: "60vh",
          background: `radial-gradient(ellipse at center, rgba(${GRADIENT_COLORS.cool}, ${GRADIENT_OPACITY.midSecondary}) 0%, transparent 55%)`,
          filter: `blur(${BLUR_INTENSITY.large}px)`,
          opacity: 0,
        }}
      />

      {/* Mid blob bronze */}
      <div
        ref={midBronzeRef}
        className="absolute transform-gpu will-change-[transform,opacity]"
        style={{
          top: "25%", left: "20%", width: "45vw", height: "40vh",
          background: `radial-gradient(ellipse at center, rgba(${GRADIENT_COLORS.bronze}, ${GRADIENT_OPACITY.midBronze}) 0%, transparent 50%)`,
          filter: `blur(${BLUR_INTENSITY.large}px)`,
          opacity: 0,
        }}
      />

      {/* Works blob left */}
      <div
        ref={worksLeftRef}
        className="absolute transform-gpu will-change-[transform,opacity]"
        style={{
          top: "5%", left: "-10%", width: "65vw", height: "60vh",
          background: `radial-gradient(ellipse at center, rgba(${GRADIENT_COLORS.turbonite}, ${GRADIENT_OPACITY.works}) 0%, transparent 50%)`,
          filter: `blur(${BLUR_INTENSITY.gradients}px)`,
          opacity: 0,
        }}
      />

      {/* Works blob right */}
      <div
        ref={worksRightRef}
        className="absolute transform-gpu will-change-[transform,opacity]"
        style={{
          top: "15%", right: "-8%", width: "50vw", height: "50vh",
          background: `radial-gradient(ellipse at center, rgba(${GRADIENT_COLORS.warm}, ${GRADIENT_OPACITY.worksRight}) 0%, transparent 45%)`,
          filter: `blur(${BLUR_INTENSITY.gradients}px)`,
          opacity: 0,
        }}
      />

      {/* Contact gradient */}
      <div
        ref={contactRef}
        className="absolute transform-gpu will-change-opacity"
        style={{
          bottom: "-10%", left: "0%", width: "100vw", height: "50vh",
          background: `radial-gradient(ellipse 100% 60% at 50% 100%, rgba(${GRADIENT_COLORS.turbonite}, ${GRADIENT_OPACITY.contact}) 0%, transparent 100%)`,
          filter: `blur(${BLUR_INTENSITY.gradients}px)`,
          opacity: 0,
        }}
      />

      {/* Horizon line */}
      <div
        ref={horizonRef}
        className="absolute transform-gpu will-change-transform"
        style={{
          top: "50%", left: "-10%", width: "120vw", height: "15vh",
          background: "linear-gradient(180deg, transparent 0%, rgba(26, 28, 32, 0.18) 50%, transparent 100%)",
          filter: `blur(${BLUR_INTENSITY.horizon}px)`,
          opacity: GRADIENT_OPACITY.horizon,
        }}
      />
    </div>
  );
}
