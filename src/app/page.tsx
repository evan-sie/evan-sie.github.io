"use client";

import { Nav } from "@/components/nav";
import { Counter } from "@/components/home/counter";
import { HomeBio } from "@/components/home/home-bio";
import { HomeProvider, useHome } from "@/components/home/home-context";
import { useScrollEffects } from "@/components/home/use-scroll-effects";
import { VideoBackground } from "@/components/home/video-background";
import { PortfolioGrid } from "@/components/works/portfolio-grid";
import { workItems } from "@/lib/content";

/*
 * Bio and Works are one continuous page: the bio is a fixed, always-centred
 * layer and the two 150vh spacers give it scroll room either side, so momentum
 * doesn't fling you straight past it into the tiles. Scrolling off either end
 * wraps around.
 */
function HomeScreen() {
  const { navStacked } = useHome();
  useScrollEffects();

  return (
    <>
      {/*
        The bio blends against the video. Keeping them in one wrapper lets the
        compact layout scroll them together — see .bio-stage in globals.css.
      */}
      <div className="bio-stage">
        <VideoBackground />
        <HomeBio />
      </div>

      <Nav stacked={navStacked} />
      <Counter />

      <div className="hero-spacer" />
      <PortfolioGrid items={workItems} />
      <div className="hero-spacer" />
    </>
  );
}

export default function Home() {
  return (
    <HomeProvider>
      <HomeScreen />
    </HomeProvider>
  );
}
