"use client";

import Link from "next/link";
import type { Media, WorkItem } from "@/types/content";

function isVideo(media: Media) {
  return media.kind === "video" || /\.(mp4|webm|mov|m4v)$/i.test(media.src);
}

/*
 * When the tile media declares its intrinsic size, the frame takes that exact
 * ratio so nothing is cropped or letterboxed. Otherwise fall back to the
 * design's square / 4:5 frames.
 */
function tileAspect(item: WorkItem): string | undefined {
  const media = tileMedia(item);
  if (media?.width && media.height) return `${media.width} / ${media.height}`;
  return undefined;
}

function tileMedia(item: WorkItem) {
  return item.tile ?? item.image;
}

function TilePreview({ item }: { item: WorkItem }) {
  const media = tileMedia(item);

  if (!media) {
    return (
      <span className="pg-slot" style={{ color: item.fg }}>
        {item.imageHint}
      </span>
    );
  }

  if (isVideo(media)) {
    return (
      <video
        src={media.src}
        aria-label={media.alt}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
      />
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={media.src} alt={media.alt} />;
}

/*
 * Tile logic studied from the nathansmith.design clone in `website 5/`:
 * a staggered two-column grid where odd/even tiles pull toward the centre gutter,
 * plus a 3D tilt that tracks the pointer across each card.
 *
 * Entrance (scale 1.2 → 1, opacity 0 → 1) is driven by useScrollEffects, which
 * writes transforms directly so it can run on every scroll frame without
 * re-rendering React.
 */

export function PortfolioGrid({ items }: { items: WorkItem[] }) {
  const onTiltMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const visual = e.currentTarget.querySelector<HTMLElement>(
      ".portfolio-grid-card-visual-wrapper",
    );
    if (!visual) return;
    const rect = visual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    visual.style.transform = `rotateX(${5 - y * 10}deg) rotateY(${-5 + x * 10}deg)`;
  };

  const onLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const visual = e.currentTarget.querySelector<HTMLElement>(
      ".portfolio-grid-card-visual-wrapper",
    );
    if (visual) visual.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <section id="works" className="section-portfolio-grid">
      <div className="works-padding">
        <div className="works-container">
          <div className="portfolio-grid-collection-wrapper">
            <div className="portfolio-grid-content-wrapper" role="list">
              {items.map((item) => (
                <div className="portfolio-grid-item" key={item.slug} role="listitem">
                  <Link
                    href={`/works/${item.slug}`}
                    className="portfolio-grid-card"
                    data-bg={item.bg}
                    data-fg={item.fg}
                    onMouseMove={onTiltMove}
                    onMouseLeave={onLeave}
                  >
                    <div
                      className={`portfolio-grid-card-visual-wrapper${
                        item.portrait ? " is-portrait" : ""
                      }`}
                      style={{
                        // Only backs the empty-slot placeholder; media fills the
                        // frame edge to edge on its own.
                        backgroundColor: tileMedia(item) ? undefined : item.bg,
                        aspectRatio: tileAspect(item),
                      }}
                    >
                      <div className="pg-media">
                        <TilePreview item={item} />
                      </div>
                    </div>
                    <div className="portfolio-grid-text-wrapper">
                      <div className="portfolio-grid-heading-wrapper">
                        <div className="portfolio-grid-heading-punctuation">→ </div>
                        <h2 className="portfolio-grid-heading">{item.heading}</h2>
                      </div>
                      {item.subheading && (
                        <h2 className="portfolio-grid-subheading">{item.subheading}</h2>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
