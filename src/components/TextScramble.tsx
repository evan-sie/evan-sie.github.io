"use client";

import { useEffect, useState, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// MOTION DESIGN SYSTEM - Premium Text Scramble
// ═══════════════════════════════════════════════════════════════════════════

// Precision character set - engineering aesthetic
const CHARS = "—–_/\|·*EVANSIE+";

// Easing function: Cubic ease-out for natural deceleration
// Returns 0-1, starts fast, decelerates smoothly
const easeOutCubic = (t: number): number => 1 - 2.5*Math.pow(1 - t, 1);

// Easing function for velocity (derivative of ease-out)
// Higher at start, approaches 0 at end
const velocityCurve = (t: number): number => 2 * Math.pow(1 - t, 1);

interface CharState {
  char: string;
  weight: number;
  locked: boolean;
  isGlimpse: boolean; // Showing final char as a "tease"
}

interface TextScrambleProps {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
  onComplete?: () => void;
}

export default function TextScramble({
  text,
  delay = 0,
  duration = 1500,
  className = "",
  onComplete,
}: TextScrambleProps) {
  // Hydration-safe: start with actual text
  const [display, setDisplay] = useState<CharState[]>(() =>
    text.split("").map((c) => ({
      char: c,
      weight: 300,
      locked: true,
      isGlimpse: false,
    }))
  );
  const [opacity, setOpacity] = useState(1);
  const [hasMounted, setHasMounted] = useState(false);
  const frameRef = useRef<number>();
  const onCompleteRef = useRef(onComplete);

  onCompleteRef.current = onComplete;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const chars = text.split("");
    const totalChars = chars.length;
    const nonSpaceChars = chars.filter((c) => c !== " ").length;

    // Each character locks at a specific progress point (0-1)
    // Staggered left-to-right with ease-out distribution
    let charIndex = 0;
    const lockPoints = chars.map((c) => {
      if (c === " ") return 0; // Spaces always "locked"
      charIndex++;
      // Distribute lock points from 0.15 to 0.92 with ease-out
      const ratio = charIndex / nonSpaceChars;
      return 0.15 + easeOutCubic(ratio) * 0.77;
    });

    // Initialize scrambled state
    setDisplay(
      chars.map((c) => ({
        char: c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)],
        weight: 300 + Math.floor(Math.random() * 4) * 100,
        locked: c === " ",
        isGlimpse: false,
      }))
    );
    setOpacity(0.6);

    let startTime: number | null = null;
    let lastUpdateTime = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
        lastUpdateTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      // Dynamic update interval based on velocity curve
      // Fast at start (~30ms), slow at end (~150ms)
      const velocity = velocityCurve(progress);
      const updateInterval = 60 + (1 - velocity) * 140;

      if (currentTime - lastUpdateTime >= updateInterval) {
        lastUpdateTime = currentTime;

        // Smooth opacity with ease-out
        setOpacity(0.4 + easedProgress * 0.6);

        const newDisplay = chars.map((targetChar, i) => {
          if (targetChar === " ") {
            return { char: " ", weight: 400, locked: true, isGlimpse: false };
          }

          const lockPoint = lockPoints[i];
          const isLocked = progress >= lockPoint;

          if (isLocked) {
            return { char: targetChar, weight: 600, locked: true, isGlimpse: false };
          }

          // Calculate proximity to lock (0 = far, 1 = about to lock)
          const proximityToLock = Math.max(0, (progress - (lockPoint - 0.15)) / 0.15);

          // "Glimpse" probability increases as we approach lock
          // Creates anticipation - character briefly shows final letter
          const glimpseProbability = Math.pow(proximityToLock, 2) * 0.4;
          const isGlimpse = Math.random() < glimpseProbability;

          if (isGlimpse) {
            return { char: targetChar, weight: 600, locked: false, isGlimpse: true };
          }

          return {
            char: CHARS[Math.floor(Math.random() * CHARS.length)],
            weight: 300 + Math.floor(Math.random() * 3) * 100,
            locked: false,
            isGlimpse: false,
          };
        });

        setDisplay(newDisplay);
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        // The "Click" moment - synchronized final state
        setDisplay(
          chars.map((c) => ({
            char: c,
            weight: 600,
            locked: true,
            isGlimpse: false,
          }))
        );
        setOpacity(1);
        onCompleteRef.current?.();
      }
    };

    const timer = setTimeout(() => {
      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [hasMounted, text, delay, duration]);

  return (
    <span className={`inline-block font-porsche ${className}`} style={{ opacity }} aria-label={text}>
      {display.map((state, i) => (
        <span
          key={i}
          className="inline-block transition-[font-weight] duration-75"
          style={{
            fontWeight: state.weight,
            minWidth: state.char === " " ? "0.35em" : undefined,
            // Subtle brightness boost on glimpse for "recognition" moment
            filter: state.isGlimpse ? "brightness(1.1)" : undefined,
          }}
        >
          {state.char === " " ? "\u00A0" : state.char}
        </span>
      ))}
    </span>
  );
}
