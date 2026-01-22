"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

interface Project {
  id: string;
  title: string;
  date: string;
  span: "default" | "wide" | "tall";
  description: string;
  tags: string[];
  content: string;
  image: string;           // Main image (for modal)
  gifUrl?: string;         // Optional GIF for grid preview
  galleryImages?: string[]; // Optional gallery images for modal
}

const appleEase = [0.16, 1, 0.3, 1] as const;

// Smooth easing for layout animations
const layoutTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1] as const,
};

const projects: Project[] = [
  {
    id: "HAB.html",
    title: "High Altitude Balloon",
    date: "2025.07",
    span: "default",
    description: "A high altitude weather balloon payload to measure temperature, pressure, and humidity",
    tags: ["Arduino", "CAD", "3D Printing"],
    image: "/projects/horizon.jpg",
    gifUrl: undefined,
    galleryImages: ["/projects/launch.mp4", "/projects/burst.mp4"],
    content: `This project was part of my involvment in AIAA's research division where 5 of us built and launched UTD's first high altitude weather balloon reaching 92,404ft (28,164m) in altitude.
    Watch the full flight here: 

    https://youtu.be/2wPQeWOTOIY?si=9Q7SsurK7C8yXTe6

**Key Achievements:**
- Tested electronic components to -65C
- Designed custom mounting brackets for top, horizontal, and bottom facing cameras
- Calculated requireed helium needed for the balloon to reach desired altitude
- Sourced components and sensors for the payload
- Published a technical research paper
`
  },
  // {
  //   id: "calculator",
  //   title: "Calculator LiPo Battery Mod",
  //   date: "2025.12",
  //   span: "wide",
  //   description: "Converting my old Casio calculator to take LiPo batteries instead of AAA",
  //   tags: ["Soldering", "LiPo", "Modification"],
  //   image: "/projects/calculator-mod.jpg",
  //   gifUrl: undefined,
  //   galleryImages: undefined,
  //   content: `I had an old Casio FX CG50 calculator that takes AAA batteries. I found that this was quite wasteful 
  //   and got expensive over the 5 years I had it. I bought a 1500mAh LiPo battery and found a charge controller (Adafruit Powerboost 500) that would ensure the LiPo stayed within 3.2V to 4.2V.
  //   This was great because the charge controller also outputs 5V, which the calculator requires since it was designed to take AAA batteries.
  //   I had to make room for the LiPo battery by removing the AAA battery compartment and the AAA battery holder. This required careful dremel work and measurements to make sure all the components fit.
  //   There were no wiring diagrams of this calculator anywhere online, so I had to reverse engineer the PCBs by using a multimeter to measure voltages at different traces.
  //   I eventually found a spot where I could solder the inputs of the powerboost to the inputs of the calculator which means I could use the calculator's built in mini-USB port to charge.
  //   Finally I soldered the 5V output to the + and - terminals of the calculator where the AAA batteries used to be.`,
  // },
//   {
//     id: "Mirror",
//     title: "Smart Mirror",
//     date: "2025.01",
//     span: "tall",
//     description: "Modyfying a fitness mirror to display time, weather, and ETA to UTD",
//     tags: ["Raspberry Pi", "Python", "Zsh/Bash"],
//     image: "/projects/mirror.JPG",
//     gifUrl: undefined,
//     galleryImages: undefined,
//     content: `I had large fitness mirror which sat unsused in my room because the software it ran on was discontinued years ago.
//    Since the mirror already
//     had a giant TV screen inside it, I had an idea to reporgram it to display time, weather, ETA to UTD and other useful information. After some research I discovered the company that made the mirror (formally called Mirror) was aquired by Lululemon but has since been discontinued. I also found through a Github repository
//      that others had attempted to reverse engineer the mirror's screen. Unfortunatly, I happened to have the version 1 of the screen which was not able to be reverse engineered due to the proprietary connector. This was a let down and put the project on hold for a while. One day I was thinking about it again and realized that I didnt need to use the proprietary screen and I could just retrofit an old 1080p monitor I also had laying around.
//     I took apart the old monitor so that it was just the bare screen and retrofitted it to where the original screen was. 
//     I found an open source project called 'Magic Mirror' which ran on electron on a Raspberry Pi. After putting everything together,
//     I was left with a sleek, minimalistic UX interface that elevated the aesthetic of the mirror and made it much more useful.

 

// **Technical Details:**
// - Python script with Zsh/Bash to update the information every minute
// - Raspberry Pi 3A+
// - 1080p monitor



// Though it was a shame I could not save the original TV screen and the rest of the mirror components to turning into e-waste, I was at least able to salvage
// the webcam hardware and the lens to repurpose for a new project, and maybe one day the TV screen's connector would get reverse engineered so that I could turn it into another functoinal display in a future project. .`,
//   },

  
//   {
//     id: "fpv",
//     title: "Freestyle FPV Drone",
//     date: "2021.07",
//     span: "default",
//     description: "A 3 inch freestyle FPV drone ",
//     tags: ["Betaflight", "Soldering", "UAV Piloting"],
//     image: "/projects/drone.jpg",
//     gifUrl: undefined,
//     galleryImages: undefined,
//     content: `This was less of a technical achievement and more of a personal hobby where (through typical enginering fashion of trial and error) I learned most of the practical, hands-on engineering skills I use in most of my other projects.


// **Skills Learned:**
// - Soldering. Before starting this hobby I had never soldered before and always asked my Dad (who's an electrical engineer) for help in soldering anything I needed.
// But after watching him do it for years, and this being the first "project" I funded entirely on my own, I decided to give it shot, soldering + and - terminals to an FPV AIO camera.
// I did not even have a proper table, nor helping hands (the plier like things that hold the things you solder) but I did it anyway. A major learning curve I overcame was when I had to solder a new micro SD card slot to my FPV camera's PCB. This was no easy task as the solder pins were a mere milimeter in length with a distance between them of less than that. This was where I really got to put in
// my practice, and helped me understand electrical engineering in a way I've never done before.Since then I was able to accelerate my engineering projects to a new level with this newfound skill.
// - Electrial Engineering. I had a very basic understanding of circuits in the past as it was not a primary interest of mine. I just knew that a closed loop with a light bulb & power source would light up, and shorting batteries by bridging + and - was bad.
// However this hobby was primarily electronics and circuits based, which forced me to learn about capacitors, ICs, resistors, heat management and electromagnetism (radio). A huge learning expereince was when I had to put a GPS module on the drone, but it was failing to detect any satelites. After some reasearch I learned that a reason it failed was due to 
// electromagnetic intereference from the dron'es ESC's and capactiors. Which forced me to learn about ground planes, and how to orient and wire it in a way that would minimize interference. Radio was of a particular interest of me because the very notion of transmitting/recieving data and video over the air seemed like magic.
// I learned all about antenna theory, RF design, and how to build a radio system that would maximize range and minimize interference, something that I would be able to integrate into my current high altitude weather balloon project.
// - 3D printing. 3D printing was always something that seemed like science fiction. The very notion that I could design something on a computer and be able to hold that part in my hands felt too good not to try out.
// - UAV Piloting. This was the fun part of the hobby, where all of your hard work relies on your ability to pilot a drone. This is not a typical 
// piloting experience however, using VR like goggles I would be able to see the drone's live feed in real time. Futhermore, the drone's flight controller(and thus its flight dynamics) is very "manual" (unlike a typical drone found in a toy section of a Walmart), it is akin to driving a manual transmission car. It takes lots of practice and coordination not to stall the engine, which in this case is not to destroy hundreds of dollars and countless hours of work. I find this to be a useful skill
// due to the rapid advancements of UAVs in the defense and civilian industry, which requires skilled pilots to operate successfully.`,
//   },
];


interface TrafficLightsProps {
  onClick?: () => void;
  interactive?: boolean;
}

function TrafficLights({ onClick, interactive = false }: TrafficLightsProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a778414a-2499-4b15-8f5b-a13326ec8d0e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'EngineeringHub.tsx:TrafficLights',message:'TrafficLights render',data:{interactive,hasOnClick:!!onClick},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  if (!interactive) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1.5 -mx-2 -my-1.5 rounded bg-[#1a1a1a]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
      </div>
    );
  }
  
  return (
    <motion.button
      onClick={(e) => { 
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a778414a-2499-4b15-8f5b-a13326ec8d0e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'EngineeringHub.tsx:TrafficLights:onClick',message:'TrafficLights clicked',data:{hasOnClick:!!onClick},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,D'})}).catch(()=>{});
        // #endregion
        e.stopPropagation(); 
        onClick?.(); 
      }}
      onMouseEnter={() => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a778414a-2499-4b15-8f5b-a13326ec8d0e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'EngineeringHub.tsx:TrafficLights:onMouseEnter',message:'TrafficLights hover enter',data:{prevHovered:isHovered},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a778414a-2499-4b15-8f5b-a13326ec8d0e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'EngineeringHub.tsx:TrafficLights:onMouseLeave',message:'TrafficLights hover leave',data:{prevHovered:isHovered},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        setIsHovered(false);
      }}
      className="flex items-center gap-1.5 px-2 py-1.5 -mx-2 -my-1.5 rounded transition-colors duration-150 cursor-pointer "
      whileTap={{ scale: 0.95 }}
      data-cursor-default="false"
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

function CourseChip({ tag, index }: { tag: string; index: number }) {
  return (
    <motion.span 
      className="px-2 py-1 text-[10px] font-mono tracking-wider text-turbonite-highlight bg-white/5 rounded border border-white/10 uppercase cursor-pointer"
      data-cursor-default="false"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: appleEase }}
      whileHover={{ 
        backgroundColor: "rgba(140, 130, 121, 0.15)",
        borderColor: "rgba(140, 130, 121, 0.4)",
        color: "#F2F2F2",
        y: -1,
      }}
      whileTap={{ scale: 0.95 }}
    >
      {tag}
    </motion.span>
  );
}

interface ProjectCardProps {
  project: Project;
  onExpand: () => void;
  index: number;
  isAnyExpanded: boolean;
}

function ProjectCard({ project, onExpand, index, isAnyExpanded }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const spanClasses = {
    default: "",
    wide: "sm:col-span-3 md:col-span-3 lg:col-span-3", width: "w-full",
    tall: "sm:row-span-2 md:row-span-2", height: "h-full",
  };

  // Use GIF for preview if available, otherwise use main image
  const previewImage = project.gifUrl || project.image;

  return (
    <motion.article
      className={`
        relative flex flex-col cursor-pointer
        bg-deep-black rounded-lg overflow-hidden
        ${spanClasses[project.span]}
      `}
      onClick={onExpand}  
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layoutId={`project-${project.id}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: appleEase,
        layout: layoutTransition,
      }}
      style={{
        zIndex: isHovered ? 10 : 1,
        border: isHovered ? "1px solid rgba(140, 130, 121, 0.6)" : "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: isHovered ? "0 0 40px -5px rgba(140, 130, 121, 0.4)" : "none",
      }}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <TrafficLights />
        <span className="text-xs tracking-wider text-engineering-white/70 uppercase font-medium">
          {project.title}
        </span>
        <div className="w-[52px]" />
      </div>

      {/* Content Area */}
      <motion.div 
        className={`relative flex-1 overflow-hidden ${project.span === "tall" ? "min-h-[400px]" : "min-h-[200px] md:min-h-[220px]"}`}
        animate={{ opacity: isAnyExpanded ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      >
        {/* Project Image/GIF with Zoom Effect */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: isHovered ? 1.2 : 1 }}
          transition={{ duration: 0.6, ease: appleEase }}
        >
          <img
            src={previewImage}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Fallback gradient */}
          <div 
            className="absolute inset-0 -z-10"
            style={{
              background: `
                radial-gradient(ellipse at 30% 20%, rgba(78, 79, 80, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(140, 130, 121, 0.1) 0%, transparent 50%),
                linear-gradient(180deg, rgba(5, 5, 5, 0.9) 0%, rgba(12, 12, 12, 1) 100%)
              `,
            }}
          />
        </motion.div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/20 to-deep-black/10 pointer-events-none" />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {project.tags.slice(0, 2).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-0.5 text-[9px] font-mono tracking-wider text-engineering-white/60 bg-deep-black/20 backdrop-blur-xl rounded border border-white/10 uppercase"
            >
              {tag}
            </span>
          ))}
          {/* GIF indicator
          {project.gifUrl && (
            <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider text-turbonite-highlight bg-deep-black/60 backdrop-blur-sm rounded border border-turbonite-highlight/30 uppercase">
              
            </span>
          )} */}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <p className="text-sm text-engineering-white/90 line-clamp-2 mb-2">
            {project.description}
          </p>
          <div className="flex items-center justify-between">
            <motion.span 
              className="text-[12px] font-mono tracking-wider text-turbonite-highlight/70 uppercase"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              Click to expand →
            </motion.span>
            <span className="px-2 py-1 text-[10px] font-mono tracking-wider text-engineering-white/70  backdrop-blur-xl rounded border border-white/10">
              {project.date}
            </span>
          </div>
        </div>

        {/* Hover highlight */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-turbonite-highlight/10 via-transparent to-transparent pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.article>
  );
}

interface ExpandedCardProps {
  project: Project;
  onClose: () => void;
}

function ExpandedCard({ project, onClose }: ExpandedCardProps) {
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    
    const timer = setTimeout(() => setContentVisible(true), 150);
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, [onClose]);

  const handleClose = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a778414a-2499-4b15-8f5b-a13326ec8d0e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'EngineeringHub.tsx:handleClose',message:'handleClose called',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    setContentVisible(false);
    setTimeout(onClose, 100);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-deep-black/40 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleClose}
      />

      {/* Expanded card */}
      <motion.article
        className="fixed inset-4 md:inset-12 lg:inset-24 z-50 flex flex-col bg-deep-black/20 border border-white/10 rounded-lg overflow-hidden font-porsche"
        layoutId={`project-${project.id}`}
        transition={layoutTransition}
      >
        {/* Title Bar - matches Resume modal styling */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-4">
            <TrafficLights onClick={handleClose} interactive />
            <span className="text-xs font-mono tracking-wider text-turbonite-base uppercase">
              {project.id}
            </span>
          </div>
          <div className="w-[52px]" /> {/* Spacer for layout balance */}
        </div>

        {/* Expanded content */}
        <motion.div 
          className="flex-1 overflow-y-auto overflow-x-hidden min-h-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: contentVisible ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full lg:h-auto">
            {/* Left - Main Image */}
            <div className="relative min-h-[300px] lg:min-h-full lg:sticky lg:top-0 border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden cursor-pointer">
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover "
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Fallback gradient */}
              <div 
                className="absolute inset-0 -z-10"
                style={{
                  background: `
                    radial-gradient(ellipse at 30% 20%, rgba(78, 79, 80, 0.2) 0%, transparent 50%),
                    radial-gradient(ellipse at 70% 80%, rgba(140, 130, 121, 0.15) 0%, transparent 50%),
                    linear-gradient(180deg, rgba(5, 5, 5, 0.9) 0%, rgba(12, 12, 12, 1) 100%)
                  `,
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-deep-black/20 pointer-events-none" />
              
              {/* Grid pattern overlay */}
              <div 
                className="absolute inset-0 opacity-[0.015] cursor-pointer "
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(242, 242, 242, 1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(242, 242, 242, 1) 1px, transparent 1px)
                  `,
                  backgroundSize: "30px 30px",
                }}
              />
            </div>

            {/* Right - Content */}
            <div className="p-6 md:p-8 lg:p-10 lg:h-full lg:overflow-y-auto lg:min-h-0">
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <CourseChip key={tag} tag={tag} index={index} />
                  ))}
                </div>
                <h2 className="text-2xl md:text-3xl font-porsche tracking-tight text-engineering-white uppercase mb-2 text-left">
                  {project.title}
                </h2>
                <p className="text-sm font-thin text-engineering-white leading-relaxed">
                  {project.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-[10px] font-mono text-turbonite-base uppercase tracking-wider">
                  <span>{project.date}</span>
                  <span className="w-1 h-1 rounded-full bg-turbonite-base/40" />
                  <span>Evan Sie</span>
                </div>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-turbonite-highlight/50 via-turbonite-base/20 to-transparent mb-8" />

              {/* Content */}
              <div className="prose prose-invert prose-sm max-w-none">
                {project.content.split("\n\n").map((paragraph, i) => {
                  if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                    return (
                      <h3 key={i} className="text-sm font-porsche tracking-wide uppercase text-engineering-white mt-6 mb-3">
                        {paragraph.replace(/\*\*/g, "")}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith("**")) {
                    const [title, ...rest] = paragraph.split(":**");
                    return (
                      <div key={i} className="mt-6 mb-3">
                        <h3 className="text-sm font-porsche tracking-wide uppercase text-engineering-white mb-3">
                          {title.replace(/\*\*/g, "")}
                        </h3>
                        {rest.length > 0 && (
                          <p className="text-sm font-thin text-engineering-white leading-relaxed">
                            {rest.join(":**")}
                          </p>
                        )}
                      </div>
                    );
                  }
                  if (paragraph.startsWith("- ")) {
                    const items = paragraph.split("\n").filter(line => line.startsWith("- "));
                    return (
                      <ul key={i} className="space-y-2 my-4">
                        {items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm font-thin text-engineering-white">
                            <span className="w-1 h-1 rounded-full bg-turbonite-highlight mt-2 shrink-0" />
                            <span>{item.replace("- ", "")}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={i} className="text-sm font-thin text-engineering-white leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Gallery Images & Videos */}
              {project.galleryImages && project.galleryImages.length > 0 && (
                <div className="mt-8">
                  <div className="w-full h-px bg-gradient-to-r from-turbonite-highlight/50 via-turbonite-base/20 to-transparent mb-6" />
                  <p className="font-mono text-[10px] tracking-[0.2em] text-turbonite-highlight uppercase mb-4">
                    Gallery
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {project.galleryImages.map((mediaUrl, idx) => {
                      // Check if it's a video file
                      const isVideo = /\.(mp4|webm|mov|m4v)$/i.test(mediaUrl);
                      
                      return (
                        <div 
                          key={idx} 
                          className="relative aspect-video rounded-lg overflow-hidden border border-white/10"
                        >
                          {isVideo ? (
                            <video
                              src={mediaUrl}
                              className="w-full h-full object-cover"
                              controls
                              muted
                              autoPlay
                              loop
                              playsInline
                              preload="auto"
                            />
                          ) : (
                            <img
                              src={mediaUrl}
                              alt={`${project.title} gallery ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.article>
    </>
  );
}

function ToolsSection() {
  const tools = [
    "SolidWorks", "ANSYS", "MATLAB", "Python", "AutoCAD", "Fusion 360",
    "UAV", "Betaflight", "Arduino", "Raspberry Pi", "3D Printing", "CNC"
  ];

  return (
    <motion.div 
      className="mt-16 sm:mt-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
    >
      <p className="text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] text-turbonite-highlight uppercase mb-6 sm:mb-8 text-center sm:text-left">
        Skills & Tools
      </p>
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
        {tools.map((tool, index) => (
          <motion.span
            key={tool}
            className="px-4 py-2 text-xs font-mono tracking-wider text-turbonite-base/70 bg-white/[0.02] border border-white/5 rounded-lg hover:border-turbonite-highlight/30 hover:text-engineering-white transition-all duration-200 cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0, duration: 0, ease: appleEase }}
            whileHover={{ y: -2 }}
          >
            {tool}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default function EngineeringHub() {
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 0.4], [40, 0]);

  // Notify FloatingDock when modal is open/closed
  useEffect(() => {
    if (expandedProject) {
      document.body.setAttribute("data-modal-open", "true");
    } else {
      document.body.removeAttribute("data-modal-open");
    }
    
    return () => {
      document.body.removeAttribute("data-modal-open");
    };
  }, [expandedProject]);

  const handleExpand = (project: Project) => {
    setExpandedProject(project);
  };

  const handleClose = () => {
    setExpandedProject(null);
  };

  return (
    <>
      <section 
        ref={sectionRef}
        id="works" 
        className="relative min-h-screen py-20 sm:py-32 md:py-48"
      >
        {/* SVG Grid Background */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="works-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path 
                  d="M 60 0 L 0 0 0 60" 
                  fill="none" 
                  stroke="rgba(242, 242, 242, 0.02)" 
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#works-grid)" />
          </svg>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 md:px-12 max-w-6xl">
          {/* Section header */}
          <motion.div 
            className="mb-12 sm:mb-24 md:mb-32 text-center sm:text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: appleEase }}
            style={{ y: headerY }}
          >
            <p className="text-[10px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.3em] text-turbonite-highlight uppercase mb-6 sm:mb-8">
              03 — Personal Projects
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-engineering-white">
              Works
            </h2>
            <div className="mt-4 sm:mt-6 w-24 sm:w-32 h-px bg-gradient-to-r from-turbonite-highlight/80 to-transparent mx-auto sm:mx-0 font-porsche" />
            <p className="mt-6 sm:mt-8 text-sm sm:text-base text-turbonite-base/90 max-w-xl leading-relaxed mx-auto sm:mx-0 font-porsche">
              A collection of recent projects Ive been working on so far. Take a look!
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 isolate">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                onExpand={() => handleExpand(project)}
                index={index}
                isAnyExpanded={!!expandedProject}
              />
            ))}
          </div>

          <ToolsSection />
        </div>
      </section>

      <AnimatePresence>
        {expandedProject && (
          <ExpandedCard 
            key={expandedProject.id}
            project={expandedProject} 
            onClose={handleClose} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
