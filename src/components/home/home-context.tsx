"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type VideoState = "closed" | "preview" | "open";

export const TOTAL_REVEALS = 13;

interface HomeContextValue {
  isOpen: (id: number) => boolean;
  toggle: (id: number) => void;
  openCount: number;
  videoState: VideoState;
  setVideoState: (state: VideoState) => void;
  /** Nav links collapse under the first one while scrolling down; the reveal
   *  counter rides the same signal so both slide away together. */
  navStacked: boolean;
  setNavStacked: (stacked: boolean) => void;
}

const HomeContext = createContext<HomeContextValue | null>(null);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [videoState, setVideoState] = useState<VideoState>("closed");
  const [navStacked, setNavStacked] = useState(false);

  const toggle = useCallback((id: number) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const isOpen = useCallback((id: number) => Boolean(open[id]), [open]);

  const openCount = useMemo(
    () => Object.values(open).filter(Boolean).length,
    [open],
  );

  const value = useMemo(
    () => ({
      isOpen,
      toggle,
      openCount,
      videoState,
      setVideoState,
      navStacked,
      setNavStacked,
    }),
    [isOpen, toggle, openCount, videoState, navStacked],
  );

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export function useHome() {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error("useHome must be used within HomeProvider");
  return ctx;
}
