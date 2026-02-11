"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import TextScramble from "./TextScramble";
import { appleEase } from "@/lib/constants";

// ═══════════════════════════════════════════════════════════════════════════
// TEXT SCRAMBLE CONFIG - Timing for the decode effect
// ═══════════════════════════════════════════════════════════════════════════
const SCRAMBLE_DELAY = 1000; // ms - starts slightly before fade-in so scramble is active during reveal
const SCRAMBLE_DURATION = 2200; // ms - total decode duration

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE TEXT POSITION CONFIG - Adjust this to move hero text on mobile
// ═══════════════════════════════════════════════════════════════════════════
const MOBILE_TEXT_OFFSET_Y = -130; // Negative = up, Positive = down (in pixels)

function TechnicalDataPoint({
  position,
  label,
  value
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  label: string;
  value: string;
}) {
  const positionClasses = {
    "top-left": "top-6 left-6 md:top-12 md:left-12",
    "top-right": "top-6 right-6 md:top-12 md:right-12 text-right",
    "bottom-left": "bottom-24 left-6 md:bottom-28 md:left-12",
    "bottom-right": "bottom-24 right-6 md:bottom-28 md:right-12 text-right",
  };

  return (
    <motion.div
      className={`absolute ${positionClasses[position]} font-mono text-[10px] text-turbonite-base/40 uppercase tracking-wider z-[5]`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.0, duration: 0.8, ease: appleEase }}
    >
      <div className="text-turbonite-highlight/30 mb-1">{label}</div>
      <div className="text-turbonite-base/50">{value}</div>
    </motion.div>
  );
}

function Crosshair({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const positionClasses = {
    "top-left": "top-20 left-20 md:top-28 md:left-28",
    "top-right": "top-20 right-20 md:top-28 md:right-28",
    "bottom-left": "bottom-32 left-20 md:bottom-40 md:left-28",
    "bottom-right": "bottom-32 right-20 md:bottom-40 md:right-28",
  };

  return (
    <motion.div
      className={`absolute ${positionClasses[position]} text-turbonite-base/15 font-mono text-lg z-[5]`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.8, duration: 0.6, ease: appleEase }}
    >
      +
    </motion.div>
  );
}

function ScrollIndicator() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setExpanded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-[5]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5, duration: 0.8, ease: appleEase }}
    >
      <span className="text-[15px] font-mono tracking-[0.25em] text-turbonite-base/40 uppercase py-8">
        Scroll
      </span>
    </motion.div>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrambleComplete, setIsScrambleComplete] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollY } = useScroll();
  // const titleY = useTransform(scrollY, [0, 800], [0, 200]);
  const titleOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.55,
        delayChildren: 1.5, // 1.5s delay - plane flies in first
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: appleEase,
      },
    },
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden bg-transparent"
    >
      {/* SVG Grid Background - z-0 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="rgba(242, 242, 242, 0.015)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Technical data points - z-[5] */}
      <TechnicalDataPoint position="top-left" label="" value="   // DALLAS, TX" />
      <TechnicalDataPoint position="top-right" label="Ver" value="v2025.12.25" />
      <TechnicalDataPoint position="bottom-left" label="" value="" />
      {/* Hide Lockheed text on mobile - competes with scroll indicator */}
      {!isMobile && (
        <TechnicalDataPoint position="bottom-right" label="Lockheed" value="//SR-71 Blackbird A" />
      )}

      {/* Crosshairs - z-[5] */}
      <Crosshair position="top-left" />
      <Crosshair position="top-right" />
      <Crosshair position="bottom-left" />
      <Crosshair position="bottom-right" />

      {/* Main Typography - z-10 (plane at z-20 flies OVER this) */}
      {/* Wrapper for mobile vertical offset */}
      <div
        className="relative z-10 w-full flex flex-col items-center justify-center"
        style={{
          transform: `translateY(${isMobile ? MOBILE_TEXT_OFFSET_Y : 0}px)`,
        }}
      >
        <motion.div
          className="relative text-center px-4 sm:px-6 w-full flex flex-col items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            // y: titleY,
            opacity: titleOpacity,
          }}
        >
          <motion.p
            className="text-[10px] sm:text-xs md:text-sm tracking-[0.3em] sm:tracking-[0.4em] text-turbonite-highlight uppercase mb-4 sm:mb-6 md:mb-8 font-mono text-center"
            variants={itemVariants}
          >
            B.S. Mechanical Engineering
          </motion.p>

          <motion.h1
            className={`relative text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] font-bold uppercase tracking-tight text-engineering-white leading-none group text-center ${isScrambleComplete ? "cursor-pointer" : "pointer-events-none"
              }`}
            variants={itemVariants}
            data-cursor-default={isScrambleComplete ? "false" : "true"}
            whileHover={isScrambleComplete ? {
              scale: 1.015,
              y: -4,
              opacity: 0.2,
            } : undefined}
            transition={{ duration: 0.4, ease: appleEase }}
            onClick={isScrambleComplete ? () => {
              const aboutSection = document.getElementById("about");
              if (aboutSection) {
                const lenis = (window as unknown as { lenis?: Lenis }).lenis;
                if (lenis) {
                  lenis.scrollTo(aboutSection, {
                    duration: 1.0,
                    easing: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
                  });
                } else {
                  aboutSection.scrollIntoView({ behavior: "smooth" });
                }
              }
            } : undefined}
          >
            {/* Subtle hover glow effect - only when interactive */}
            {isScrambleComplete && (
              <span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                aria-hidden="true"
              />
            )}
            {/* Text with scramble decode effect */}
            <span className="relative inline-block">
              <TextScramble
                text="Evan Sie"
                delay={SCRAMBLE_DELAY}
                duration={SCRAMBLE_DURATION}
                onComplete={() => setIsScrambleComplete(true)}
              />
            </span>
          </motion.h1>

          <motion.p
            className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.3em] text-turbonite-base/70 uppercase font-mono text-center"
            variants={itemVariants}
          >
            University of Texas at Dallas
          </motion.p>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
