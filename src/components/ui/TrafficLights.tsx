"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { MAGNETIC_SPRING } from "@/lib/constants";

interface TrafficLightsProps {
    /** If provided, the red dot becomes an interactive close button with magnetic tug */
    onClick?: () => void;
}

export default function TrafficLights({ onClick }: TrafficLightsProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Spring-based offset for magnetic tug
    const offsetX = useSpring(0, MAGNETIC_SPRING);
    const offsetY = useSpring(0, MAGNETIC_SPRING);
    const magneticScale = useSpring(1, MAGNETIC_SPRING);

    // Listen for magnetic events from LensCursor
    useEffect(() => {
        const el = buttonRef.current;
        if (!el || !onClick) return;

        const handleMove = (e: Event) => {
            const { deltaX, deltaY } = (e as CustomEvent).detail;
            offsetX.set(deltaX);
            offsetY.set(deltaY);
            magneticScale.set(1.85);
            setIsHovered(true);
        };

        const handleLeave = () => {
            offsetX.set(0);
            offsetY.set(0);
            magneticScale.set(1);
            setIsHovered(false);
        };

        el.addEventListener("magnetic-move", handleMove);
        el.addEventListener("magnetic-leave", handleLeave);

        return () => {
            el.removeEventListener("magnetic-move", handleMove);
            el.removeEventListener("magnetic-leave", handleLeave);
        };
    }, [onClick, offsetX, offsetY, magneticScale]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent("cursor-reset"));
        onClick?.();
    };

    // Decorative (non-interactive) variant
    if (!onClick) {
        return (
            <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            </div>
        );
    }

    // Interactive variant with magnetic close button
    return (
        <div className="flex items-center gap-1.5 px-2 py-1.5 -mx-2 -my-1.5 rounded">
            {/* Larger invisible hit area — magnetic zone */}
            <div className="relative -m-3 p-3" data-magnetic-zone="true">
                <motion.button
                    ref={buttonRef}
                    onClick={handleClick}
                    data-magnetic-target="true"
                    className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] cursor-pointer flex items-center justify-center relative"
                    style={{
                        x: offsetX,
                        y: offsetY,
                        scale: magneticScale,
                    }}
                    whileTap={{ scale: 0.9 }}
                >
                    <motion.svg
                        className="absolute w-full h-full p-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#4a0000"
                        strokeWidth="4"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.1 }}
                    >
                        <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                    </motion.svg>
                </motion.button>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
    );
}
