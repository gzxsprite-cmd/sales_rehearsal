# 06 Codex Execution Task

## Your role

You are not building a production application.

You are building a Pages-first business demo for Sales Rehearsal AI.

## First action

Before coding, read all root-level markdown files.

Required reading:
- README.md
- 00_PROJECT_POSITIONING.md
- 01_V0.1_SCOPE_AND_GOAL.md
- 02_USER_FLOW.md
- 03_PAGE_AND_INTERACTION_SPEC.md
- 04_AI_BEHAVIOR_AND_REVIEW_LOGIC.md
- 05_PAGES_DEMO_RULES.md

## Working boundary

You must only generate demo implementation files inside:
- `docs/`

Do not rewrite or replace the root-level markdown files.

## Deliverable

Create a GitHub Pages-ready static demo in `docs/` that supports this flow:

1. Home
2. Setup
3. Chat
4. Review
5. Retry / Restart

## Implementation requirements

### Demo format
- static HTML
- static CSS
- vanilla JavaScript
- no build step
- no package manager
- no framework dependency

### Data
Use mock data.

Suggested minimal mock content:
- 2–3 customers
- 1 product: VMS
- 1 main role: Project Director
- 1 scenario: First Introduction

### AI simulation
Implement mock logic for:
- customer opening
- customer reply
- review generation
- knowledge coaching

These can be deterministic or lightly simulated, but they must reflect the business concept.

## Quality expectation

The result should:
- open directly in browser
- work when published from GitHub Pages `/docs`
- look clean enough for business stakeholders
- make the product concept understandable quickly

## Suggested docs output structure

Inside `docs/`, create files such as:
- `index.html`
- `styles.css`
- `app.js`
- `data.js`
- `mock-ai.js`
- `.nojekyll`

You may split JS into additional files if needed, but keep the structure simple.

## Execution order

1. create page skeleton
2. implement setup step
3. implement chat step
4. implement review step
5. connect retry flow
6. polish visual presentation
7. ensure direct Pages compatibility

## Final self-check

Before finishing, verify:
- all demo files are inside `docs/`
- opening `docs/index.html` directly works
- the main flow is complete
- no build step is required
- no framework dependency is required
