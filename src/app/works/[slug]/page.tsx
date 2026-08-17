import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { workItems } from "@/lib/content";
import type { Media } from "@/types/content";

export function generateStaticParams() {
  return workItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = workItems.find((w) => w.slug === slug);
  if (!item) return {};
  return {
    title: `${item.title ?? item.heading} — Evan Sie`,
    description: item.summary ?? item.subheading,
  };
}

function isVideo(media: Media) {
  return media.kind === "video" || /\.(mp4|webm|mov|m4v)$/i.test(media.src);
}

function GalleryItem({ media }: { media: Media }) {
  if (isVideo(media)) {
    return (
      <video
        className="gallery-media"
        src={media.src}
        aria-label={media.alt}
        controls
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="gallery-media" src={media.src} alt={media.alt} loading="lazy" decoding="async" />
  );
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = workItems.find((w) => w.slug === slug);
  if (!item) notFound();

  return (
    <>
      <Nav />
      <div className="page">
        <div className="page-container">
          <div className="page-hero" style={{ backgroundColor: item.bg }}>
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="page-hero-img" src={item.image.src} alt={item.image.alt} />
            ) : (
              <span className="pg-slot" style={{ color: item.fg }}>
                {item.imageHint}
              </span>
            )}
          </div>

          {(item.date || item.subheading) && (
            <div className="page-meta">
              {item.date && <span>{item.date}</span>}
              {item.subheading && <span>{item.subheading}</span>}
            </div>
          )}

          <h1 className="page-title">{item.title ?? item.heading}</h1>
          {item.summary && <p className="page-intro">{item.summary}</p>}

          {item.tags && item.tags.length > 0 && (
            <ul className="tag-row">
              {item.tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <div className="page-body">
            {item.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

            {item.link && (
              <p>
                <a href={item.link.href} target="_blank" rel="noopener">
                  {item.link.label} ↗
                </a>
              </p>
            )}

            {item.achievements && item.achievements.length > 0 && (
              <>
                <h2 className="page-subhead">Key achievements</h2>
                <ul className="achievement-list">
                  {item.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {item.gallery && item.gallery.length > 0 && (
            <div className="gallery">
              <h2 className="page-subhead">Gallery</h2>
              <div className="gallery-grid">
                {item.gallery.map((media) => (
                  <div className="gallery-frame" key={media.src}>
                    <GalleryItem media={media} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link href="/" className="page-back">
            ← Back
          </Link>
        </div>
      </div>
    </>
  );
}
