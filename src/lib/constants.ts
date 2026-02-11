// ═══════════════════════════════════════════════════════════════════════════
// SHARED DESIGN SYSTEM CONSTANTS
// Single source of truth — imported by all components
// ═══════════════════════════════════════════════════════════════════════════

/** "Apple" ease curve — per .cursorrules Standard Ease: [0.16, 1, 0.3, 1] */
export const appleEase = [0.16, 1, 0.3, 1] as const;

/** Snappy but heavy spring — Porsche precision feel for magnetic interactions */
export const MAGNETIC_SPRING = { stiffness: 350, damping: 35 } as const;
