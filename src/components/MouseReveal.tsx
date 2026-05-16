"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * MouseReveal
 *
 * Gentle radial-gradient spotlight that follows the mouse cursor.
 * - Desktop only (pointer: fine) — completely disabled on touch devices.
 * - Uses requestAnimationFrame + lerp for smooth 60fps movement.
 * - Sits above the video overlay (z-[1]) but below content (z-10).
 */
export default function MouseReveal() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const current = useRef({ x: -1000, y: -1000 });
  const raf = useRef(0);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    const el = overlayRef.current;
    if (!el) return;

    // Smooth lag — 0.14 = visible but gentle tracking
    current.current.x = lerp(current.current.x, mouse.current.x, 0.14);
    current.current.y = lerp(current.current.y, mouse.current.y, 0.14);

    const x = current.current.x;
    const y = current.current.y;

    el.style.background = `radial-gradient(
      750px circle at ${x}px ${y}px,
      rgba(6, 182, 212, 0.18) 0%,
      rgba(6, 182, 212, 0.06) 30%,
      rgba(255, 255, 255, 0.02) 50%,
      transparent 70%
    )`;

    raf.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Only enable on devices with a fine pointer (no touch)
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    console.log("MouseReveal initialized");

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    // Start animation loop
    raf.current = requestAnimationFrame(animate);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
    };
  }, [animate]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
}
