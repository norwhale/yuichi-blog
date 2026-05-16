---
name: yuichi-blog-design
description: Use this skill to generate well-branded interfaces and assets for yuichi.blog — a personal blog about AI, brain-computer interfaces, medicine, and life abroad, written in a reflective, technically precise voice. Design philosophy is "Clinical Brutalism meets Technical Elegance." Use this either for production work or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill first, then explore the other
available files — especially `colors_and_type.css`, `ui_kits/yuichi-blog/`,
and `reference/` for tone-of-voice samples.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.),
copy assets out of `assets/` and create static HTML files for the user to
view; link `colors_and_type.css` and put `.yb` on the body to pick up all
brand defaults. Prefer the utility classes and JSX components shipped with
the kit rather than hand-rolling new ones.

If working on production code, copy assets and read the rules in `README.md`
to become an expert in designing with this brand. Key rules to internalize:

- Cyan (`#06B6D4`) is used _sparingly_ — only on interactive state.
- Hero images are **sharp rectangles** (no border-radius).
- Rigid shadow `4px 4px 0 0 rgba(15,23,42,0.05)` is the signature card style.
- Mono font (JetBrains Mono) is reserved for metadata, section indexes,
  eyebrow labels, and numbers. Body is Inter.
- Tone is first-person, reflective, engineering-metaphor-fluent. Never
  promotional.

If the user invokes this skill without any other guidance, ask them what
they want to build or design, ask some questions (audience, surface, tone,
how many variations), and act as an expert designer who outputs HTML
artifacts _or_ production code, depending on the need.
