# Hands Off My RAM!

> The cloud is coming for your memory.

An endless, browser-local, third-person 3D comedy chase game. Ram Sam arrives through a portal, steals RAM from the player and NPCs, and runs. The player chases him with a cartoon bat, recovers dropped RAM, protects NPCs, and periodically receives rocket-powered portal assistance.

## Current status

**Phase 5 chase combat implemented, with the approved Kenney city.** A clothed male player starts with RAM, Ram Sam steals it through a portal and runs, and the player can pursue, swing the bat, recover dropped RAM, and continue after Ram Sam's telegraphed portal return. NPCs and their theft loop remain Phase 6 work.

This repository includes specifications, acceptance criteria, visual references, a locked asset manifest, licence rules, and agent instructions. Phase 1 fetched and verified the approved set. Implement one phase at a time and do not begin the next phase until the current phase is tested and accepted.

## Play the opening chase

Use Node 22.22.2 (see `.nvmrc`) and pnpm 10.33.2. From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite, then select **Start chase**. Ram Sam steals the RAM after the opening portal sequence. Use WASD or arrow keys to pursue him, Space, a canvas click, or **Swing bat** to attack, and Escape or the on-screen button to pause and resume. Move into a dropped RAM stick to recover it before Ram Sam escapes. The camera follows the player and moves closer when a building blocks its view. Append `?inspect=1` to the URL to load and preview the approved runtime assets.

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm preview
```

`pnpm smoke` runs a Chrome browser check against a running development server on `127.0.0.1:5173`. It uses the Chrome installation at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` by default; set `CHROME_PATH` to another Chrome executable if needed. Set `SMOKE_URL` to check a production preview on another port. The runtime asset checksums are in `docs/runtime-asset-checksums.csv`; the source and licence records are in `docs/asset-registry.csv` and `docs/licenses/`.

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
