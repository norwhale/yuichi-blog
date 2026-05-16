"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Language } from "@/lib/medmentor/types";
import "katex/dist/katex.min.css";

/* ─── Language Context ─── */
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (l: Language) => void;
}>({ language: "bilingual", setLanguage: () => {} });

export function useLanguage() {
  return useContext(LanguageContext);
}

/* ─── Layout ─── */
export default function MedMentorLayout({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("bilingual");
  const pathname = usePathname();

  const navLinks = [
    { href: "/medmentor", label: "Home" },
    { href: "/medmentor/study", label: "Study" },
    { href: "/medmentor/dashboard", label: "Dashboard" },
    { href: "/medmentor/review", label: "Review" },
  ];

  const langLabels: Record<Language, string> = { en: "EN", ja: "JP", bilingual: "EN/JP" };
  const nextLang: Record<Language, Language> = { en: "ja", ja: "bilingual", bilingual: "en" };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="bg-[#0a0a0a] text-white min-h-screen">
        {/* Nav */}
        <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/medmentor" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 text-white flex items-center justify-center font-mono font-bold text-xs rounded-lg">
                MM
              </div>
              <span className="font-semibold tracking-tight text-white">MedMentor</span>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    pathname === link.href
                      ? "text-cyan-400 font-medium"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLanguage(nextLang[language])}
                className="px-3 py-1 text-xs font-mono border border-white/10 text-white/60 rounded-full hover:border-cyan-400/30 hover:text-cyan-400 transition-colors"
              >
                {langLabels[language]}
              </button>
              <Link
                href="/"
                className="text-xs text-white/30 hover:text-white transition-colors"
              >
                Blog →
              </Link>
            </div>
          </div>
        </nav>

        <main className="pt-16">{children}</main>
      </div>
    </LanguageContext.Provider>
  );
}
