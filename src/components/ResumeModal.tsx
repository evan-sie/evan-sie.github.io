"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";

interface TrafficLightsProps {
  onClick?: () => void;
}

function TrafficLights({ onClick }: TrafficLightsProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.button
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-1.5 px-2 py-1.5 -mx-2 -my-1.5 rounded transition-colors duration-150 cursor-pointer"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div 
        className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] relative"
        animate={{ scale: isHovered ? 1.9 : 1 }}
        transition={{ duration: 0.15 }}
      >
        {isHovered && (
          <svg 
            className="absolute inset-0 w-full h-full p-0.5" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#4a0000" 
            strokeWidth="3"
          >
            <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
          </svg>
        )}
      </motion.div>
      <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
    </motion.button>
  );
}

const appleEase = [0.16, 1, 0.3, 1] as const;

const resumeData = {
  name: "Evan Sie",
  title: "Bachelor of Science in Mechanical Engineering",
  email: "evansie485@gmail.com",
  location: "Dallas, TX",
  education: {
    school: "University of Texas at Dallas",
    degree: "B.S. Mechanical Engineering",
    expected: "May 2027",
    focus: "Kinematics & Dynamics, Thermodynamics, Fluid Mechanics, CAD, Design of Mechanical Systems, Probability Theory, C Programming, Organic Chemistry, Multivariable Calculus",
    minor: "Nanoscience, Reliability & Design Automation",
    GPA: "3.75/4.0",
    honors: "Dean's List",
    awards: [
      "NASA Collaboration Award",
      "UTD AIAA Award",
      "UTD Mechanical Engineering Award",
    ],
  },
  experience: [
    {
      title: "High Altitude Balloon Project Lead",
      org: "NASA Collaboration / UTD AIAA",
      period: "2025 - Present",
      points: [
        "Manage a team of 5 mechanical/electrical engineers to conduct research using a high altitude weather balloon to measure cosmic ray and ozone concentrations in the atmosphere",
        "Directed the integration of atmospheric sensors, active heating systems, and live video telemetry using an Arduino Nano. Mentored team members on electronics fabrication, including soldering and circuit assembly.",
        "Present technical research paper regarding data obtained during the flight at Rice University",
        "Collaborate with NASA by participating on the High Altitude Balloon Student Platform",
      ],
    },
    {
      title: "High Altitude Balloon Project Member",
      org: "UTD AIAA",
      period: "2025",
      points: [
        "Built & launched UTDs first high altitude weather balloon reaching 92,404ft (28,164m) in altitude",
        "Spearheaded the primary design proposals, creating the final payload architecture selected for the flight",
        "Study the effects of heat transfer on the electronics & use ANSYS simulations to validate hypotheses",
        "Performed research on thermal insulation strategies for high-altitude balloon payloads, resulting in a publication, “Thermal Performance Evaluation of Insulation Materials for High-Altitude Balloon Payloads,” and an oral presentation at the AIAA Regional Student Conference.",

      ],
    },
    {
      title: "Reliability and Design Automation Research",
      org: "UTD Research Lab",
      period: "2025",
      points: [
        "Implementing Bayesian learning methods for reliability prediction",
        "Developing automated data analysis pipelines",
        "Presenting research on predictive additive manufacturing",
      ],
    },
    {
      title: "Undergraduate Research Assistant",
      org: "UTD Research Lab",
      period: "2025",
      points: [
        "Helped develop a Mixed Reality environment for testing Connected/Autonomous Vehicles",
        "Created a digital twin of the real world into traffic software",
      ],
    },
    {
      title: "Comet Rocketry Team Member",
      org: "AIAA Rocketry Association",
      period: "2024",
      points: [
        "Achieved L1 high-power rocketry certification",
        "Designed and fabricated composite airframes",
        "Performed flight simulations using OpenRocket",
      ],
    },
    {
      title: "Hydroponics Research",
      org: "SWG",
      period: "2024",
      points: [
        "Designed and built a hydroponics setup for a former professor",
        "Completed 2 working setups under the 1000$ budget",
      ],
    },
  ],
  skills: {
    cad: ["SolidWorks", "Creo", "Fusion 360", "GD&T"],
    analysis: ["ANSYS", "MATLAB", "CFD", "NASTRAN"],
    programming: ["Python", "C++", "Arduino", "MATLAB"],
    manufacturing: ["3D Printing", "Soldering", "Drone/ RC Aircraft Assembly", "Multimeters"],
  },
};

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Stop Lenis smooth scroll when modal is open
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (lenis) {
      lenis.stop();
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      // Resume Lenis
      if (lenis) {
        lenis.start();
      }
    };
  }, [isOpen, onClose]);

  // Prevent wheel events from propagating to background
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  const handleDownload = () => 
    {
    window.open("/Evan_Sie_Resume.pdf", "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-deep-black/90 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: appleEase }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex flex-col bg-deep-black border border-white/10 rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: appleEase }}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-4">
                <TrafficLights onClick={onClose} />
                <span className="text-xs font-mono tracking-wider text-turbonite-base/70 uppercase">
                  Resume.pdf
                </span>
              </div>

              <motion.button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider text-engineering-white bg-turbonite-highlight/20 border border-turbonite-highlight/40 rounded hover:bg-turbonite-highlight/30 transition-colors duration-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download PDF
              </motion.button>
            </div>

            {/* Content - Scrollable with native scroll */}
            <div 
              ref={contentRef}
              className="flex-1 overflow-y-auto overscroll-contain p-6 md:p-10 lg:p-12"
              style={{ 
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(78, 79, 80, 0.5) transparent"
              }}
            >
              <div className="max-w-3xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10 pb-8 border-b border-white/5">
                  <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-engineering-white mb-2">
                    {resumeData.name}
                  </h1>
                  <p className="text-turbonite-highlight text-lg tracking-wide mb-4">
                    {resumeData.title}
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs font-mono text-turbonite-base/60">
                    <span>{resumeData.email}</span>
                    <span className="w-1 h-1 rounded-full bg-turbonite-base/40" />
                    <span>{resumeData.location}</span>
                  </div>
                </div>

                {/* Education */}
                <div className="mb-10">
                  <h2 className="text-xs font-mono tracking-[0.2em] text-turbonite-highlight uppercase mb-4">
                    Education
                  </h2>
                  <div className="p-4 border border-white/5 rounded-lg bg-white/[0.01]">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-engineering-white font-semibold">
                          {resumeData.education.school}
                        </h3>
                        <p className="text-turbonite-base text-sm">{resumeData.education.degree}</p>
                      </div>
                      <span className="text-xs font-mono text-turbonite-base/60">
                        Expected {resumeData.education.expected}
                      </span>
                    </div>
                    <p className="text-xs text-turbonite-highlight/60 mt-2">
                      Relevant Coursework: {resumeData.education.focus}
                    </p>
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-10">
                  <h2 className="text-xs font-mono tracking-[0.2em] text-turbonite-highlight uppercase mb-4">
                    Experience
                  </h2>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp, index) => (
                      <motion.div
                        key={exp.title}
                        className="p-4 border border-white/5 rounded-lg bg-white/[0.01]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4, ease: appleEase }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-engineering-white font-semibold">{exp.title}</h3>
                            <p className="text-turbonite-base text-sm">{exp.org}</p>
                          </div>
                          <span className="text-xs font-mono text-turbonite-base/60 shrink-0 ml-4">
                            {exp.period}
                          </span>
                        </div>
                        <ul className="mt-3 space-y-1.5">
                          {exp.points.map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-turbonite-base/80">
                              <span className="w-1 h-1 rounded-full bg-turbonite-highlight mt-2 shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h2 className="text-xs font-mono tracking-[0.2em] text-turbonite-highlight uppercase mb-4">
                    Technical Skills
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(resumeData.skills).map(([category, items]) => (
                      <div key={category} className="p-3 border border-white/5 rounded-lg bg-white/[0.01]">
                        <h4 className="text-[10px] font-mono tracking-wider text-turbonite-highlight/60 uppercase mb-2">
                          {category}
                        </h4>
                        <div className="space-y-1">
                          {items.map((skill) => (
                            <p key={skill} className="text-xs text-turbonite-base/70">
                              {skill}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-white/5 text-center">
                  <p className="text-[10px] font-mono tracking-[0.2em] text-turbonite-base/40 uppercase">
                    References available upon request
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
