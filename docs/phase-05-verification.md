# Phase 5 verification

Date: 2026-11-05

Phase 5 adds the approved bat model and embedded player swing animation, deterministic assisted hit detection, Ram Sam's hit reaction, a variable stun window, a visible RAM drop, automatic nearby collection, a recovery counter, and a telegraphed portal escape and return. No new assets or later-phase NPC, rocket, upgrade, or audio systems were added.

## Checks

- `pnpm test -- src/game/ram-sam/combat.test.ts src/game/ram-sam/encounter.test.ts`: passed. Combat tests cover hit range, facing, one-time collection, variable stun duration, safe portal selection, and 20 repeat cycles.
- `pnpm test`: 5 files and 13 tests passed.
- `pnpm typecheck`, `pnpm lint`, and `pnpm build`: passed. Vite reports the existing large main bundle warning; the production build succeeds.
- `pnpm smoke` on the development server and `SMOKE_URL=http://127.0.0.1:4173/ pnpm smoke` on the production preview: passed opening theft, chase, movement, collision, pause and resume, resize, bat hit, RAM recovery, escape and return, mouse swing, asset inspection, and browser console and network checks.
- A longer 1280×800 Chrome run completed two separate hit and pickup cycles. The recovery count reached 2, and the narrow 390×844 view's **Swing bat** button responded. No browser console errors were observed.
- Pausing during Ram Sam's stunned state held that state for 3.4 seconds; after resuming, the escape warning followed normally.
- A screenshot of the first hit was inspected: the bat follows the player's hand, Ram Sam shows stars, and the dropped RAM has a visible pickup ring and label.

## Limits

The browser checks used headless Chrome with software WebGL rendering. Phase 5 has not been measured on a physical phone. Final sound effects and additional NPC targets remain in their documented later phases.
