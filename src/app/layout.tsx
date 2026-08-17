import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, Inter } from "next/font/google";
import { NoiseTexture } from "@/components/noise-texture";
import "./globals.css";

/*
 * All three faces are open-licensed (SIL OFL) and self-hosted by next/font at
 * build time — no font files in the repo, no requests to Google at runtime.
 */

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "block",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "block",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Evan Sie",
  description:
    "Mechanical engineering senior at UTD. Aerospace, model aircraft, and things I build.",
  openGraph: {
    title: "Evan Sie",
    description:
      "Mechanical engineering senior at UTD. Aerospace, model aircraft, and things I build.",
    images: ["/seo/opengraph-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body>
        {children}
        <NoiseTexture />
      </body>
    </html>
  );
}
