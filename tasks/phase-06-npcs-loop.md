# Phase 6 — NPCs and endless loop

## Objective

Implement the complete endless theft/chase/recovery loop with coded NPCs.

## Included

- NPC archetypes built only from `CHAR_QUATERNIUS_BASE` variants
- Wander, alarm, flee, robbed, safe, react states
- Ram Sam target selection and theft
- Subtitled placeholder punchlines
- Safe portal destination and target validation
- Recovery from invalid/stuck states
- Extended-loop simulation tests

## Excluded

- Runtime generative AI
- Final voices and faces
- Rocket assistance
- Final balancing

## Acceptance criteria

- The loop repeats indefinitely without a fixed timer.
- NPCs recover to valid states after robbery or rescue.
- Ram Sam never targets an unreachable NPC.
- Dialogue selection avoids immediate repetition.
- A sustained manual session completes without broken states.
