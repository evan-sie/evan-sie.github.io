"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/album", label: "Album" },
] as const;

/*
 * Each link past the first gets a --stack-x equal to its offset from the first
 * link, so `is-stacked` slides them all underneath it. Measured after layout
 * and on resize, since the offsets depend on the rendered text width.
 */
export function Nav({ stacked = false }: { stacked?: boolean }) {
  const pathname = usePathname();
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      const container = linksRef.current;
      if (!container) return;
      const links = container.querySelectorAll<HTMLElement>(".nav-link");
      if (links.length < 2) return;
      const first = links[0];
      links.forEach((link, i) => {
        if (i === 0) return;
        link.style.setProperty("--stack-x", `${-(link.offsetLeft - first.offsetLeft)}px`);
      });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="nav">
      <div className="nav-blur" />
      <div className="nav-links" ref={linksRef}>
        {LINKS.map(({ href, label }, i) => (
          <Link
            key={href}
            href={href}
            className={`nav-link${stacked && i > 0 ? " is-stacked" : ""}`}
            data-active={href === "/" ? pathname === "/" : pathname.startsWith(href)}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
