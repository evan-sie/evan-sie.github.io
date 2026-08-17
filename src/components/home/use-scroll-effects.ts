"use client";

import { useEffect, useRef } from "react";
import { useHome } from "./home-context";

function scrollTop() {
  return Math.max(
    window.scrollY || 0,
    document.scrollingElement?.scrollTop || 0,
    document.body.scrollTop || 0,
  );
}

function track(progress: number, from: number, to: number) {
  return Math.min(1, Math.max(0, (progress - from) / (to - from)));
}

/** outQuad — nathan's tile easing, used for the scale. */
function ramp(progress: number, from: number, to: number) {
  const t = track(progress, from, to);
  return 1 - (1 - t) * (1 - t);
}

function scrollMax() {
  const se = document.scrollingElement || document.documentElement;
  return Math.max(
    se.scrollHeight - se.clientHeight,
    document.body.scrollHeight - document.body.clientHeight,
  );
}

/*
 * Every scroll-driven behaviour on the home page, ported from the design's
 * updateScroll(). Styles are written straight to the DOM rather than through
 * state, so a scroll frame never triggers a React render; only the single
 * discrete flag (nav stack, which the counter also rides) goes through context.
 */
export function useScrollEffects() {
  const { navStacked, setNavStacked } = useHome();

  // Read the latest flag inside the scroll handler without resubscribing it on
  // every toggle.
  const stacked = useRef(navStacked);
  useEffect(() => {
    stacked.current = navStacked;
  }, [navStacked]);

  const lastY = useRef(0);

  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight;

      // Bio text eases 1 → 0.85 across the first 10% of the works run, and back
      // out again over the last 10%.
      const collection = document.querySelector(".portfolio-grid-collection-wrapper");
      const intro = document.querySelector<HTMLElement>(".intro-scale");
      if (collection && intro) {
        const rect = collection.getBoundingClientRect();
        const total = rect.height + vh;
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / total));
        const t =
          progress < 0.5
            ? Math.min(1, progress / 0.1)
            : Math.min(1, (1 - progress) / 0.1);
        const scale = 1 - t * 0.15;
        intro.style.transform = `scale3d(${scale}, ${scale}, 1)`;
      }

      // Tile entrance: scale 1.2 → 1 across 15–30% of the tile's travel, on
      // nathan's outQuad. The media itself stays fully visible throughout.
      document.querySelectorAll<HTMLElement>(".portfolio-grid-item").forEach((item) => {
        const rect = item.getBoundingClientRect();
        const total = rect.height + vh;
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / total));

        const scale = 1.2 - ramp(progress, 0.15, 0.3) * 0.2;
        item.style.transform = `scale3d(${scale}, ${scale}, 1)`;
      });

      const y = scrollTop();

      // Past the tail spacer the view matches the top, so wrap around rather
      // than dead-ending.
      const max = scrollMax();
      if (max > 0 && y >= max - 2) {
        document.body.scrollTop = 0;
        const se = document.scrollingElement || document.documentElement;
        se.scrollTop = 0;
        lastY.current = 0;
        if (stacked.current) setNavStacked(false);
        return;
      }

      if (y > lastY.current && y > 24) {
        if (!stacked.current) setNavStacked(true);
      } else if (y < lastY.current) {
        if (stacked.current) setNavStacked(false);
      }
      lastY.current = y;
    };

    // Wheeling up at the very top jumps to the tail, so momentum carries back
    // up through the tiles — the other half of the loop.
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0 && scrollTop() <= 1) {
        const max = scrollMax();
        if (max > 8) {
          window.scrollTo(0, max - 8);
          lastY.current = max - 8;
        }
      }
    };

    /*
     * update() reads layout (getBoundingClientRect) and then writes transforms,
     * so running it per scroll event forces a synchronous reflow each time.
     * Coalescing into one animation frame caps it at the refresh rate and keeps
     * the read/write in the same frame.
     */
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    lastY.current = scrollTop();
    update();

    // body is the scroll container here, so capture catches its scroll events.
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onScroll);
    };
  }, [setNavStacked]);
}
