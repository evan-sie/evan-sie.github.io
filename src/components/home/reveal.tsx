"use client";

import { useHome } from "./home-context";

/*
 * A pill and its continuation. The content is always mounted: closed, it renders
 * at blur(var(--ghost-blur)) so the video bleeds through the ghost text.
 *
 * Trigger and Content are exported separately because two pills in the bio
 * ("Aerospace", "LinkedIn") keep their trigger inside a nowrap span while the
 * content sits outside it, so the phrase never breaks across a line.
 */

export function RevealTrigger({ id, children }: { id: number; children: React.ReactNode }) {
  const { isOpen, toggle } = useHome();
  const state = isOpen(id) ? "open" : "closed";

  return (
    <button
      type="button"
      aria-expanded={isOpen(id)}
      aria-controls={`reveal-${id}`}
      data-state={state}
      className="reveal-trigger"
      onClick={() => toggle(id)}
    >
      {children}
    </button>
  );
}

export function RevealContent({ id, children }: { id: number; children: React.ReactNode }) {
  const { isOpen } = useHome();

  return (
    <span className="reveal-content" data-state={isOpen(id) ? "open" : "closed"} id={`reveal-${id}`}>
      {children}
    </span>
  );
}

export function Reveal({
  id,
  label,
  children,
}: {
  id: number;
  label: string;
  children: React.ReactNode;
}) {
  const { isOpen } = useHome();

  return (
    <span data-state={isOpen(id) ? "open" : "closed"}>
      <RevealTrigger id={id}>{label}</RevealTrigger>
      <RevealContent id={id}>{children}</RevealContent>
    </span>
  );
}
