# Phase 2 — Player movement and camera

## Objective

Add a placeholder player that can traverse a bounded test area with a comfortable third-person camera.

## Included

- Player variant from `CHAR_QUATERNIUS_BASE`
- Idle/run clips from `ANIM_QUATERNIUS_CORE`
- Keyboard movement
- Third-person follow camera
- Ground/boundary collisions
- Basic idle/run state
- Deterministic movement tests where practical

## Excluded

- Final character art
- Bat attacks
- Ram Sam
- City, NPCs, portals, audio, progression

## Acceptance criteria

- Movement is responsive and frame-rate independent.
- The player cannot leave the test boundary or fall through the ground.
- The camera follows without severe jitter or clipping.
- Resize and pause/resume do not break controls.
- Phase checks pass and no later gameplay systems are introduced.
