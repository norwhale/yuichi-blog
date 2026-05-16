# yuichi.blog Brand Guidelines

## Overview

**yuichi.blog** is a personal blog by Yuichi — a 33-year-old former IT engineer from Tokyo, now studying medicine at a medical university in Bulgaria. The blog documents the intersection of technology, medicine, and life abroad.

**Tagline:** Reverse Engineering The Human Body.
**Design Philosophy:** Clinical Brutalism meets Technical Elegance
**Tone:** Honest, reflective, technically precise, bilingual (Japanese/English)

---

## Colors

### Primary Palette

| Token | Hex | Role |
|---|---|---|
| `--background` | `#F8FAFC` | Page background (slate-50) |
| `--foreground` | `#0F172A` | Primary text, headings (slate-900) |
| `--accent` | `#06B6D4` | Primary accent — links, hover, CTAs (cyan-500) |
| `--accent-dark` | `#1E3A8A` | Secondary accent — gradient, deep elements (blue-900) |
| `--muted` | `#64748B` | Secondary text, metadata (slate-500) |
| `--border` | `#E2E8F0` | Borders, dividers, grid lines (slate-200) |
| `--card` | `#FFFFFF` | Card backgrounds, nav background |
| `--accent-light` | `#ECFEFF` | Tag backgrounds, code highlights (cyan-50) |

### Dark Mode Palette

| Token | Hex |
|---|---|
| `--background` | `#0F172A` |
| `--foreground` | `#F1F5F9` |
| `--muted` | `#94A3B8` |
| `--border` | `#1E293B` |
| `--card` | `#1E293B` |
| `--accent` | `#06B6D4` |
| `--accent-dark` | `#3B82F6` |
| `--accent-light` | `#0C4A6E` |

### Usage Rules

- **Accent cyan (`#06B6D4`)** is used for: interactive elements, hover states, links, pinned labels, tech-line animations, selection highlight
- **Deep blue (`#1E3A8A`)** is used for: gradient endpoints, button hover states, overlay tints
- **Never** use accent colors for large background areas — keep backgrounds neutral
- Selection color is always cyan text on white: `::selection { background: #06B6D4; color: #fff; }`

---

## Typography

### Font Stack

| Purpose | Font | Fallback |
|---|---|---|
| **Headings & Body** | Inter | Geist Sans, system-ui, sans-serif |
| **Code & Metadata** | JetBrains Mono | Geist Mono, monospace |

### Scale

| Element | Size | Weight | Tracking |
|---|---|---|---|
| Hero h1 | 5xl–7xl (3rem–4.5rem) | 800 (extrabold) | tight (-0.025em) |
| Page h1 | 3xl (1.875rem) | 800 | tight |
| Section h2 | 3xl (1.875rem) | 700 (bold) | tight |
| Card title | xl (1.25rem) | 700 | snug |
| Body text | base (1rem) | 400 | normal |
| Prose line-height | — | — | 1.8 |
| Metadata / labels | xs (0.75rem) | 500–700 | widest (monospace) |
| Tags | 10px | 500 | wide, uppercase |

### Monospace Usage

JetBrains Mono is used for:
- Date stamps (e.g., `05 APR 2026`)
- Record counts (e.g., `Queried 16 matching records.`)
- Status badges (e.g., `Status: Pre-Med Year 1`)
- Tag labels
- Code blocks and inline code
- System labels (e.g., `SYSTEM REBOOT // V2.0`)

---

## Component Styling

### Navigation

- **Position:** Fixed top, full-width, z-50
- **Background:** `bg-card/80 backdrop-blur-md`
- **Height:** h-16 (64px)
- **Border:** 1px bottom, `border-border`
- **Logo:** 32x32 dark block with white monospace initials "YB", hover → cyan background

### Buttons

| Type | Style |
|---|---|
| Primary | `bg-foreground text-background`, hover → `bg-accent-dark` |
| Secondary | `bg-card border border-border text-foreground`, hover → `border-accent` |
| **Shape:** | Rectangle — **no border-radius** |

### Cards (Blog Posts)

- **Image:** `aspect-[4/3]`, `border border-border`, `grayscale opacity-80` → hover: `grayscale-0 scale-105 opacity-100` (500ms transition)
- **Tech-line:** 2px cyan left border, `scaleY(0)` → hover: `scaleY(1)` (cubic-bezier 0.16, 1, 0.3, 1)
- **Title:** Bold, hover → cyan color transition
- **Tags:** Uppercase monospace, 10px, bordered rectangles
- **No border-radius** on cards or images

### Hero Section

- **Layout:** 12-column grid (7 text + 5 image on desktop)
- **Background:** Schematic grid pattern (40px × 40px, border-color lines)
- **Headline gradient:** `bg-gradient-to-r from-accent-dark to-accent` with `text-transparent bg-clip-text`
- **Image container:** `inset-4`, `border border-border`, `shadow-rigid`, dark background (`#0F172A`), `object-contain`
- **Status badge:** Floating card with green pulse dot, monospace text

### Shadows

| Name | Value |
|---|---|
| `shadow-rigid` | `4px 4px 0px 0px rgba(15, 23, 42, 0.05)` |
| `shadow-rigid-hover` | `6px 6px 0px 0px rgba(6, 182, 212, 0.2)` |

### Tables (Prose)

- Full-width, collapsed borders
- Header: `bg-accent-light`, monospace, uppercase, 0.8rem, letter-spacing 0.05em
- Cells: 1px border, 0.5rem 0.75rem padding

### Code Blocks

- Background: `#0F172A` (dark slate)
- Text: `#E2E8F0`
- No border-radius — sharp rectangles
- 1px border, border-color

### Blockquotes

- 2px left border in accent cyan
- Muted color, italic

---

## Layout Principles

### Spacing

- **Max content width:** 7xl (80rem / 1280px) for homepage, 3xl (48rem / 768px) for articles
- **Page padding:** px-6 (1.5rem)
- **Header offset:** All pages must have `pt-24` (6rem) to clear the fixed navbar
- **Section gap:** mb-24 for hero, gap-12 for grid, gap-8 for card grid

### Grid

- **Homepage cards:** 1 column (mobile) → 2 columns (md) → 3 columns (lg)
- **Gap:** gap-y-12 gap-x-8
- **Hero:** 1 column (mobile) → 12-column grid (lg), 7+5 split

### Responsive Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| Default | <640px | Single column, stacked layout |
| `sm` | 640px | Minor padding adjustments |
| `md` | 768px | 2-column card grid, side-by-side buttons |
| `lg` | 1024px | 3-column cards, hero grid layout |

---

## Do's and Don'ts

### Do

- ✅ Use monospace for all metadata, dates, counts, and system-style labels
- ✅ Keep images grayscale by default, color on hover (life emerging from clinical precision)
- ✅ Use sharp rectangles — the aesthetic is surgical, not soft
- ✅ Maintain bilingual Japanese/English content throughout
- ✅ Use cyan accent sparingly — it should feel like a precise highlight, not decoration
- ✅ Keep prose line-height at 1.8 for comfortable reading of long articles

### Don't

- ❌ Use border-radius on cards, buttons, or images (except the logo block)
- ❌ Use accent cyan for large background areas
- ❌ Mix more than 2 fonts on a single page
- ❌ Use emojis in headings or navigation (only in content where contextually appropriate)
- ❌ Add decorative elements that don't convey information
- ❌ Use bright/saturated colors outside the defined palette

---

## Brand Voice

- **First person, honest:** "I am not the smartest in the room. But I am still here."
- **Technical but accessible:** Engineering metaphors applied to medicine and life
- **Bilingual:** Japanese primary, English for international reach
- **Reflective, not promotional:** Observations over opinions, data over claims
- **Medical disclaimer required** for any health-related content (YMYL compliance)

---

## File Naming Conventions

- Blog posts: `kebab-case.md` (e.g., `cost-of-living-bulgaria.md`)
- Images: `hero-{topic}.jpeg` for hero images, descriptive kebab-case for inline
- All images compressed to <900KB before deployment
- OGP images: 1200×630 JPEG

---

## Key URLs

- **Production:** https://yuichi.blog
- **OGP Image:** https://yuichi.blog/opengraph-image
- **Sitemap:** https://yuichi.blog/sitemap.xml
- **ads.txt:** https://yuichi.blog/ads.txt
- **X (Twitter):** https://x.com/Yu_Hyakuya123
- **Contact:** https://yuichi.blog/contact
