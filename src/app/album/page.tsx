import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Album — Evan Sie",
  description: "Photography.",
};

// Placeholder for now, per the design brief — this becomes the photo gallery.
export default function AlbumPage() {
  return (
    <>
      <Nav />
      <div className="page">
        <div className="page-container">
          <h1 className="page-title">Album</h1>
          <p className="page-intro">Photographs. Coming soon.</p>
          <Link href="/" className="page-back">
            ← Back
          </Link>
        </div>
      </div>
    </>
  );
}
