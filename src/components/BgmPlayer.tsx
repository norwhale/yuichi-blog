"use client";

import { useRef, useState } from "react";

/**
 * BgmPlayer
 * - Fixed bottom-right audio toggle button.
 * - Starts muted. Audio only plays on explicit user click (required by browser autoplay policies).
 * - Audio file is lazy-loaded (preload="none") until user interacts.
 */
export default function BgmPlayer({
  src = "/audio/ambient-vibe.mp3",
  title = "Ambient Vibe",
  volume = 0.3,
}: {
  src?: string;
  title?: string;
  volume?: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      a.volume = volume;
      a.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Lazy audio — only loaded on first interaction */}
      <audio ref={audioRef} src={src} loop preload="none" />

      {/* Caption */}
      <div
        className="hidden sm:flex flex-col items-end transition-opacity duration-500"
        style={{ opacity: playing ? 1 : 0.5 }}
      >
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
          {playing ? "Now Playing" : "BGM"}
        </span>
        <span className="text-xs text-white/60">{title}</span>
      </div>

      {/* Button */}
      <button
        onClick={toggle}
        className="group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          background: playing
            ? "rgba(6, 182, 212, 0.15)"
            : "rgba(255, 255, 255, 0.08)",
          border: playing
            ? "1px solid rgba(6, 182, 212, 0.3)"
            : "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: playing ? "0 0 20px rgba(6, 182, 212, 0.15)" : "none",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        aria-label={playing ? "Mute BGM" : "Play BGM"}
      >
        {playing && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              border: "1px solid rgba(6, 182, 212, 0.2)",
              animationDuration: "3s",
            }}
          />
        )}
        <span
          className="relative text-lg"
          style={{ color: playing ? "#06B6D4" : "rgba(255,255,255,0.5)" }}
        >
          {playing ? "🔊" : "🔈"}
        </span>
      </button>
    </div>
  );
}
