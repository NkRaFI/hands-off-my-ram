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

## Bat grip correction

The user reported that the bat floated behind the player's hand after the first Phase 5 pass. The bat's narrow handle is at the negative-X end of its source mesh; the earlier transform centered the mesh and translated the entire bat 0.3 metres from the wrist. The runtime transform now places a grip point 8 cm inside that handle end at the animated right wrist, then rotates the bat around the grip. No source asset was modified.

Close-up Chrome screenshots were inspected in idle, running, and four swing frames. The handle meets the hand in idle and running and stays with the hand through the swing. All 13 tests, typecheck, lint, build, and development and production smoke checks passed again, with no browser console or network errors.

### Follow-up grip and pose correction

The user then showed that the hand was still open and the bat appeared to hang from the wrist. The earlier correction placed the grip point near the wrist but did not provide a weapon-holding pose. The player now uses the approved `CharacterArmature|Idle_Sword` clip while idle with the bat. During running, the right-finger rotations from that clip are applied after the run animation; the approved `Sword_Slash` clip supplies the strike pose. The bat rests upright from the closed hand and rotates around the same grip point during the strike. No source model or animation file was altered.

Front and rear Chrome captures were inspected in idle, running, and four swing frames. The fist closes around the handle, the bat remains visible through the strike, and the browser console had no errors.

### Palm anchor correction

The user identified that the fixed wrist grip still left the handle beside the palm. The runtime attachment now calculates a grip point between the right middle-finger and thumb joints each frame, after the character animation updates, and positions the approved bat's handle there. A close front-view capture shows the shaft entering the closed palm and the handle end extending below the fist. The source mesh and animations remain unchanged.

Verification after this correction: front and rear Chrome captures were inspected in idle and running poses, plus a front swing frame. `pnpm test` passed 13 tests; `pnpm typecheck`, `pnpm lint`, and `pnpm build` passed. `pnpm smoke` passed on both the development server and production preview, including browser console and network checks. The build still reports its existing large-chunk size warning.
