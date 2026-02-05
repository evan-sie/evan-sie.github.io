import { 
  Hero, 
  About,
  FlyingQuote,
  EngineeringHub, 
  Contact, 
  BackgroundCanvas, 
  FloatingDock,
  AeroWireframe
} from "@/components";

export default function Home() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          TAYCAN LAYERING SYSTEM - Z-Index Stack
          ═══════════════════════════════════════════════════════════════════════
          z-0:  BackgroundCanvas (atmospheric effects)
          z-10: Hero Text (behind plane in 3D space)
          z-20: AeroWireframe (SR-71 flies OVER text)
          z-30: Foreground UI (Dock, About, etc.)
      */}

      {/* Layer 0: Global atmospheric background */}
      <BackgroundCanvas />

      {/* Layer 20: SR-71 Blackbird 3D experience - flies OVER hero text */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        <AeroWireframe className="w-full h-full" />
      </div>

      {/* Layer 60: Floating navigation dock (always on top) */}
      <FloatingDock />

      {/* Layer 30: Main content - flows over background, under plane initially */}
      <main className="relative z-30">
        {/* Hero is z-10 internally so plane flies over it */}
        <Hero />
        <About />
        {/* Large spacer for dramatic pause before quote */}
        <div className="h-[128rem] md:h-[96rem]" aria-hidden="true" />
        <FlyingQuote />
        {/* Spacer after quote - before engineering */}
        <div className="h-[48rem] md:h-[64rem]" aria-hidden="true" />
        <EngineeringHub />
        <Contact />
      </main>
    </>
  );
}
