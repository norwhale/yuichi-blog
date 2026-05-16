"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import ScrollReveal from "@/components/ScrollReveal";
import CountUp from "@/components/CountUp";
import AdBanner from "@/components/AdBanner";

type PostData = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  pinned: boolean;
  image?: string;
};

/* ═══════════════ Video Background (unchanged) ═══════════════ */
function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef(0);
  const fadingOutRef = useRef(false);
  const cancel = useCallback(() => { if (frameRef.current) { cancelAnimationFrame(frameRef.current); frameRef.current = 0; } }, []);
  const fade = useCallback((el: HTMLVideoElement, from: number, to: number, ms: number, done?: () => void) => {
    cancel(); const t0 = performance.now();
    const tick = (now: number) => { const p = Math.min((now - t0) / ms, 1); el.style.opacity = String(from + (to - from) * p); if (p < 1) frameRef.current = requestAnimationFrame(tick); else { frameRef.current = 0; done?.(); } };
    frameRef.current = requestAnimationFrame(tick);
  }, [cancel]);
  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    const onCanPlay = () => fade(v, 0, 1, 250);
    const onTime = () => { if (!v.duration || fadingOutRef.current) return; if (v.duration - v.currentTime <= 0.55) { fadingOutRef.current = true; fade(v, parseFloat(v.style.opacity || "1"), 0, 250); } };
    const onEnd = () => { cancel(); v.style.opacity = "0"; fadingOutRef.current = false; setTimeout(() => { v.currentTime = 0; v.play(); fade(v, 0, 1, 250); }, 100); };
    v.addEventListener("canplay", onCanPlay, { once: true }); v.addEventListener("timeupdate", onTime); v.addEventListener("ended", onEnd);
    return () => { cancel(); v.removeEventListener("canplay", onCanPlay); v.removeEventListener("timeupdate", onTime); v.removeEventListener("ended", onEnd); };
  }, [fade, cancel]);
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
      <video ref={videoRef} muted playsInline autoPlay className="w-full h-full object-cover object-top" style={{ opacity: 0 }}>
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4" type="video/mp4"/>
      </video>
    </div>
  );
}

/* ═══════════════ BGM Player ═══════════════ */
function BgmPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      a.volume = 0.3;
      a.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <audio ref={audioRef} src="/audio/ambient-vibe.mp3" loop preload="none" />

      {/* Caption */}
      <div
        className="hidden sm:flex flex-col items-end transition-opacity duration-500"
        style={{ opacity: playing ? 1 : 0.5 }}
      >
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
          {playing ? "Now Playing" : "BGM"}
        </span>
        <span className="text-xs text-white/50">
          Ambient Vibe
        </span>
      </div>

      {/* Button */}
      <button
        onClick={toggle}
        className="group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          background: playing
            ? "rgba(6, 182, 212, 0.15)"
            : "rgba(255, 255, 255, 0.06)",
          border: playing
            ? "1px solid rgba(6, 182, 212, 0.3)"
            : "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: playing
            ? "0 0 20px rgba(6, 182, 212, 0.15)"
            : "none",
        }}
        aria-label={playing ? "Mute BGM" : "Play BGM"}
      >
        {/* Pulse ring when playing */}
        {playing && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              border: "1px solid rgba(6, 182, 212, 0.2)",
              animationDuration: "3s",
            }}
          />
        )}

        <span className="relative text-lg" style={{ color: playing ? "#06B6D4" : "rgba(255,255,255,0.4)" }}>
          {playing ? "🔊" : "🔈"}
        </span>
      </button>
    </div>
  );
}

/* ═══════════════ Main Component ═══════════════ */
export default function SynexHeroClient({ allPosts }: { allPosts: PostData[] }) {
  const pinnedPost = allPosts.find((p) => p.pinned);
  const posts = allPosts.filter((p) => !p.pinned);

  return (
    <div className="min-h-screen">

      {/* Fixed video background for entire page */}
      <VideoBackground />

      {/* BGM Player — fixed bottom-right */}
      <BgmPlayer />

      {/* ═══ HERO — content over fixed video ═══ */}
      <div className="relative z-10">
        <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">

          {/* Hero section (from top page) */}
          <header className="relative mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 lg:py-20 border-b border-white/10">
            <div className="lg:col-span-7 space-y-6 relative z-10">
              <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-accent mb-4">
                <span>System Reboot // v2.0</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Reverse Engineering{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-dark to-accent">
                  The Human Body.
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-muted max-w-2xl leading-relaxed font-light">
                Documenting the architectural transition from building scalable cloud infrastructure in Tokyo to studying complex biological systems in Central Europe.
              </p>

              {/* Pinned Post Info */}
              {pinnedPost && (
                <div className="border-l-2 border-accent pl-4 mt-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-accent mb-1">
                    <span>&#9733; Pinned</span>
                  </div>
                  <Link href={`/blog/${pinnedPost.slug}`} className="group/pin">
                    <h2 className="text-base font-bold text-foreground group-hover/pin:text-accent transition-colors leading-snug">
                      {pinnedPost.title}
                    </h2>
                    <p className="text-sm text-muted mt-1 line-clamp-1">{pinnedPost.description}</p>
                  </Link>
                </div>
              )}

              <div className="pt-6 flex gap-4">
                {pinnedPost ? (
                  <Link
                    href={`/blog/${pinnedPost.slug}`}
                    className="px-6 py-3 bg-foreground text-background font-medium hover:bg-accent-dark transition-colors inline-flex items-center gap-2"
                  >
                    Read Pinned Essay →
                  </Link>
                ) : (
                  <span className="px-6 py-3 bg-foreground text-background font-medium">
                    Read Latest Essay →
                  </span>
                )}
                <Link
                  href="/about"
                  className="px-6 py-3 bg-card border border-border text-foreground font-medium hover:border-accent transition-colors inline-flex items-center gap-2"
                >
                  About Me
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            {pinnedPost?.image && (
              <div className="lg:col-span-5 relative h-[300px] lg:h-[460px] w-full">
                <div className="absolute inset-4 border border-border bg-[#0F172A] shadow-rigid z-10 overflow-hidden flex items-center justify-center">
                  <Image
                    src={pinnedPost.image}
                    alt={`${pinnedPost.title} — ${pinnedPost.description}`}
                    fill
                    className="object-contain opacity-90 hover:opacity-100 transition-opacity duration-700"
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent-dark/20 mix-blend-overlay pointer-events-none" />
                </div>
                <div className="absolute bottom-6 -left-4 z-20 bg-card border border-border p-3 shadow-lg flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <div className="font-mono text-xs">
                    <span className="text-muted">Status:</span>{" "}
                    <span className="font-bold text-foreground">Pre-Med Year 1</span>
                  </div>
                </div>
              </div>
            )}
          </header>

          {/* Stats Section — Glass Morphism Cards with Count-Up */}
          <ScrollReveal>
            <section className="mb-20">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card p-8 text-center">
                  <div className="font-mono text-xs text-accent uppercase tracking-widest mb-3">[01] Articles</div>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">
                    <CountUp end={allPosts.length} suffix="+" />
                  </div>
                  <p className="text-sm text-muted mt-2">Original essays published</p>
                </div>
                <ScrollReveal delay={150}>
                  <div className="glass-card p-8 text-center">
                    <div className="font-mono text-xs text-accent uppercase tracking-widest mb-3">[02] Topics</div>
                    <div className="text-4xl font-extrabold text-foreground tracking-tight">
                      <CountUp end={6} />
                    </div>
                    <p className="text-sm text-muted mt-2">AI, Medicine, Life, Code, OSINT, Gaming</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={300}>
                  <div className="glass-card p-8 text-center">
                    <div className="font-mono text-xs text-accent uppercase tracking-widest mb-3">[03] Languages</div>
                    <div className="text-4xl font-extrabold text-foreground tracking-tight">
                      <CountUp end={2} />
                    </div>
                    <p className="text-sm text-muted mt-2">Japanese &amp; English bilingual</p>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          </ScrollReveal>

        </div>
      </div>

      {/* ═══ CONTENT BELOW — continues over fixed video ═══ */}
      <div className="relative z-10 px-6 pb-20 max-w-7xl mx-auto">

        <AdBanner />

        {/* Logbook Section */}
        <main>
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Logbook</h2>
                <p className="text-muted font-mono text-sm mt-1">
                  Queried {allPosts.length} matching records.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {posts.length === 0 ? (
            <p className="text-muted">記事はまだありません。</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
              {posts.map((post, i) => (
                <ScrollReveal key={post.slug} delay={(i % 3) * 100}>
                  <BlogCard {...post} />
                  {(i + 1) % 6 === 0 && i < posts.length - 1 && (
                    <AdBanner className="my-4 col-span-full" />
                  )}
                </ScrollReveal>
              ))}
            </div>
          )}
        </main>
      </div>

    </div>
  );
}
