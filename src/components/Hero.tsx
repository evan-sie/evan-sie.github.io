"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";

const appleEase = [0.16, 1, 0.3, 1] as const;

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
      transition={{ delay: 2.2, duration: 0.6, ease: appleEase }}
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
      <span className="text-[8px] font-mono tracking-[0.25em] text-turbonite-base/40 uppercase mb-3">
        Scroll
      </span>
      <motion.div
        className="w-px bg-turbonite-highlight/40"
        initial={{ height: 1 }}
        animate={{ height: expanded ? 50 : 1 }}
        transition={{ duration: 1, ease: appleEase }}
      />
    </motion.div>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0.5, y: 0.5 });
  const lastUpdate = useRef(0);

  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 800], [0, 200]);
  const titleOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Throttled mouse move for spotlight - 30fps is enough for smooth effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - lastUpdate.current < 33) return; // ~30fps throttle
    lastUpdate.current = now;

    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setSpotlightPos({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
                stroke="rgba(242, 242, 242, 0.035)" 
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Spotlight effect - z-[1] */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] transform-gpu"
        style={{
          background: `radial-gradient(circle 600px at ${spotlightPos.x * 100}% ${spotlightPos.y * 100}%, rgba(140, 130, 121, 0.1), transparent 60%)`,
          transition: "background 0.15s ease-out",
        }}
      />

      {/* Technical data points - z-[5] */}
      <TechnicalDataPoint position="top-left" label="" value="   // DALLAS, TX" />
      <TechnicalDataPoint position="top-right" label="Ver" value="v2025.12.25" />
      <TechnicalDataPoint position="bottom-left" label="" value="" />
      <TechnicalDataPoint position="bottom-right" label="Lockheed" value="//SR-71 Blackbird A" />

      {/* Crosshairs - z-[5] */}
      <Crosshair position="top-left" />
      <Crosshair position="top-right" />
      <Crosshair position="bottom-left" />
      <Crosshair position="bottom-right" />

      {/* Main Typography - z-10 (plane at z-20 flies OVER this) */}
      <motion.div
        className="relative text-center z-10 px-4 sm:px-6 w-full flex flex-col items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y: titleY, opacity: titleOpacity }}
      >
        <motion.p
          className="text-[10px] sm:text-xs md:text-sm tracking-[0.3em] sm:tracking-[0.4em] text-turbonite-highlight uppercase mb-4 sm:mb-6 md:mb-8 font-mono text-center"
          variants={itemVariants}
        >
          B.S. Mechanical Engineering
        </motion.p>

        <motion.h1
          className="relative text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] font-bold uppercase tracking-tight text-engineering-white leading-none cursor-pointer group text-center"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.015, 
            y: -4,
            opacity: 0.2,
          }}
          transition={{ duration: 0.4, ease: appleEase }}
          onClick={() => {
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
          }}
        >
          {/* Subtle hover glow effect */}
          <span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            aria-hidden="true"
          />
          {/* Text as single unit */}
          <span className="relative inline-block">
            Evan Sie
          </span>
        </motion.h1>

        <motion.p
          className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.3em] text-turbonite-base/70 uppercase font-mono text-center"
          variants={itemVariants}
        >
          University of Texas at Dallas
        </motion.p>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
