import type { WorkItem } from "@/types/content";

/*
 * The Works tiles, in display order: plane, then balloon.
 * `bg`/`fg` come from the design prototype's data-bg / data-fg attributes.
 *
 * The smart mirror and wind tunnel entries are parked for now — their copy and
 * images are in git history if they come back.
 */
export const workItems: WorkItem[] = [
  {
    slug: "vtol-aircraft",
    heading: "VTOL Aircraft",
    title: "Folding Wing VTOL Aircraft",
    achievements: [
      "Fabricated and assembled a 1.6 m wingspan, 3D-printed folding-wing QuadPlane on a Bambu Lab A1, using five filament types (LW-PLA, CF-PLA, PETG, TPU, PLA).",
      "Configured parameters in both QGroundControl and Mission Planner running ArduPlane.",
      "Designed an innovative wing transition mechanism using a belt and pulley system inspired by 3D printers.",
      "Integrated a Matek H743 flight controller, BN-880 GPS, and 900 MHz ELRS link.",
      "Verified control behavior in the ArduPilot SITL simulator.",
    ],
    bg: "#d8d4c8",
    fg: "#121113",
    imageHint: "VTOL aircraft — build or flight shot",
    tile: {
      src: "/videos/aerofold loop.mp4",
      alt: "The aircraft folding its wings mid-flight",
      kind: "video",
      width: 480,
      height: 480,
    },
    image: {
      src: "/images/works/vtol-workbench.webp",
      alt: "The folding-wing VTOL aircraft on the workbench, wings unfolded",
    },
  },
  {
    slug: "high-altitude-balloon",
    heading: "High Altitude Balloon",
    summary: "UTD’s High Altitude Balloon Chapter",
    body: [
      "This project was part of my involvement in AIAA’s research division, where five of us built and launched UTD’s first high altitude weather balloon, reaching 92,404 ft (28,164 m).",
    ],
    achievements: [
      "Coordinated a team of five engineers to design, build, and launch three weather balloons, all reaching 91,000 ft or higher, collecting data on cosmic radiation, ozone, temperature, and pressure.",
      "Prioritized and divided work across the team to meet project and flight deadlines.",
      "Used CAD to design and manufacture prototype parts protecting sensitive components against −65 °C conditions.",
      "Ran simulations and real-world testing to confirm payload functionality ahead of the maiden flight.",
      "Built in redundancy across the scientific instruments and data collection software to keep the flight recoverable.",
      "Published two research papers and presented twice at the AIAA Regional Conference at Rice University in Houston, TX.",
    ],
    link: { href: "https://youtu.be/2wPQeWOTOIY", label: "Watch our full maiden flight" },
    bg: "#24313f",
    fg: "#eeeef0",
    portrait: true,
    imageHint: "High-altitude payload — launch or recovery shot",
    tile: {
      src: "/videos/video-background.mp4",
      alt: "Onboard footage from the balloon flight",
      kind: "video",
      width: 1104,
      height: 816,
    },
    image: {
      src: "/images/works/hab-poster.webp",
      alt: "The team presenting the ozone and cosmic radiation poster at the AIAA regional conference",
    },
    gallery: [
      {
        src: "/images/works/hab-inflation.webp",
        alt: "The team inflating the balloon before the night launch",
      },
      {
        src: "/images/works/hab-onboard.webp",
        alt: "Onboard stills: night launch, sunrise from altitude, and the stratosphere",
      },
      { src: "/images/works/payload.webp", alt: "The high altitude balloon payload" },
      { src: "/images/works/runcam.webp", alt: "Onboard camera mount" },
    ],
  },
];
