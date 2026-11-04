# Phase 3 and 4 visual correction

Date: 2026-11-05

The Kenney road tile footprint was scaled tenfold in all axes, making its 0.02-unit thickness a visible 0.2-unit step over the physics floor. Road and paving placements now scale only horizontally, keeping the visible surface close to the physics floor. Nature Kit trees and bushes have a 0.05-unit source offset below their roots; their scene positions now compensate for that offset. The bush uses a nonmetallic, double-sided material so its leaves do not show dark underside triangles.

The RAM prop previously sat at a fixed character-local offset. It now attaches to the animated `WristR` bone on the approved player and Ram Sam models, so it follows the hand during idle and run animations and switches carrier during the theft.

## Verification

- `pnpm test`: 4 files, 9 tests passed.
- `pnpm typecheck`, `pnpm lint`, and `pnpm build`: passed.
- `pnpm smoke` on the development server and `SMOKE_URL=http://127.0.0.1:4173/ pnpm smoke` on the production preview: passed. Both checks included chase movement, collision, pause and resume, asset loading, and browser console and network errors.
- Desktop screenshots at 1280×800 were inspected before and after the theft: the player's red shoes remain visible above the road, the bushes are green, and the RAM appears at the current carrier's hand.

The Chrome visual checks used software WebGL rendering. This correction has not been checked on a physical phone.
