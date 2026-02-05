"use client";

import { useRef, useEffect, useState, useCallback } from "react";

export default function BackgroundCanvas() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastUpdate = useRef(0);
  const rafRef = useRef<number>(0);

  // Use requestAnimationFrame for smoother updates
  const updateScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
    setScrollProgress(progress);
  }, []);

  // Throttled scroll handler with RAF
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastUpdate.current < 50) return; // ~20fps throttle for background (sufficient)
      lastUpdate.current = now;
      
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateScroll]);

  // Calculate transforms based on scroll - reduced values for subtlety
  const blob1Y = scrollProgress * 30;
  const blob2Y = scrollProgress * -20;
  const blob3Y = scrollProgress * 35;

  // Section-based opacities
  const heroOpacity = scrollProgress < 0.15 ? 1 : scrollProgress < 0.25 ? 1 - (scrollProgress - 0.15) * 7 : 0.3;
  const aboutOpacity = scrollProgress > 0.1 && scrollProgress < 0.5 
    ? Math.min(1, (scrollProgress - 0.1) * 5) * (scrollProgress < 0.4 ? 1 : 1 - (scrollProgress - 0.4) * 5)
    : 0;
  const worksOpacity = scrollProgress > 0.35 && scrollProgress < 0.8
    ? Math.min(1, (scrollProgress - 0.35) * 4) * (scrollProgress < 0.7 ? 1 : 1 - (scrollProgress - 0.7) * 5)
    : 0;
  const contactOpacity = scrollProgress > 0.7 ? Math.min(1, (scrollProgress - 0.7) * 4) : 0;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base layer */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* HERO GRADIENTS - Reduced blur for performance */}
      <div
        className="absolute transform-gpu"
        style={{
          top: "-10%",
          left: "10%",
          width: "80vw",
          height: "50vh",
          background: "radial-gradient(ellipse at center, rgba(140, 130, 121, 0.2) 0%, transparent 55%)",
          filter: "blur(60px)",
          transform: `translate3d(0, ${blob1Y}%, 0)`,
          opacity: heroOpacity,
        }}
      />

      {/* ABOUT GRADIENTS */}
      {/* <div
        className="absolute transform-gpu"
        style={{
          top: "20%",
          left: "-10%",
          width: "50vw",
          height: "50vh",
          background: "radial-gradient(ellipse at center, rgba(184, 134, 11, 0.08) 0%, transparent 55%)",
          filter: "blur(60px)",
          transform: `translate3d(0, ${blob2Y}%, 0)`,
          opacity: aboutOpacity,
        }} */}
      {/* />
      <div
        className="absolute transform-gpu"
        style={{
          top: "30%",
          right: "-5%",
          width: "45vw",
          height: "45vh",
          background: "radial-gradient(ellipse at center, rgba(140, 130, 121, 0.15) 0%, transparent 30%)",
          filter: "blur(60px)",
          transform: `translate3d(0, ${blob3Y}%, 0)`,
          opacity: aboutOpacity,
        }}
      /> */}

      {/* WORKS GRADIENTS */}
      <div
      //   className="absolute transform-gpu"
      //   style={{
      //     top: "40%",
      //     left: "15%",
      //     width: "60vw",
      //     height: "50vh",
      //     background: "radial-gradient(ellipse at center, rgba(78, 79, 80, 0.30) 0%, transparent 90%)",
      //     filter: "blur(60px)",
      //     transform: `translate3d(0, ${blob1Y}%, 0)`,
      //     opacity: worksOpacity,
      //   }}
      // />
      // <div
      //   className="absolute transform-gpu"
      //   style={{
      //     top: "50%",
      //     right: "10%",
      //     width: "35vw",
      //     height: "40vh",
      //     background: "radial-gradient(ellipse at center, rgba(140, 130, 121, 0.18) 0%, transparent 55%)",
      //     filter: "blur(60px)",
      //     transform: `translate3d(0, ${blob2Y * 0.7}%, 0)`,
      //     opacity: worksOpacity,
      //   }}
      />

      {/* CONTACT GRADIENTS */}
      <div
        className="absolute transform-gpu"
        style={{
          bottom: "-10%",
          left: "0%",
          width: "100vw",
          height: "45vh",
          background: "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(140, 130, 121, 0.42) 0%, transparent 100%)",
          filter: "blur(60px)",
          opacity: contactOpacity,
        }}
      />

      {/* Horizon line - always visible */}
      <div
        className="absolute transform-gpu"
        style={{
          top: "50%",
          left: "-10%",
          width: "120vw",
          height: "15vh",
          background: "linear-gradient(180deg, transparent 0%, rgba(26, 28, 32, 0.18) 50%, transparent 100%)",
          filter: "blur(30px)",
          transform: `translate3d(0, ${blob3Y * 0.5}%, 0)`,
          opacity: 0.6,
        }}
      />
    </div>
  );
}
