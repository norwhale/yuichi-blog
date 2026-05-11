# yuichi.blog — Design System

> _Clinical Brutalism meets Technical Elegance._
> Tagline: **"Reverse Engineering The Human Body."**

A personal blog by **Yuichi** — 33, former IT engineer from Tokyo, now studying
medicine at a Bulgarian medical university. Writes in Japanese and English about
AI, brain–computer interfaces, medicine, geopolitics, vibe coding with Claude
Code, and life abroad. Currently 23+ articles.

Stack: Next.js 16, React 19, Tailwind CSS v4, TypeScript, Framer Motion,
deployed on Vercel.

## Sources

- **GitHub repo** (imported on-demand):
  `norwhale/yuichi-blog` @ `main` — the live codebase is an early-stage
  Next.js starter; the design described here lives in the author's spec and
  in-flight layout work, not yet committed.
- **Sibling projects referenced in blog posts:**
  `norwhale/samantha-mac`, `norwhale/samantha-os` — provide the "Samantha Lite"
  chatbot concept used on the blog.
- **Content samples** (imported under `reference/`):
  - `her-samantha-vibe-coding.md`
  - `samantha-proactive-ai.md`
- **Brand spec:** provided by author. This README codifies it.

---

## Index

| Path | What it is |
|---|---|
| `colors_and_type.css` | CSS custom properties — colors, type, spacing, radii, shadows, motion, utility classes (`.yb-card`, `.yb-glass`, `.yb-eyebrow`, `.yb-meta`, `.yb-techline`, `.yb-grid-bg`, `.yb-dot-live`). |
| `assets/` | YB monogram logo (+ inverse), SVG icons (Lucide subset), sample cover. |
| `preview/` | Small HTML cards that populate the Design System tab. |
| `ui_kits/yuichi-blog/` | Pixel-level recreation of the marketing/blog site. `index.html` is the demo; JSX components are modular. |
| `reference/` | Real post content copied from the repo — read these to learn voice & rhythm. |
| `SKILL.md` | Agent-Skills-compatible entrypoint for generating branded artifacts. |

---

## Content Fundamentals

**Languages.** Japanese is primary; English reaches an international audience.
Many articles appear in both. Voice is consistent across languages —
introspective, not translated-feeling.

**Person.** First-person singular ("I", "僕"). Never "we"/"our team" — this is
clearly one human writing. Addresses reader as "you" only to draw them into a
shared moment, never to instruct.

**Tone.** Honest, reflective, technically precise. Vulnerable without being
performative. Comfortable with uncertainty: _"I can't quite put it into words
yet,"_ _"still very simple, still very rough."_ Never promotional, never
hypes — even when showing off a working prototype.

**Engineering metaphors for non-engineering things.** Signature move. Examples:
- _"Technical Debt" → "Social Debt"_
- _"Reverse Engineering The Human Body"_ (the tagline itself)
- The AI _"runs alongside"_ rather than being _"used."_
- Specialist agents named **Research, Strategy, Action, Schedule.**

**Rhythm.** Short paragraphs. Frequent single-sentence paragraphs for weight.
Em-dash-rule separators (`---`) between ideas. Often lands on one quiet line:
_"It's subtle. It doesn't interrupt what I'm doing. But it's there when I
glance at it."_

**Casing.**
- Body copy: sentence case.
- Section indexes: `[01]`, `[02]`, `[03]` — bracketed, zero-padded.
- Labels: UPPERCASE with `tracking-widest` (`0.2em`), mono font.
- Article titles: sentence case, no clickbait capitalization.

**Numbers & units.** Always in monospace when in metadata. Specific, not
rounded — _"about $0.02/day,"_ _"16.3 tokens per second,"_ _"19 GB of model
weights."_ Concrete numbers carry credibility.

**Emoji.** Effectively none in the blog's own chrome. Source repos occasionally
use one as a flourish (🌸, ✅) — **do not** add to blog UI. Default to no emoji.

**YMYL disclaimer.** Any medicine-adjacent content carries a disclaimer —
this is a medical student's blog, not advice.

**Sample phrases to emulate**

> "I noticed something subtle."
> "It wasn't something I explicitly programmed as 'care' — but somehow,
>  that's what it felt like."
> "System Reboot // v2.0"
> "One brain for strategy. Another for execution. Working together."

**Avoid**: exclamation points, "excited to share," "game-changing," "unlock,"
"revolutionary," second-person imperative ("You need to…").

---

## Visual Foundations

### Color

Two palettes. **Light** is the default for marketing and article pages.
**Dark** is for hero sections, chrome (navbar, BGM player), and the "Command
Center"-style UI.

- **Background.** `#F8FAFC` (slate-50). Card fill `#FFFFFF`.
- **Foreground.** `#0F172A` (slate-900). Muted `#64748B`.
- **Accent (sparingly).** `#06B6D4` cyan — _only_ for interactive elements:
  links on hover, tech-line indicators, live-dot, selection color, icons in
  active state.
- **Gradient.** Cyan → `#1E3A8A` blue-900 (135°) — hero headlines and a few
  accent glows. Never on buttons or body backgrounds.
- **Subject accents** (MedMentor namespace): green chem, blue bio, yellow
  english, orange physics, purple BCI. Used as chip/tag fills, not full
  backgrounds.

### Type

Two families, both via Google Fonts:

- **Inter** — headings and body. Weights 300/400/500/600/700/800.
- **JetBrains Mono** — dates, read-time, tags, status, section indexes,
  eyebrow labels.

Hero headlines are `text-5xl` → `text-7xl`, `font-extrabold`, `tracking-tight`,
often cyan/blue gradient-clipped. Body prose is `text-lg` with `line-height:
1.8` for long-form readability (Japanese + English both render well here).

### Spacing

Tailwind's 4-based scale. Generous vertical rhythm on long-form pages (64–96px
between sections). Tight inside cards (12–24px).

### Backgrounds

1. **Fixed ambient video** behind the hero — lazy-loaded via
   `requestIdleCallback` so SEO/LCP isn't hurt. Dark overlay at 0.55 opacity.
2. **Schematic grid** — 40×40 px grid lines at ~4% opacity, overlaid on the
   hero. Blueprint energy, not decorative.
3. **Mouse-follow radial spotlight** — cyan, ~750 px, lerp 0.14, desktop only.
   Adds warmth to the dark hero without being a gimmick.
4. No photographic backgrounds elsewhere. Card surfaces are solid white (light)
   or translucent glass (dark).

### Imagery

- Article hero images: **sharp rectangles** — no border-radius on hero
  containers. Article cards _may_ round (rounded-2xl).
- Default state: `grayscale + opacity 80%`.
- Hover: `grayscale 0, opacity 100%, scale 1.05`.
- Color vibe: cool, technical, slightly clinical. Avoid warm filters,
  lifestyle stock, candid photography. Think mission-control screenshots,
  Xcode windows, terminal readouts, benchmark charts.

### Animation

- Every transition uses `cubic-bezier(0.16, 1, 0.3, 1)` (the "smooth
  out-expo"). Durations cluster at ~160 ms (hovers), ~280 ms (reveals),
  ~600 ms (scroll-in).
- Framer Motion primitives: `fadeUp`, `scaleIn`. Always subtle — nothing
  bounces, nothing spins.
- `CountUp` on intersection for any animated number.
- No parallax. No page-load splash beyond the video fading in.

### Hover & press

- **Links**: text color → cyan, border-bottom fades in (1 px solid cyan).
- **Cards**: rigid shadow deepens from `4px 4px 0` to `6px 6px 0`,
  sometimes gains a 2 px cyan tech-line on the leading edge.
- **Images**: see above — desaturated → full color.
- **Buttons**: primary darkens; secondary fills with `#ECFEFF` (cyan-50).
- **Press**: no scale shrink. Just a 40 ms opacity dip to ~0.85.

### Borders, shadows, radii

- **Borders.** Default `#E2E8F0` (slate-200), 1 px. On glass, a 1 px gradient
  border (`0.6 → 0.1 → 0.3` white at 135°).
- **Rigid shadow.** Signature: `4px 4px 0 0 rgba(15,23,42,0.05)`. No blur.
  This is the clinical-brutalism fingerprint.
- **Soft shadow** used only for elevated overlays (chatbot, BGM player):
  `0 8px 30px -12px rgba(15,23,42,0.12)`.
- **Radii.** 16 px (`rounded-2xl`) is the default for cards. 0 px for hero
  images. 999 px for pills/chips. No radii between 4 and 16 in general use.

### Transparency & blur

- Reserved for **floating chrome** on dark surfaces: navbar
  (`bg-black/40 backdrop-blur-xl`), BGM player, Samantha Lite chatbot,
  Command Center panels. `backdrop-blur-xl` = ~24 px blur.
- Never on cards on light pages — cards are solid white with a rigid shadow.

### Layout rules

- **Fixed navbar** at 64 px, `h-16`.
- All pages top-pad `pt-24` (96 px) to clear the navbar.
- **Homepage max-width**: 1280 px (`max-w-7xl`). Card grid: 1 / 2 / 3 cols at
  mobile / md / lg.
- **Article max-width**: 768 px (`max-w-3xl`). Prose `line-height: 1.8`.
- **BGM player & chatbot**: fixed bottom-right, stacked.
- Hero schematic grid is contained to the top viewport — doesn't bleed into
  the content below.

### Signature recurring elements

- `YB` monogram — dark block, white mono text, ~32 px in navbar.
- `"System Reboot // v2.0"` — mono eyebrow over the hero title.
- `[01] [02] [03]` — mono bracketed section indexes.
- **Live dot**: 8 px green with a pulsing halo, next to "Online" / "Writing".
- `"Ambient Vibe"` — BGM label, mono, uppercase.
- **Logbook**: how the article list is named. _"Logbook"_, not _"Articles"_.

---

## Iconography

**Primary set.** The codebase ships no custom icon system. Use **Lucide**
(1 px stroke, 24 px viewport) — it matches the technical, linear aesthetic of
the rest of the system and composes cleanly with Inter. In components, pull
it via CDN with `<script src="https://unpkg.com/lucide@latest"></script>` or
inline single SVGs from lucide.dev.

**Not substituted — flag & confirm.** There is no existing icon choice in the
repo; Lucide is my choice and should be confirmed by the author. Heroicons
Outline would be the second-best match.

**Stroke.** 1.5 px line, rounded caps, rounded joins. Do not mix-and-match
fill styles; this system is linear-only.

**Sizing.** 16 px inline with body, 20 px in UI buttons, 24 px in hero/navbar.

**Emoji.** Avoid. If needed for a Japanese content moment, a single 🌸 is
acceptable — but not in UI chrome.

**Unicode as icons.** `·` (middle dot) separates metadata (`date · 6 min`).
`//` in eyebrow labels (`System Reboot // v2.0`). `—` em-dash for rhythm.
No other unicode decoration.

**Custom brand marks.**
- `assets/yb-monogram.svg` — dark square, white "YB" mono text (navbar).
- `assets/yb-monogram-inverse.svg` — light, for dark backgrounds.

---

## Font substitution note

**Inter** and **JetBrains Mono** load from Google Fonts. Both are open-source
and exact matches to the spec — no substitution required. If offline use is
needed, drop the TTFs under `fonts/` and update `colors_and_type.css` to use
`@font-face` from that folder.

---

## How to use

1. Link `colors_and_type.css` as the first stylesheet.
2. Put `.yb` on `<body>` to pick up the defaults.
3. Compose with the utility classes (`.yb-card`, `.yb-glass`, `.yb-eyebrow`,
   `.yb-meta`, `.yb-techline`, `.yb-grid-bg`, `.yb-dot-live`) — or consume the
   JSX components in `ui_kits/yuichi-blog/`.
4. For any new surface, ask: _is this interactive?_ → cyan allowed.
   _Is this content?_ → slate-900 on white, rigid shadow.
   _Is this floating chrome?_ → dark + backdrop-blur.
