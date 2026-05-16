"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/lab/synex" || pathname === "/lab/synex-hero" || pathname.startsWith("/medmentor")) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-card mt-12 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-foreground text-background flex items-center justify-center font-mono font-bold text-[10px]">
            YB
          </div>
          <span className="text-sm text-muted font-medium">
            &copy; {new Date().getFullYear()} Yuichi // Medical Student &amp; Former Engineer
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted">
          <a href="/about" className="hover:text-foreground transition-colors">About</a>
          <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
