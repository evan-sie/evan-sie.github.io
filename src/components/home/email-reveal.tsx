"use client";

import { useHome } from "./home-context";

/*
 * Unlike the other pills this one swaps rather than expands: the word "email"
 * is replaced in place by the address itself.
 */
export function EmailReveal({ id, address }: { id: number; address: string }) {
  const { isOpen, toggle } = useHome();
  const state = isOpen(id) ? "open" : "closed";

  return (
    <span data-state={state}>
      <button
        type="button"
        className="home-link-button email-closed"
        data-state={state}
        aria-expanded={isOpen(id)}
        onClick={() => toggle(id)}
      >
        email
      </button>
      <a className="home-link email-open" data-state={state} href={`mailto:${address}`}>
        {address}
      </a>
    </span>
  );
}
