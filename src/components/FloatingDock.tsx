"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";

const appleEase = [0.16, 1, 0.3, 1] as const;

// --- CONFIGURATION ---
const SHADOW_COLOR = "rgba(255, 255, 255, 0.06)"; 
const SHADOW_INTENSITY = "0px 0px 20px 0px"; 

interface DockItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

function DockItem({ icon, label, href, isActive }: DockItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector(href) as HTMLElement | null;
    if (target) {
      const lenis = (window as unknown as { lenis?: Lenis }).lenis;
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1,
          easing: (t: number) => {
            return t < 0.5
              ? 4 * t * t * t
              : 1 - Math.pow(-2 * t + 2, 3) / 2;
          },
        });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [href]);

  return (
    <div className="relative">
      <motion.a
        href={href}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl cursor-pointer
          transition-colors duration-200
          ${isActive ? "text-engineering-white" : "text-turbonite-base hover:text-engineering-white"}
        `}
        whileHover={{ scale: 1.2, y: -2 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3, ease: appleEase }}
      >
        {icon}
        
        {isActive && (
          <motion.div
            className="absolute -bottom-1.5 sm:-bottom-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-turbonite-highlight"
            layoutId="activeIndicator"
            transition={{ duration: 0.3, ease: appleEase }}
          />
        )}
      </motion.a>

      {/* Tooltip - Rendered OUTSIDE the button, above the dock */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -top-14 left-1/2 z-[100] pointer-events-none"
            style={{ x: "-50%" }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: appleEase }}
          >
            <div className="px-4 py-2 bg-deep-black/95 backdrop-blur-sm border border-white/10 rounded-lg whitespace-nowrap shadow-lg">
              <span className="text-[10px] tracking-wider uppercase font-mono text-engineering-white">
                {label}
              </span>
            </div>
            {/* Arrow pointing down */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-deep-black/95 border-r border-b border-white/10 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Icons
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1V9.5z" strokeLinecap="square" />
  </svg>
);
const AboutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="square" />
  </svg>
);
const WorksIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="7" strokeLinecap="square" />
    <rect x="14" y="3" width="7" height="7" strokeLinecap="square" />
    <rect x="3" y="14" width="7" height="7" strokeLinecap="square" />
    <rect x="14" y="14" width="7" height="7" strokeLinecap="square" />
  </svg>
);
const ContactIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 4h16v14H5.5L4 20V4z" strokeLinecap="square" />
    <path d="M8 9h8M8 13h5" strokeLinecap="square" />
  </svg>
);

export default function FloatingDock() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isManuallyOpen, setIsManuallyOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      const aboutSection = document.getElementById("about");
      const worksSection = document.getElementById("works");
      const contactSection = document.getElementById("contact");
      
      if (!heroSection) return;

      const scrollY = window.scrollY;
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const scrollThreshold = heroBottom * 0.3;

      // Expansion Logic
      if (isManuallyOpen) {
        // Only collapse when user scrolls to VERY TOP (Y=0)
        if (scrollY === 0) {
          setIsManuallyOpen(false);
          setIsExpanded(false);
        } else {
          setIsExpanded(true);
        }
      } else {
        // Standard Auto Behavior
        setIsExpanded(scrollY > scrollThreshold);
      }

      // Active Section Tracking
      const viewportMiddle = scrollY + window.innerHeight / 2;
      if (contactSection && viewportMiddle >= contactSection.offsetTop) {
        setActiveSection("contact");
      } else if (worksSection && viewportMiddle >= worksSection.offsetTop) {
        setActiveSection("works");
      } else if (aboutSection && viewportMiddle >= aboutSection.offsetTop) {
        setActiveSection("about");
      } else {
        setActiveSection("hero");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isManuallyOpen]);

  const handleDotClick = () => {
    if (!isExpanded) {
      setIsManuallyOpen(true);
      setIsExpanded(true);
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 sm:bottom-8 left-1/2 z-[60]"
      style={{ x: "-50%" }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.6, ease: appleEase }}
    >
      {/* Background container - handles glass effect and rounding */}
      <motion.div
        className="relative backdrop-blur-md backdrop-saturate-[1.5]"
        animate={{
          width: isExpanded ? (isMobile ? 220 : 320) : 20,
          height: isExpanded ? (isMobile ? 56 : 72) : 20,
          borderRadius: isExpanded ? 40 : 9999,
        }}
        transition={{ duration: 0.4, ease: appleEase }}
        style={{
          backgroundColor: "rgba(5, 5, 5, 0.2)", 
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: `${SHADOW_INTENSITY} ${SHADOW_COLOR}`,
          cursor: isExpanded ? "default" : "pointer",
        }}
        onClick={handleDotClick}
      >
        {/* Inner highlight */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ 
            background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%, transparent 70%, rgba(255,255,255,0.02) 100%)",
          }}
        />

        {/* Collapsed Dot */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-4 h-4 rounded-full bg-turbonite-highlight animate-pulse shadow-[0_0_15px_rgba(140,130,121,0.6)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dock Items - Rendered OUTSIDE the overflow container */}
      <AnimatePresence>
        {isExpanded && (
          <motion.nav
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <div className="flex items-center gap-1 sm:gap-1 px-2">
              <DockItem icon={<HomeIcon />} label="Home" href="#hero" isActive={activeSection === "hero"} />
              <div className="w-px h-5 sm:h-6 bg-white/10 mx-1 sm:mx-2" />
              <DockItem icon={<AboutIcon />} label="About" href="#about" isActive={activeSection === "about"} />
              <div className="w-px h-5 sm:h-6 bg-white/10 mx-1 sm:mx-2" />
              <DockItem icon={<WorksIcon />} label="Works" href="#works" isActive={activeSection === "works"} />
              <div className="w-px h-5 sm:h-6 bg-white/10 mx-1 sm:mx-2" />
              <DockItem icon={<ContactIcon />} label="Contact" href="#contact" isActive={activeSection === "contact"} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
