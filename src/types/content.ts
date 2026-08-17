export interface Media {
  src: string;
  alt: string;
  kind?: "image" | "video";
  /** Intrinsic size. When set on a `tile`, the tile frame adopts this aspect
   *  ratio so the media fits exactly — no cropping, no letterboxing. */
  width?: number;
  height?: number;
}

export interface WorkItem {
  /** Route segment under /works. */
  slug: string;
  /** Short name, used on the tile. */
  heading: string;
  /** Tile subtitle. Omit to show the heading alone. */
  subheading?: string;
  /** Full name, used as the page title where it differs from `heading`. */
  title?: string;
  /** YYYY.MM, as carried over from the old site. */
  date?: string;
  tags?: string[];
  /** One-line description, shown under the page title. */
  summary?: string;
  /** Body paragraphs. */
  body?: string[];
  achievements?: string[];
  link?: { href: string; label: string };
  /** Tile fill, shown until a real image is dropped in. */
  bg: string;
  /** Text colour used on top of `bg`. */
  fg: string;
  /** Portrait tiles use a 4/5 frame instead of a square. */
  portrait?: boolean;
  /** What belongs in this item's image slot, while it is still empty. */
  imageHint: string;
  /** Preview shown on the Works tile. A video here autoplays, muted and looping.
   *  Falls back to `image` when unset. */
  tile?: Media;
  /** Hero shown at the top of the project page. */
  image?: Media;
  gallery?: Media[];
}
