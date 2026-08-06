# Website and Download Page Specification

## Objective

Create a fast public site that explains devcanon, helps users choose an installation method, and makes release history easy to understand.

## Information Architecture

```text
Home
├── Product overview
├── Handbook explorer
├── Documentation
├── Downloads / Install
└── Changelog timeline
```

## Download Page

The page must provide three equally clear paths:

1. Global CLI: `npm install --global devcanon`
2. One-off use: `npx devcanon init`
3. Project-pinned dependency: `npm install --save-dev devcanon`

Every release entry includes version, release date, compatibility, categorized changes, migration notes, and a link to the npm version. The persistent registry CTA links to [devcanon on npm](https://www.npmjs.com/package/devcanon).

## Release Data

`CHANGELOG.md` is the human source of truth. GitHub releases should mirror it. The future site should transform release headings into a vertical timeline at build time; it must not maintain an unrelated second changelog.

## Visual Direction

- Dark ink canvas with cyan/blue signal accents from `docs/assets/devcanon-banner.svg`.
- Editorial typography, crisp grids, restrained terminal motifs, and generous whitespace.
- One primary CTA per section; no gratuitous glass, gradients, or motion.
- Meet WCAG 2.2 AA and honor reduced motion.

## Required Pages and Components

- Home hero, benefit narrative, standards inventory, terminal demo, safety model, and CTA.
- Documentation navigation with searchable command reference.
- Download cards, copy buttons, OS-neutral terminal snippets, npm registry link.
- Release timeline sourced from `CHANGELOG.md`.
- Header, footer, version badge, responsive navigation, SEO and social metadata.

## Technical Direction

Use a statically generated site unless authenticated features create a demonstrated need. Keep docs in Markdown, validate internal links, optimize SVG/media, and track only privacy-respecting product events. Apply `.ai/design.md`, `.ai/accessibility.md`, `.ai/responsiveness.md`, and `.ai/prompts/landing-page.md` before implementation.

## Completion Checklist

- [ ] Installation methods are accurate and copyable.
- [ ] Every release links to npm and its GitHub release.
- [ ] Changelog has one maintained source of truth.
- [ ] Documentation search, mobile navigation, keyboard use, and contrast work.
- [ ] Performance, metadata, analytics consent, and link validation pass.
