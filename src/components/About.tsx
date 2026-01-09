"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const appleEase = [0.16, 1, 0.3, 1] as const;

// ═══════════════════════════════════════════════════════════════════════════
// COURSEWORK DATA
// ═══════════════════════════════════════════════════════════════════════════

interface Course {
  name: string;
  code: string;
  description: string;
}

const COURSEWORK: Course[] = [
  { name: "Kinematics & Dynamics", code: "MECH 3350", description: "Motion and interaction of machine elements and mechanisms. Kinematics, statics, and dynamics are applied for analysis and design of the parts of machines such as planar mechanisms, cams and gears." },
  { name: "Thermodynamics", code: "MECH 3310", description: "Properties of pure substances; First Law of Thermodynamics; Second Law of Thermodynamics; entropy; power and refrigeration cycles." },
  { name: "Fluid Mechanics", code: "MECH 3315", description: "In this course, we will study the physics governing the motion of fluids at an introductory level. We will familiarize ourselves with basic concepts in fluid mechanics, such as continuum, velocity field, and vorticity. We will apply the principle of mass conservation and Newton's law to describe the motion of fluids and solve basic engineering problems. After studying simple cases of fluid motion for in-viscid fluids, we will consider viscosity for internal flows (e.g. pipe flows), external flows (airfoils and bluff bodies), and flows with a free surface. Dimensional analysis will also be presented" },
  { name: "Computer Aided Design", code: "MECH 3305", description: "Course material includes an introduction to Computer-Aided Design (CAD) tools and their applications to the geometric design and analysis of mechanical components and assemblies. CAD software will be used to generate sketches, curves, surfaces, solids, assemblies, and engineering drawing suitable for different manufacturing processes. Innovative team-oriented projects are integrated into the course." },
  { name: "Design of Mech Systems", code: "MECH 3351", description: "Design and analysis tools for mechanical systems. Design criteria based on reliability and functionality are introduced. Basic principles of stress and deflection analysis, application to mechanical components and systems. Failure design theory based on static and dynamic loads, stochastic considerations, and design of mechanical components such as shafts, bearing and shaft-bearing systems, gear and gear systems and mechanical joints." },
  { name: "Probability Theory", code: "ENGR 3341", description: "Axioms of probability, conditional probability, Bayes theorem, random variables, probability density/mass function (pdf/pmf), cumulative distribution function, expected value, functions of random variables, joint, conditional and marginal pdfs/pmfs for multiple random variables, moments, central limit theorem, elementary statistics, empirical distribution correlation." },
  { name: "C Programming", code: "CS 1325", description: "Computer programming in a high-level, block structured language. Basic data types and variables, memory usage, control structures, functions/procedures and parameter passing, recursion, input/output. Programming assignments related to engineering applications, numerical methods." },
  { name: "Organic Chemistry", code: "CHEM 2323", description: "Organic chemistry: aliphatic and aromatic compounds; covalent inorganic and organometallic compounds; a survey of the organic functional groups and their typical reactions; stereochemistry. The first course in organic chemistry. Satisfies the basic organic chemistry lecture requirements for pre-health profession students." },
  { name: "Multivariable Calculus", code: "MATH 2419", description: "Improper integrals, sequences, infinite series, power series, parametric equations and polar coordinates, vectors, vector valued functions, functions of several variables, partial derivatives and applications, and multiple integration. Three lecture hours and two discussion hours a week;" }
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function TrafficLights() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
    </div>
  );
}

// Coursework Modal
interface CourseModalProps {
  course: Course;
  onClose: () => void;
}

function CourseModal({ course, onClose }: CourseModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 backdrop-blur-sm bg-deep-black/20 z-[70]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Modal - Centered, Glassmorphic */}
      <motion.div
        className="fixed inset-0 flex items-center bg-deep-black/20 backdrop-blur-sm justify-center z-[80] pointer-events-none p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-lg bg-deep-black/10 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden pointer-events-auto"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ duration: 0.5, ease: appleEase }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Traffic Light Header */}
          <div className="flex items-center justify-between bg-deep-black/50 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <TrafficLights />
            <span className="text-[10px] font-mono tracking-wider text-engineering-white/50 uppercase">
              {course.code}
            </span>
            <button
              onClick={onClose}
              className="w-[52px] flex justify-end items-center gap-2 text-turbonite-base hover:text-engineering-white transition-colors duration-150 cursor-pointer"
            >
              <span className="text-[9px] font-mono tracking-wider opacity-50">ESC</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="square" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Course Code Badge */}
            <div className="inline-block px-2 py-1 text-[10px] font-mono tracking-wider text-turbonite-highlight bg-white/5 rounded border border-white/10 uppercase mb-4">
              {course.code}
            </div>

            {/* Course Name */}
            <h3 className="text-xl font-porsche tracking-tight text-engineering-white uppercase mb-2">
              {course.name}
            </h3>

            {/* Divider */}
            <div className="w-16 h-px bg-gradient-to-r from-turbonite-highlight to-transparent mb-4" />

            {/* Description - Using thin font with higher opacity */}
            <p className="text-sm font-thin text-engineering-white leading-relaxed">
              {course.description}
            </p>

            {/* UTD Attribution */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <p className="text-[10px] font-mono tracking-wider text-turbonite-base uppercase">
                University of Texas at Dallas — Course Catalog
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

// Clickable Course Chip
interface CourseChipProps {
  course: Course;
  index: number;
  onClick: () => void;
}

function CourseChip({ course, index, onClick }: CourseChipProps) {
  return (
    <motion.button
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-mono tracking-wider text-engineering-white/20 bg-white/[0.05] border border-white/5 rounded hover:border-turbonite-highlight/30 hover:text-engineering-white hover:bg-white/[0.14] transition-all duration-900 cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.01, duration: 0, ease: appleEase }}
      whileHover={{ y: -2, transition: { duration: 0 } }}
      whileTap={{ scale: 0.95 }}
    >
      {course.name}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax for various elements
  const headerY = useTransform(scrollYProgress, [0, 0.4], [30, 0]);
  const photoY = useTransform(scrollYProgress, [0, 1], [40, -30]);
  const contentY = useTransform(scrollYProgress, [0, 1], [25, -15]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: appleEase },
    },
  };

  return (
    <>
      <section 
        ref={sectionRef}
        id="about" 
        className="relative min-h-screen py-20 sm:py-32 md:py-48"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
          {/* Asymmetrical Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
            
            {/* Left Column - Photo (max-w-[280px]) */}
            <motion.div 
              className="lg:col-span-5 relative flex justify-center lg:justify-start"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, ease: appleEase }}
              style={{ y: photoY }}
            >
              {/* Photo container - FORCED to 280px max width */}
              <div className="relative w-full max-w-[280px]">
                {/* Traffic Light Window Header */}
                <div className="flex items-center justify-between px-4 py-3 border border-white/10 border-b-0 rounded-t-lg bg-deep-black">
                  <TrafficLights />
                  <span className="text-[10px] font-mono tracking-wider text-engineering-white/50 uppercase">
                    pfp.jpg
                  </span>
                  <div className="w-[52px]" />
                </div>

                {/* Photo container */}
                <div className="relative aspect-[3/4] rounded-b-lg overflow-hidden bg-deep-black/20 backdrop-blur-sm border border-white/10 border-t-0 hover:border-turbonite-highlight/30 transition-all duration-200 cursor-pointer hover:scale-[1.02] opacity-100 hover:brightness-125">
                  {/* Photo */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-turbonite-base/30 to-deep-black"
                    style={{
                      backgroundImage: "url('/me.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  
                  {/* Glass overlay tint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-turbonite-base/30 to-transparent" />
                  
                  {/* Decorative frame corners */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-turbonite-highlight/40" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-turbonite-highlight/40" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-turbonite-highlight/40" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-turbonite-highlight/40" />

                  {/* Technical overlay text */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="font-mono text-[9px] tracking-[0.15em] text-turbonite-highlight/40 uppercase">
                      Frame: 001 // ISO 400
                    </p>
                  </div>
                </div>

                
              </div>
            </motion.div>

            {/* Right Column - Content */}
            <motion.div 
              className="lg:col-span-7"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              style={{ y: contentY }}
            >
              {/* Section label */}
              <motion.p 
                className="text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] text-turbonite-highlight uppercase mb-6 sm:mb-8 text-center lg:text-left"
                variants={itemVariants}
                style={{ y: headerY }}
              >
                01 — About
              </motion.p>

              {/* Name & Title */}
              <motion.div variants={itemVariants} className="text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-engineering-white mb-3">
                  Evan Sie
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-turbonite-base tracking-wide font-porsche">
                  Mechanical Engineering at University of Texas at Dallas
                </p>
                <p className="text-xs sm:text-sm font-mono text-turbonite-highlight/60 tracking-wider mt-2">
                  Class of 2027
                </p>
              </motion.div>

              {/* Divider */}
              <motion.div 
                className="w-24 h-px bg-gradient-to-r from-turbonite-highlight to-transparent my-8 sm:my-10 mx-auto lg:mx-0"
                variants={itemVariants}
              />

              {/* Narrative - Using thin font with higher opacity */}
              <motion.div variants={itemVariants} className="text-center lg:text-left">
                <p className="text-sm sm:text-base font-thin text-engineering-white/80 leading-relaxed mb-4">
                  Hi! I&apos;m Evan, I&apos;m a Mechanical Engineering student at University of Texas at Dallas. I started my journey in Indonesia where I moved
                  to the US at the age of 7. Here I learned to speak English and gained a passion for aviation and engineering. Both of my parents were engineers so I was always grounded in the field.
                  This culminated in a long time hobby of building RC aircraft and drones, the first of which I built when I was 10. Ever since then I have been doing personal projects that involve engineering and technical skills over the years.
                </p>
              </motion.div>

              {/* Coursework - Clickable Chips */}
              <motion.div 
                className="mt-10 sm:mt-14"
                variants={itemVariants}
              >
                <p className="font-mono text-[15px] tracking-[0.2em] text-turbonite-highlight uppercase mb-4 sm:mb-6 text-center lg:text-left">
                  Relevant Coursework
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {COURSEWORK.map((course, index) => (
                    <CourseChip
                      key={course.code}
                      course={course}
                      index={index}
                      onClick={() => setSelectedCourse(course)}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <CourseModal 
            course={selectedCourse} 
            onClose={() => setSelectedCourse(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
