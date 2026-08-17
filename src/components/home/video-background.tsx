"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHome } from "./home-context";

export function VideoBackground() {
  const { videoState, setVideoState } = useHome();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  // Sound only while open; nudge playback if the browser paused us.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = videoState !== "open";
    if (video.paused) video.play().catch(() => {});
  }, [videoState]);

  useEffect(() => {
    if (videoState !== "open") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVideoState("closed");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [videoState, setVideoState]);

  // canplay can fire before hydration attaches the listener.
  const attachVideo = useCallback((video: HTMLVideoElement | null) => {
    videoRef.current = video;
    if (video && video.readyState >= 3) setReady(true);
  }, []);

  const open = videoState === "open";

  return (
    <div
      className="fixed-video-layer"
      data-state={videoState}
      onMouseMove={open ? (e) => setCursor({ x: e.clientX, y: e.clientY }) : undefined}
      onClick={open ? () => setVideoState("closed") : undefined}
    >
      <video
        ref={attachVideo}
        className="video-background"
        src="/videos/video-background.mp4"
        autoPlay
        playsInline
        loop
        muted
        preload="auto"
        disablePictureInPicture
        data-ready={ready}
        data-state={videoState}
        onCanPlay={() => setReady(true)}
      />
      {open && (
        <button
          type="button"
          className="video-close"
          style={{
            top: cursor ? cursor.y - 14 : 16,
            left: cursor ? cursor.x - 51 : 16,
            cursor: "none",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setVideoState("closed");
          }}
        >
          <span className="video-close-label">Close</span>
        </button>
      )}
    </div>
  );
}
