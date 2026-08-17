"use client";

import { TOTAL_REVEALS, useHome } from "./home-context";

export function Counter() {
  const { openCount, navStacked } = useHome();

  // Shares the nav's trigger so it slides away in step with Home/Album.
  return (
    <div className="counter" data-hidden={navStacked}>
      R{openCount}/{TOTAL_REVEALS}
    </div>
  );
}
