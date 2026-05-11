# yuichi.blog — UI Kit

A hi-fi recreation of the yuichi.blog marketing/blog site. Not production code —
cosmetic React components wired into an interactive demo.

## What's here

| File | Purpose |
|---|---|
| `index.html` | Interactive demo. Click a card → article view. Click the "YB" logo → home. The floating "S" bubble opens the Samantha Lite chatbot; "Ambient Vibe" toggles the BGM button state. |
| `Navbar.jsx` | Fixed dark-glass navbar, `h-16`, backdrop-blur-xl. |
| `Hero.jsx` | Dark hero with schematic 40×40 grid, cyan mouse-follow spotlight, gradient-clipped headline, mono "System Reboot // v2.0" eyebrow, live-dot status. |
| `ArticleCard.jsx` | Card with grayscale→color image, rigid shadow, cyan tech-line on hover. Also exports `FilterPills`, `SearchBar`. |
| `Logbook.jsx` | Homepage list: eyebrow `[01] Logbook`, search, filter pills, responsive card grid. |
| `ArticleView.jsx` | Single-article page: mono meta, hero image (sharp corners), prose at 18px / line-height 1.8. |
| `FloatingChrome.jsx` | Bottom-right: "Ambient Vibe" BGM pill + "S" Samantha chatbot bubble. |
| `Footer.jsx` | Dark footer with YB monogram, column links, mono legal line. |

## Interactions worth trying

- **Home → Article → Home.** Click any card; use "← Back to Logbook" or the YB logo.
- **Search the logbook.** Type a term — the grid filters live.
- **Filter by tag.** Pills toggle; `All` clears. Empty state appears for unmatched filters.
- **Hover a card.** Shadow deepens, image colorizes and scales to 1.05, cyan tech-line draws in from the top, title goes cyan.
- **Move the mouse over the hero.** Cyan spotlight tracks with a soft lerp.
- **Open Samantha.** Click the `S` bubble bottom-right; dark glass panel drops in.
- **Toggle BGM.** Click "Ambient Vibe" — the play/pause glyph flips.

## What's intentionally not built

These are described in the brand but not meaningful in a static mock:
- Lazy-loaded fixed video background (a dark overlay stands in).
- CountUp animation on intersection.
- ReadMore accordion.
- Formspree integration inside Samantha.
- Framer Motion scroll reveals (we use CSS transitions only).
