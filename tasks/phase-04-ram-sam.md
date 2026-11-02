# Phase 4 — Ram Sam and opening theft

## Objective

Implement the opening encounter and a reliable basic chase target.

## Included

- Ram Sam variant from `CHAR_QUATERNIUS_BASE` with `ANIM_QUATERNIUS_CORE`
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
