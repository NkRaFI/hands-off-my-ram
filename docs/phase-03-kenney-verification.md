# Phase 3 Kenney map correction verification

Date: 2026-11-04

The active city now uses Kenney City Kit Commercial buildings, City Kit Roads streets and paving, and Nature Kit trees and bushes. The three-by-three road graph, five landmark access pairs, and reserved portal zones are unchanged. The Quaternius Downtown files remain as legacy approved assets but are not rendered in the active map.

## Checks performed

- `pnpm test -- src/game/city/map.test.ts src/game/assets/asset-manifest.test.ts`: 4 files and 9 tests passed, including road connectivity and every runtime asset checksum.
- `pnpm typecheck`, `pnpm lint`, and `pnpm build`: passed.
- `pnpm smoke` against Chrome and the development server: passed opening theft, moving chase, forward movement, Kenney large-building wall collision, ground contact, pause and resume, direction cue, narrow viewport resize and movement, all approved runtime asset loads, and browser console and network checks.
- `SMOKE_URL=http://127.0.0.1:4173/ pnpm smoke` against the production preview: passed the same browser checks.
- Desktop screenshot inspected at 1280×800: the Kenney color maps, streets, crossing, commercial buildings, lamps, and greenery rendered. The external color-map URI issue found on the first browser pass was fixed, and the final browser pass had no console errors.

## Limits

The automated smoke test exercises one landmark wall and the start route. It does not manually walk every landmark approach. A physical phone and sustained GPU frame-rate sample for the Kenney map have not been measured. Final visual polish remains in its later phase.
