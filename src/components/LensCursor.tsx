"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring } from "framer-motion";

type CursorMode = "default" | "pointer" | "text";

export default function LensCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [isHidden, setIsHidden] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  
  // Springs for smooth shape transitions - slightly larger default size (16px)
  const width = useSpring(16, { stiffness: 600, damping: 30 });
  const height = useSpring(16, { stiffness: 600, damping: 30 });
  const borderRadius = useSpring(8, { stiffness: 600, damping: 30 });
  const scale = useSpring(1, { stiffness: 800, damping: 35, mass: 0.2 });

  // Zero-latency position update using RAF
  const updatePosition = useCallback(() => {
    if (cursorRef.current) {
      const s = scale.get();
      const w = width.get();
      const h = height.get();
      const br = borderRadius.get();
      
      cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%)`;
      cursorRef.current.style.width = `${w * s}px`;
      cursorRef.current.style.height = `${h * s}px`;
      cursorRef.current.style.borderRadius = `${br}px`;
    }
    requestAnimationFrame(updatePosition);
  }, [scale, width, height, borderRadius]);

  useEffect(() => {
    const rafId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(rafId);
  }, [updatePosition]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Zero-latency position update
      posRef.current = { x: e.clientX, y: e.clientY };
      
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      
      // Check if cursor should stay default (e.g., inside expanded modals)
      const forceDefault = !!target.closest("[data-cursor-default]");
      
      // Check for text elements (I-beam mode)
      const isTextElement = 
        tagName === "p" ||
        tagName === "span" ||
        tagName === "h1" ||
        tagName === "h2" ||
        tagName === "h3" ||
        tagName === "h4" ||
        tagName === "h5" ||
        tagName === "h6" ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "label" ||
        tagName === "li";
      
      // Check for clickable elements (but not if inside a cursor-default zone)
      const isClickable = !forceDefault && (
        tagName === "a" ||
        tagName === "button" ||
        !!target.closest("a") ||
        !!target.closest("button") ||
        !!target.closest("[role='button']") ||
        target.classList.contains("cursor-pointer") ||
        !!target.closest(".cursor-pointer") ||
        !!target.closest("article:not([data-cursor-default])") ||
        window.getComputedStyle(target).cursor === "pointer"
      );
      
      // Determine mode priority: clickable > text > default
      if (forceDefault) {
        setMode("default");
      } else if (isClickable) {
        setMode("pointer");
      } else if (isTextElement && !isClickable) {
        setMode("text");
      } else {
        setMode("default");
      }
    };

    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) setIsHidden(true);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Update springs based on mode
  useEffect(() => {
    switch (mode) {
      case "pointer":
        // Expanded CIRCLE for clickable elements
        width.set(50);
        height.set(50);
        borderRadius.set(15);
        scale.set(1);
        break;
      case "text":
        // I-beam shape for text
        width.set(3);
        height.set(27);
        borderRadius.set(2);
        scale.set(1);
        break;
      default:
        // Default circle
        width.set(20);
        height.set(20);
        borderRadius.set(10);
        scale.set(1);
    }
  }, [mode, width, height, borderRadius, scale]);

  if (isHidden) return null;

  return (
    <>
      {/* Main cursor - mix-blend for true inversion effect */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          willChange: "transform, width, height",
          mixBlendMode: "difference",
        }}
      >
        <motion.div
          className="w-full h-full bg-engineering-white/90"
          style={{ 
            borderRadius: "inherit",
          }}
          animate={{ 
            opacity: mode === "pointer" ? 1 : 0.9,
          }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        @media (pointer: coarse) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
}
