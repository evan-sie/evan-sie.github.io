"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import Lenis from "lenis";

const appleEase = [0.16, 1, 0.3, 1] as const;

// Snappy but heavy spring - Porsche precision
const magneticSpring = { stiffness: 350, damping: 35 };

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
  const itemRef = useRef<HTMLAnchorElement>(null);
  
  // Spring-based offset for magnetic tug effect
  const offsetX = useSpring(0, magneticSpring);
  const offsetY = useSpring(0, magneticSpring);
  const magneticScale = useSpring(1, magneticSpring);
  
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

  // Listen for magnetic events from LensCursor
  useEffect(() => {
    const element = itemRef.current;
    if (!element) return;
    
    const handleMagneticMove = (e: Event) => {
      const { deltaX, deltaY } = (e as CustomEvent).detail;
      offsetX.set(deltaX);
      offsetY.set(deltaY);
      magneticScale.set(1.15); // Slight scale up when magnetic
    };
    
    const handleMagneticLeave = () => {
      offsetX.set(0);
      offsetY.set(0);
      magneticScale.set(1);
    };
    
    element.addEventListener("magnetic-move", handleMagneticMove);
    element.addEventListener("magnetic-leave", handleMagneticLeave);
    
    return () => {
      element.removeEventListener("magnetic-move", handleMagneticMove);
      element.removeEventListener("magnetic-leave", handleMagneticLeave);
    };
  }, [offsetX, offsetY, magneticScale]);

  return (
    <div className="relative">
      <motion.a
        ref={itemRef}
        href={href}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-magnetic-target="true"
        className={`
          relative flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-xl cursor-pointer
          transition-colors duration-200
          ${isActive ? "text-engineering-white" : "text-turbonite-base hover:text-turbonite-highlight"}
        `}
        style={{
          x: offsetX,
          y: offsetY,
          scale: magneticScale,
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3, ease: appleEase }}
      >
        {icon}
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
            <div className="px-4 py-2 bg-deep-black/95 backdrop-blur-xl border border-white/10 rounded-lg whitespace-nowrap shadow-lg">
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
  const [isHovering, setIsHovering] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use ref for manual open state to avoid useEffect re-triggering
  const isManuallyOpenRef = useRef(false);
  const lastScrollY = useRef(0);
  
  // Dock is visually expanded if: manually opened, scroll-triggered, OR hovering (but NOT when modal is open)
  const shouldBeExpanded = !isModalOpen && (isExpanded || isHovering);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Watch for modal open state
  useEffect(() => {
    const checkModalState = () => {
      setIsModalOpen(document.body.hasAttribute("data-modal-open"));
    };
    
    // Check initially
    checkModalState();
    
    // Watch for changes using MutationObserver
    const observer = new MutationObserver(checkModalState);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-modal-open"],
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      const worksSection = document.getElementById("works");
      const contactSection = document.getElementById("contact");

      const scrollY = window.scrollY;
      const scrollThreshold = 80;
      const scrollingUp = scrollY < lastScrollY.current;
      lastScrollY.current = scrollY;

      // Expansion Logic
      if (isManuallyOpenRef.current) {
        // Only collapse when user SCROLLS UP to very top
        if (scrollY === 0 && scrollingUp) {
          isManuallyOpenRef.current = false;
          setIsExpanded(false);
        }
        // Otherwise stay expanded when manually opened
      } else {
        // Standard Auto Behavior - opens after 80px scroll
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
    // Don't call handleScroll() immediately - let the initial state be collapsed
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    isManuallyOpenRef.current = true;
      setIsExpanded(true);
  };

  // Dimensions based on state
  const collapsedSize = 24;
  const expandedWidth = isMobile ? 240 : 320;
  const expandedHeight = isMobile ? 62 : 72;

  return (
    <motion.div
      className="fixed bottom-6 sm:bottom-8 left-1/2 z-[60]"
      style={{ x: "-50%" }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: isModalOpen ? 0 : 1,
        pointerEvents: isModalOpen ? "none" : "auto",
      }}
      transition={{ delay: 1, duration: 0.6, ease: appleEase }}
    >
      {/* Single morphing container */}
      <motion.div
        className={`relative overflow-visible ${shouldBeExpanded ? "backdrop-blur-sm backdrop-saturate-[1.5]" : ""}`}
        data-magnetic-zone="true"
        animate={{
          width: shouldBeExpanded ? expandedWidth : collapsedSize,
          height: shouldBeExpanded ? expandedHeight : collapsedSize,
          borderRadius: shouldBeExpanded ? 40 : 9999,
        }}
        transition={{ duration: 0.3, ease: appleEase }}
        style={{
          backgroundColor: shouldBeExpanded ? "rgba(5, 5, 5, 0.15)" : "transparent", 
          border: shouldBeExpanded ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
          // boxShadow: `${SHADOW_INTENSITY} ${SHADOW_COLOR}`,
          cursor: shouldBeExpanded ? "default" : "pointer",
        }}
        onClick={!shouldBeExpanded ? handleDotClick : undefined}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Inner highlight - liquid glass effect - only when expanded */}
        {shouldBeExpanded && (
          <div 
            className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden"
            style={{ 
              background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 50%, transparent 90%, rgba(255,255,255,0.01) 100%)",
            }}
          />
        )}

        {/* Pulsating Dot - visible when collapsed */}
            <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ opacity: shouldBeExpanded ? 0 : 1 }}
          transition={{ duration: 0.2 }}
            >
          <div className="w-3 h-3 rounded-full bg-turbonite-highlight animate-pulse" />
      </motion.div>

        {/* Dock Items - visible when expanded */}
          <motion.nav
            className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: shouldBeExpanded ? 1 : 0 }}
          transition={{ duration: 0.2, delay: shouldBeExpanded ? 0.1 : 0 }}
          >
          <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2">
              <DockItem icon={<HomeIcon />} label="Home" href="#hero" isActive={activeSection === "hero"} />
            <div className="w-px h-5 sm:h-6 bg-white/10 mx-0.5 sm:mx-2" />
              <DockItem icon={<AboutIcon />} label="About" href="#about" isActive={activeSection === "about"} />
            <div className="w-px h-5 sm:h-6 bg-white/10 mx-0.5 sm:mx-2" />
              <DockItem icon={<WorksIcon />} label="Works" href="#works" isActive={activeSection === "works"} />
            <div className="w-px h-5 sm:h-6 bg-white/10 mx-0.5 sm:mx-2" />
              <DockItem icon={<ContactIcon />} label="Contact" href="#contact" isActive={activeSection === "contact"} />
            </div>
          </motion.nav>
      </motion.div>
    </motion.div>
  );
}
