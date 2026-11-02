# Hands Off My RAM!

> The cloud is coming for your memory.

An endless, browser-local, third-person 3D comedy chase game. Ram Sam arrives through a portal, steals RAM from the player and NPCs, and runs. The player chases him with a cartoon bat, recovers dropped RAM, protects NPCs, and periodically receives rocket-powered portal assistance.

## Current status

**Pre-production documentation complete. Phase 1 has not started.**

This repository intentionally begins with specifications, acceptance criteria, visual references, a locked asset manifest, licence rules, and agent instructions. Asset discovery is complete; Phase 1 downloads and verifies the approved set in one batch. Implement one phase at a time and do not begin the next phase until the current phase is tested and accepted.

## Product principles

- Easy to learn and intentionally generous; comedy and spectacle are more important than difficulty.
- Endless play rather than a fixed match timer.
- Browser-local gameplay with no backend required for the MVP.
- Programmed NPC state machines; no runtime generative AI.
- Low-poly, vibrant, readable visuals optimized for desktop and mobile browsers.
- Cartoon slapstick only: no blood, gore, or realistic injury.
- Fictional AI voices; no cloning or imitation of real voices.
- Original parody branding; never imply endorsement by real companies or people.

## Canonical documents

1. [Game design document](docs/game-design-document.md)
2. [Technical architecture](docs/technical-architecture.md)
3. [Visual style guide](docs/visual-style-guide.md)
4. [Asset catalogue and licensing](docs/asset-catalog.md)
5. [Asset visual references](docs/asset-visual-references.md)
6. [Asset lock audit](docs/asset-audit-report.md)
7. [Exact runtime asset manifest](docs/runtime-asset-manifest.csv)
8. [Audio and dialogue guide](docs/audio-dialogue-guide.md)
9. [Roadmap](docs/roadmap.md)
10. [Quality and testing](docs/quality-and-testing.md)
11. [Branding, parody, and release review](docs/branding-and-release-review.md)
12. [Decision log](docs/decision-log.md)
13. [Phase tasks](tasks/README.md)

## Working rule

Read `AGENTS.md` before making changes. Phase work must stay within the selected task file's scope.

## Technology direction

- React + TypeScript + Vite
- Three.js through React Three Fiber
- `@react-three/drei` for common helpers
- Rapier through `@react-three/rapier` for physics and collisions
- Zustand for small, explicit gameplay state
- Vitest + React Testing Library for deterministic logic and UI tests
- Playwright for browser smoke tests when introduced by a phase
- pnpm for package management

The exact dependency versions are selected and locked during Phase 1.

## Licence

No project source-code licence has been selected yet. Do not add one without the repository owner's explicit decision. Every third-party asset must retain its own licence record in `docs/asset-registry.csv`.
