# Phase 4 verification — 2026-11-04

## Automated checks

- `pnpm test`: 4 files, 9 tests passed, including deterministic opening transitions and connected road-route checks.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed. Vite reported its existing large JavaScript chunk advisory; the build completed.
- `SMOKE_URL=http://127.0.0.1:4173/ pnpm smoke`: passed against the production preview. It checked the opening theft, moving Ram Sam, player movement and building collision, direction cue response, pause/resume, narrow viewport, all 66 manifest IDs, and browser console errors.
- `git diff --check`: passed.

## Manual browser review

- The clothed male player appears with the RAM prop at the opening. Ram Sam appears through the purple/cyan portal, approaches, performs the embedded interact gesture, receives the RAM prop, and starts running. The player then gains movement control.
- The production preview was followed along the north and west roads. After eight seconds north, the player was at `(0.0, -35.3)` and Ram Sam at `(0.0, -32.3)`; after eight seconds west, the player was at `(-35.5, -35.6)` and Ram Sam at `(-22.1, -40.0)`. The actor remained on connected roads and no browser-console errors appeared.
- The direction cue changed from north to east as the player moved west. The existing smoke check verified pause/resume and a 390-pixel-wide viewport.

## Limits

- Bat combat, catching Ram Sam, and RAM recovery belong to Phase 5.
- The prop uses a simple hand-side placement rather than a final bone attachment; the original character emblems and final visual polish remain later work.
- The existing Phase 3 city kit and layout remain in use. The long route review exposed plain road-edge filler surfaces that need environment polish.
- A physical mobile device and representative hardware frame-rate measurement were not available in this check.
