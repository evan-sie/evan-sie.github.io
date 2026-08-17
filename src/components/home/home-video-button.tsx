"use client";

import { useHome } from "./home-context";

/*
 * "take pictures" — hovering previews the background video (opacity → 1),
 * clicking opens it fullscreen with sound.
 */
export function HomeVideoButton({ children }: { children: React.ReactNode }) {
  const { videoState, setVideoState } = useHome();

  return (
    <button
      type="button"
      className="home-video-button"
      onClick={() => setVideoState("open")}
      onMouseEnter={() => {
        if (videoState === "closed") setVideoState("preview");
      }}
      onMouseLeave={() => {
        if (videoState === "preview") setVideoState("closed");
      }}
    >
      <span className="home-video-button-label">{children}</span>
    </button>
  );
}
