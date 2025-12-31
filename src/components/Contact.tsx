"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ResumeModal from "./ResumeModal";

const appleEase = [0.16, 1, 0.3, 1] as const;

// ═══════════════════════════════════════════════════════════════════════════
// POSITION CONFIGURATION - Adjust these to reposition the Contact section
// ═══════════════════════════════════════════════════════════════════════════
const POSITION_CONFIG = {
  x: 0,    // Horizontal offset (positive = right, negative = left)
  y: 0,    // Vertical offset (positive = down, negative = up)
};

export default function Contact() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Deep parallax for header
  const headerY = useTransform(scrollYProgress, [0, 1], [120, -60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [40, -20]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  // Fly-in animation
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: appleEase,
      },
    },
  };

  return (
    <>
      <section 
        ref={sectionRef}
        id="contact" 
        className="relative min-h-screen flex items-center py-20 px-4 sm:px-8 md:px-20 sm:py-32"
      >
        {/* Subtle border accent - moved to left */}
        <div className="absolute top-0 left-8 md:left-12 lg:left-16 w-px h-32 bg-gradient-to-b from-transparent via-turbonite-base/20 to-transparent hidden sm:block" />

        <motion.div
          className="relative w-full max-w-4xl text-center sm:text-left mx-auto sm:mx-0 sm:ml-8 md:ml-16 lg:ml-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          style={{
            x: POSITION_CONFIG.x,
            y: POSITION_CONFIG.y,
          }}
        >
        {/* Section label with parallax */}
        <motion.p
          className="text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] text-turbonite-highlight uppercase mb-6 sm:mb-8"
          variants={itemVariants}
          style={{ y: headerY }}
        >
          04 — Contact
        </motion.p>

        {/* Heading */}
        <motion.h2
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-engineering-white mb-6 sm:mb-8"
          variants={itemVariants}
          style={{ y: contentY }}
        >
            Thanks for stopping by!
          </motion.h2>

          {/* Divider */}
          <motion.div
            className="w-20 sm:w-24 h-px bg-gradient-to-r from-transparent via-turbonite-highlight to-transparent mb-6 sm:mb-8 mx-auto sm:mx-0"
            variants={itemVariants}
          />

          {/* Description */}
          <motion.p 
            className="font-porsche text-turbonite-highlight text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mb-8 sm:mb-12"
            variants={itemVariants}
          >
            I am currently seeking internship opportunities in automotive, electromechanical, and aerospace fields. Let&apos;s connect!
          </motion.p>

          {/* Email CTA */}
          <motion.div
            className="mb-12 sm:mb-16"
            variants={itemVariants}
          >
            <motion.a
              href="mailto:evansie485@gmail.com"
              className="font-porsche inline-block text-lg sm:text-2xl md:text-3xl text-engineering-white/80 hover:text-turbonite-highlight transition-colors duration-300 tracking-wide cursor-pointer break-all sm:break-normal"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              evansie485@gmail.com
            </motion.a>
          </motion.div>

          {/* Action links - LinkedIn & Resume */}
          <motion.div
            className="flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8 md:gap-12 justify-center sm:justify-start"
            variants={itemVariants}
          >
            <motion.a
              href="https://linkedin.com/in/evan-sie"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm font-mono tracking-wider text-turbonite-base hover:text-engineering-white transition-colors duration-200 uppercase cursor-pointer"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <svg 
                className="w-4 h-4" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </motion.a>

            <motion.button
              onClick={() => setIsResumeOpen(true)}
              className="group flex items-center gap-2 text-sm font-mono tracking-wider text-turbonite-base hover:text-engineering-white transition-colors duration-200 uppercase cursor-pointer"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <svg 
                className="w-0 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume
            </motion.button>
          </motion.div>

          
          <motion.div 
            className="mt-20 sm:mt-32 pt-8 sm:pt-12 border-t border-white/5"
            variants={itemVariants}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <p className="text-[9px] sm:text-[10px] font-mono tracking-[0.15em] sm:tracking-[0.2em] text-turbonite-base/40 uppercase">
                
              </p>
              <p className="text-[9px] sm:text-[10px] font-mono tracking-[0.15em] sm:tracking-[0.2em] text-turbonite-base/40 uppercase">
                
              </p>
              <p className="text-[9px] sm:text-[10px] font-mono tracking-[0.15em] sm:tracking-[0.2em] text-turbonite-base/40 uppercase">
                
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Resume Modal */}
      <ResumeModal 
        isOpen={isResumeOpen} 
        onClose={() => setIsResumeOpen(false)} 
      />
    </>
  );
}
