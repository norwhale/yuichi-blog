"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * VideoBackground
 * - Fixed full-screen looping video with custom fade-in/out.
 * - Lazy-loads the video AFTER first paint so it doesn't block the critical render path.
 * - SEO-safe: the video is NOT part of the main content; all SEO text remains in SSR HTML above it.
 */
export default function VideoBackground({
  src = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4",
  overlayOpacity = 0.55,
}: {
  src?: string;
  overlayOpacity?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef(0);
  const fadingOutRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Lazy-load: wait for idle time or 1s after mount — this protects LCP/SEO
  useEffect(() => {
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void) => number;
    };
    const w = window as IdleWindow;
    const idle = w.requestIdleCallback;
    if (idle) {
      idle(() => setShouldLoad(true));
    } else {
      const id = setTimeout(() => setShouldLoad(true), 1000);
      return () => clearTimeout(id);
    }
  }, []);

  const cancel = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
  }, []);

  const fade = useCallback(
    (el: HTMLVideoElement, from: number, to: number, ms: number) => {
      cancel();
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / ms, 1);
        el.style.opacity = String(from + (to - from) * p);
        if (p < 1) frameRef.current = requestAnimationFrame(tick);
        else frameRef.current = 0;
      };
      frameRef.current = requestAnimationFrame(tick);
    },
    [cancel]
  );

  useEffect(() => {
    if (!shouldLoad) return;
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => fade(v, 0, 1, 500);
    const onTime = () => {
      if (!v.duration || fadingOutRef.current) return;
      if (v.duration - v.currentTime <= 0.55) {
        fadingOutRef.current = true;
        fade(v, parseFloat(v.style.opacity || "1"), 0, 250);
      }
    };
    const onEnd = () => {
      cancel();
      v.style.opacity = "0";
      fadingOutRef.current = false;
      setTimeout(() => {
        v.currentTime = 0;
        v.play();
        fade(v, 0, 1, 250);
      }, 100);
    };
    v.addEventListener("canplay", onCanPlay, { once: true });
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    return () => {
      cancel();
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnd);
    };
  }, [fade, cancel, shouldLoad]);

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none"
      aria-hidden="true"
    >
      {shouldLoad && (
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          preload="metadata"
          className="w-full h-full object-cover object-top"
          style={{ opacity: 0 }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      {/* Readability overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
      />
    </div>
  );
}
