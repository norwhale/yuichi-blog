"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlogCard from "@/components/BlogCard";
import AdBanner from "@/components/AdBanner";

type PostData = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  image?: string;
};

/* ── Category mapping: group raw tags into display categories ── */
const CATEGORY_MAP: Record<string, { label: string; emoji: string; keywords: string[] }> = {
  medical: {
    label: "Medical",
    emoji: "🩺",
    keywords: ["medicalstudent", "studyabroad", "chemistry", "biology", "studytips", "lifeinbulgaria", "costofliving"],
  },
  ai: {
    label: "AI & Tech",
    emoji: "🤖",
    keywords: ["ai", "tech", "vibecoding", "claudecode", "nextjs", "llm", "deeplearning", "nvidia", "singlecell"],
  },
  geopolitics: {
    label: "Geopolitics",
    emoji: "🌍",
    keywords: ["geopolitics", "osint", "iranwar2026"],
  },
  personal: {
    label: "Personal",
    emoji: "💭",
    keywords: ["personalgrowth", "mentalhealth", "careerchange", "aboutme"],
  },
  gaming: {
    label: "Gaming",
    emoji: "🎮",
    keywords: ["gaming", "ffxiv", "movies"],
  },
  lab: {
    label: "Lab",
    emoji: "🧪",
    keywords: ["lab", "design", "experimental", "samantha", "macos", "linux", "opensource"],
  },
};

function getPostCategory(tags: string[]): string[] {
  const lowerTags = tags.map((t) => t.toLowerCase());
  const matched: string[] = [];
  for (const [catId, cat] of Object.entries(CATEGORY_MAP)) {
    if (cat.keywords.some((kw) => lowerTags.some((t) => t.includes(kw)))) {
      matched.push(catId);
    }
  }
  return matched.length > 0 ? matched : ["other"];
}

export default function SearchableLogbook({
  posts,
  totalCount,
}: {
  posts: PostData[];
  totalCount: number;
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  /* ── Count articles per category ── */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of posts) {
      for (const cat of getPostCategory(post.tags)) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    }
    return counts;
  }, [posts]);

  /* ── Filter logic: search query + category filter ── */
  const filtered = useMemo(() => {
    let result = posts;

    // Category filter
    if (activeCategory) {
      result = result.filter((post) =>
        getPostCategory(post.tags).includes(activeCategory)
      );
    }

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.description.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, query, activeCategory]);

  const clearAll = () => {
    setQuery("");
    setActiveCategory(null);
  };

  const isFiltering = query.trim() || activeCategory;

  return (
    <main>
      {/* ── Header ── */}
      <div className="mb-4">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Logbook</h2>
        <p className="text-muted font-mono text-sm mt-1">
          {isFiltering
            ? `${filtered.length} of ${totalCount} records matched.`
            : `Queried ${totalCount} matching records.`}
        </p>
      </div>

      {/* ── Category Filter + Search Bar ── */}
      <div className="flex flex-col gap-3 mb-8">
        {/* Category buttons — horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          <button
            onClick={() => setActiveCategory(null)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-mono transition-all duration-200"
            style={{
              background: !activeCategory ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.04)",
              color: !activeCategory ? "#06B6D4" : "rgba(255,255,255,0.5)",
              border: !activeCategory ? "1px solid rgba(6,182,212,0.3)" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            All ({totalCount})
          </button>
          {Object.entries(CATEGORY_MAP).map(([catId, cat]) => {
            const count = categoryCounts[catId] || 0;
            if (count === 0) return null;
            const isActive = activeCategory === catId;
            return (
              <button
                key={catId}
                onClick={() => setActiveCategory(isActive ? null : catId)}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-mono transition-all duration-200 hover:scale-105"
                style={{
                  background: isActive ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.04)",
                  color: isActive ? "#06B6D4" : "rgba(255,255,255,0.5)",
                  border: isActive ? "1px solid rgba(6,182,212,0.3)" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {cat.emoji} {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-card border border-border text-foreground placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          {isFiltering && (
            <button
              onClick={clearAll}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors text-xs font-mono"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 && isFiltering ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="text-center py-16"
          >
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-muted text-sm">
              No articles found{query ? ` for "${query}"` : ""}
              {activeCategory ? ` in ${CATEGORY_MAP[activeCategory]?.label}` : ""}
            </p>
            <button
              onClick={clearAll}
              className="mt-3 text-accent text-sm hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 items-start"
          >
            <AnimatePresence>
              {filtered.map((post, i) => (
                <motion.div
                  key={post.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                    layout: { duration: 0.4 },
                  }}
                >
                  <BlogCard {...post} />
                  {!isFiltering && (i + 1) % 6 === 0 && i < filtered.length - 1 && (
                    <AdBanner className="my-4 col-span-full" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
