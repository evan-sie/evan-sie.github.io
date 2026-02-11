"use client";

import { useEffect, useState } from "react";

/** Shared mobile detection hook — breakpoint matches Tailwind `sm:` (640px) */
export default function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener("resize", check, { passive: true });
        return () => window.removeEventListener("resize", check);
    }, []);

    return isMobile;
}
