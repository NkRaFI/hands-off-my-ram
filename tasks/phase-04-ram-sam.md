# Phase 4 — Ram Sam and opening theft

## Objective

Implement the opening encounter and a reliable basic chase target.

## Included

- Clothed Ram Sam from `CHAR_QUATERNIUS_MODULAR_MEN` (`character.sam`) with its embedded idle/run/interact clips
- Replace the visible Phase 2 base player with `character.player` from the same audited pack
- `FX_PORTAL_ORIGINAL` entrance portal effect
- `PROP_POLYPIZZA_RAM` player prop and theft event
- Basic Ram Sam running/navigation
- Direction indicator
- Explicit Ram Sam state machine and transition tests

## Excluded

- Bat combat and vulnerability
- NPC targeting
- Rocket assistance
- Final dialogue audio or face

## Acceptance criteria

- Opening sequence completes reliably.
- Ram Sam steals the RAM and enters a reachable chase state.
- State transitions cannot leave Ram Sam missing or immobile.
- The player always has a readable direction cue.
- The player and Ram Sam use the verified clothed models; the RAM prop changes carrier at theft.
- The visible RAM stays attached to the current carrier's animated hand during idle, theft, and running.

## Manual test

1. Start the chase and confirm the clothed male player holds the RAM in his hand while Ram Sam appears through the portal.
2. Confirm Ram Sam approaches, steals the RAM, and begins running while the player gains movement control. The RAM should follow Ram Sam's hand as his arm moves.
3. Follow Ram Sam around several city roads. Confirm he remains visible and does not cross building footprints.
4. Confirm the direction cue points toward Ram Sam as the player turns and moves.
5. Pause and resume during the chase, resize to a narrow viewport, and check the browser console for errors.
