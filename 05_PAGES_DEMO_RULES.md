# 05 Pages Demo Rules

## Primary objective

This repo must produce a GitHub Pages demo first.

That means the final output must be:
- directly viewable in browser
- directly publishable from GitHub Pages
- stable enough for stakeholder demo

## Technical direction for v0.1

Use:
- static HTML
- static CSS
- vanilla JavaScript

Do not use for v0.1:
- Vite
- npm build
- GitHub Actions deployment
- React
- backend
- package manager dependency chain
- anything that blocks direct Pages publishing

## Output directory

All demo files must be generated inside:
- `docs/`

The root markdown files are project guidance files and must not be modified by Codex unless explicitly requested.

## Pages publishing mode

This repo is intended to use:
- Deploy from a branch
- branch: main
- folder: /docs

## Required publishing compatibility

The demo in `docs/` must work as a direct static site.

That means:
- no build step required
- no source compilation required
- no package installation required before publishing
- no framework runtime assumption

## Required files in docs

At minimum:
- `docs/index.html`
- `docs/styles.css`
- `docs/app.js`
- `docs/data.js`
- `docs/mock-ai.js`
- `docs/.nojekyll`

## Key rule

For this phase, direct demo availability is more important than engineering elegance.
