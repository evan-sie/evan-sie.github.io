"use client";

import { motion } from "framer-motion";

const appleEase = [0.16, 1, 0.3, 1] as const;

// Split quote into words for staggered animation
const QUOTE_TEXT = "You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.";
const QUOTE_WORDS = QUOTE_TEXT.split(" ");

export default function FlyingQuote() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: appleEase,
      },
    },
  };

  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 flex items-center justify-center overflow-hidden">
      {/* Ambient glow behind quote */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 2, ease: appleEase }}
      >
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(140, 130, 121, 0.06) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Quote container */}
      <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
        {/* Opening quotation mark */}
        <motion.span
          className="absolute -top-8 -left-2 md:-left-8 text-6xl md:text-8xl font-serif text-turbonite-base/10 select-none"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: appleEase }}
        >
          &ldquo;
        </motion.span>

        {/* Word-by-word animated quote */}
        <motion.blockquote
          className="text-xl md:text-2xl lg:text-3xl font-light text-engineering-white/70 italic tracking-wide leading-relaxed"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {QUOTE_WORDS.map((word, index) => (
            <motion.span
              key={index}
              className="inline-block mr-[0.3em]"
              variants={wordVariants}
            >
              {word}
            </motion.span>
          ))}
        </motion.blockquote>

        {/* Closing quotation mark */}
        <motion.span
          className="absolute -bottom-12 -right-2 md:-right-8 text-6xl md:text-8xl font-serif text-turbonite-base/10 select-none"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 1.2, duration: 0.8, ease: appleEase }}
        >
          &rdquo;
        </motion.span>

        {/* Author attribution with line */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 0.8, ease: appleEase }}
        >
          <div className="w-8 h-px bg-turbonite-highlight/30" />
          <cite className="text-xs font-mono tracking-[0.25em] text-turbonite-highlight/50 uppercase not-italic">
            Buckminster Fuller
          </cite>
          <div className="w-8 h-px bg-turbonite-highlight/30" />
        </motion.div>
      </div>
    </section>
  );
}
