"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  if (pathname === "/lab/synex" || pathname === "/lab/synex-hero" || pathname.startsWith("/medmentor")) {
    return null;
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-mono font-bold text-sm group-hover:bg-accent transition-colors">
            YB
          </div>
          <span className="font-semibold tracking-tight text-foreground">yuichi.blog</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-muted">
          <Link href="/" className="hover:text-accent transition-colors">
            Blog
          </Link>
          <Link href="/about" className="hover:text-accent transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-accent transition-colors">
            Contact
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="flex md:hidden items-center gap-4 text-sm text-muted">
          <Link href="/" className="hover:text-accent transition-colors">Blog</Link>
          <Link href="/about" className="hover:text-accent transition-colors">About</Link>
          <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
        </div>
      </nav>
    </header>
  );
}
