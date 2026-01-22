"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring } from "framer-motion";

type CursorMode = "default" | "pointer" | "text" | "magnetic";

// Unified spring - snappy but heavy Porsche precision
const MAGNETIC_SPRING = { stiffness: 350, damping: 35 };

export default function LensCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [isHidden, setIsHidden] = useState(false);
  const currentMagneticTarget = useRef<HTMLElement | null>(null);
  const posRef = useRef({ x: 0, y: 0 });
  
  // Springs for smooth shape transitions
  const width = useSpring(16, { stiffness: 600, damping: 30 });
  const height = useSpring(16, { stiffness: 600, damping: 30 });
  const borderRadius = useSpring(8, { stiffness: 600, damping: 30 });
  const scale = useSpring(1, { stiffness: 800, damping: 35, mass: 0.2 });
  const cursorOpacity = useSpring(1, MAGNETIC_SPRING);

  // Reset cursor to default state
  const resetCursor = useCallback(() => {
    setMode("default");
    if (currentMagneticTarget.current) {
      currentMagneticTarget.current.dispatchEvent(new CustomEvent("magnetic-leave", { bubbles: false }));
      currentMagneticTarget.current = null;
    }
    cursorOpacity.set(1);
    width.set(20);
    height.set(20);
    borderRadius.set(10);
    scale.set(1);
  }, [cursorOpacity, width, height, borderRadius, scale]);

  // Zero-latency position update using RAF
  const updatePosition = useCallback(() => {
    if (cursorRef.current) {
      const s = scale.get();
      const w = width.get();
      const h = height.get();
      const br = borderRadius.get();
      const op = cursorOpacity.get();
      
      cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%)`;
      cursorRef.current.style.width = `${w * s}px`;
      cursorRef.current.style.height = `${h * s}px`;
      cursorRef.current.style.borderRadius = `${br}px`;
      cursorRef.current.style.opacity = `${op}`;
    }
    requestAnimationFrame(updatePosition);
  }, [scale, width, height, borderRadius, cursorOpacity]);

  useEffect(() => {
    const rafId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(rafId);
  }, [updatePosition]);

  // Listen for cursor reset events
  useEffect(() => {
    const handleCursorReset = () => resetCursor();
    window.addEventListener("cursor-reset", handleCursorReset);
    return () => window.removeEventListener("cursor-reset", handleCursorReset);
  }, [resetCursor]);

  // Reset cursor when modal closes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-modal-open") {
          if (!document.body.hasAttribute("data-modal-open") && mode === "magnetic") {
            resetCursor();
          }
        }
      });
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-modal-open"] });
    return () => observer.disconnect();
  }, [mode, resetCursor]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      
      // Check for magnetic zones first (highest priority)
      const magneticZone = target.closest("[data-magnetic-zone]") as HTMLElement | null;
      const magneticElement = target.closest("[data-magnetic-target]") as HTMLElement | null;
      
      // ZERO VISIBILITY POLICY: If inside ANY magnetic zone, cursor is hidden
      if (magneticZone || magneticElement) {
        setMode("magnetic");
        cursorOpacity.set(0); // Immediately hide cursor dot
        
        // Find the nearest magnetic target to apply tug effect
        let nearestTarget: HTMLElement | null = magneticElement;
        
        if (!nearestTarget && magneticZone) {
          const allTargets = magneticZone.querySelectorAll("[data-magnetic-target]");
          let nearestDist = Infinity;
          
          allTargets.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
            if (dist < nearestDist) {
              nearestDist = dist;
              nearestTarget = el as HTMLElement;
            }
          });
        }
        
        // If we have a target, apply magnetic tug
        if (nearestTarget) {
          const rect = nearestTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = (e.clientX - centerX) * 0.2; // 20% tug strength
          const deltaY = (e.clientY - centerY) * 0.2;
          
          // Only dispatch if target changed or position changed significantly
          if (currentMagneticTarget.current !== nearestTarget) {
            // Leave old target
            if (currentMagneticTarget.current) {
              currentMagneticTarget.current.dispatchEvent(new CustomEvent("magnetic-leave", { bubbles: false }));
            }
            currentMagneticTarget.current = nearestTarget;
          }
          
          nearestTarget.dispatchEvent(new CustomEvent("magnetic-move", {
            detail: { deltaX, deltaY },
            bubbles: false,
          }));
        }
        
        return;
      }
      
      // FULLY EXITED magnetic zone - restore cursor
      if (currentMagneticTarget.current) {
        currentMagneticTarget.current.dispatchEvent(new CustomEvent("magnetic-leave", { bubbles: false }));
        currentMagneticTarget.current = null;
      }
      cursorOpacity.set(1); // Show cursor dot
      
      // Standard cursor logic
      const closestCursorDefault = target.closest("[data-cursor-default]") as HTMLElement | null;
      const forceDefault = closestCursorDefault?.getAttribute("data-cursor-default") === "true";
      const forcePointer = target.getAttribute("data-cursor-default") === "false" || 
                          closestCursorDefault?.getAttribute("data-cursor-default") === "false";
      
      const isTextElement = !forcePointer && (
        tagName === "p" || tagName === "span" || tagName === "h1" || tagName === "h2" ||
        tagName === "h3" || tagName === "h4" || tagName === "h5" || tagName === "h6" ||
        tagName === "blockquote" || tagName === "cite" || tagName === "input" ||
        tagName === "textarea" || tagName === "label" || tagName === "li" ||
        target.classList.contains("prose") || !!target.closest(".prose")
      );
      
      const isInsideModal = !!target.closest(".fixed");
      
      const isClickable = !forceDefault && (
        forcePointer || tagName === "a" || tagName === "button" ||
        !!target.closest("a") || !!target.closest("button") || !!target.closest("[role='button']") ||
        target.classList.contains("cursor-pointer") ||
        (!isInsideModal && !!target.closest(".cursor-pointer")) ||
        (!isInsideModal && !!target.closest("article.cursor-pointer")) ||
        window.getComputedStyle(target).cursor === "pointer"
      );
      
      if (isClickable) {
        setMode("pointer");
      } else if (isTextElement) {
        setMode("text");
      } else {
        setMode("default");
      }
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
      if (currentMagneticTarget.current) {
        currentMagneticTarget.current.dispatchEvent(new CustomEvent("magnetic-leave", { bubbles: false }));
        currentMagneticTarget.current = null;
      }
    };
    
    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseDown = () => scale.set(0.85);
    const handleMouseUp = () => scale.set(1);

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) setIsHidden(true);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scale, cursorOpacity]);

  // Update springs based on mode
  useEffect(() => {
    if (mode === "magnetic") return;
    
    switch (mode) {
      case "pointer":
        width.set(50);
        height.set(50);
        borderRadius.set(15);
        scale.set(1);
        break;
      case "text":
        width.set(3);
        height.set(27);
        borderRadius.set(2);
        scale.set(1);
        break;
      default:
        width.set(20);
        height.set(20);
        borderRadius.set(10);
        scale.set(1);
    }
  }, [mode, width, height, borderRadius, scale]);

  if (isHidden) return null;

  return (
    <>
      {/* Main cursor dot - no overlays, just the dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          willChange: "transform, width, height, opacity",
          mixBlendMode: "difference",
        }}
      >
        <motion.div
          className="w-full h-full bg-engineering-white/90"
          style={{ borderRadius: "inherit" }}
          animate={{ opacity: mode === "pointer" ? 1 : 0.9 }}
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
