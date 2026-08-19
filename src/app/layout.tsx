import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NoiseTexture } from "@/components/noise-texture";
import "./globals.css";

/*
 * PP Neue Montreal and PP Editorial New are commercial faces from Pangram
 * Pangram and are NOT covered by an open licence — see the licensing note in
 * the README before this repo or site is shared more widely. Geist Mono is
 * SIL OFL, self-hosted at build time by next/font.
 */

const sans = localFont({
  src: "../../public/fonts/neue-montreal-regular.woff",
  weight: "400",
  style: "normal",
  variable: "--font-sans",
  display: "block",
});

const serif = localFont({
  src: [
    {
      path: "../../public/fonts/editorial-new-regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/editorial-new-italic.woff",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "block",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

/*
 * Without an explicit theme colour, iOS Safari samples the page to tint the
 * status bar and toolbar and lands on white, which shows as white bars above
 * and below a black page. viewport-fit=cover lets the background run under
 * those bars rather than stopping at them.
 */
export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
};

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
