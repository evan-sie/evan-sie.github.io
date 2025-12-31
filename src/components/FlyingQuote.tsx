"use client";

import { motion } from "framer-motion";

const appleEase = [0.16, 1, 0.3, 1] as const;

export default function FlyingQuote() {
  return (
    <section className="relative py-32 md:py-48 flex items-center justify-center overflow-hidden">
      {/* Subtle horizontal line accent */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-turbonite-base/10 to-transparent" />

      {/* Quote - subtle center reveal */}
      <motion.div
        className="max-w-4xl mx-auto px-6 md:px-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: appleEase }}
      >
        <blockquote className="text-xl md:text-2xl lg:text-3xl font-light text-engineering-white/70 italic tracking-wide leading-relaxed">
          &ldquo;You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.&rdquo;
        </blockquote>
        <motion.cite 
          className="block mt-6 text-xs font-mono tracking-[0.2em] text-turbonite-highlight/50 uppercase not-italic"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8, ease: appleEase }}
        >
          — Buckminster Fuller
        </motion.cite>
      </motion.div>
    </section>
  );
}
