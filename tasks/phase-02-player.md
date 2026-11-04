# Phase 2 — Player movement and camera

## Objective

Add a placeholder player that can traverse a bounded test area with a comfortable third-person camera.

## Included

- Male player from `CHAR_QUATERNIUS_MODULAR_MEN` (`character.player`); this supersedes the original base-model assignment
- Embedded idle/run clips from the selected model
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

## Manual test

1. Start the development server, begin the movement test, and confirm the approved character appears and idles on the ground.
2. Hold WASD and arrow keys, including diagonal input, and confirm the jog animation and follow camera respond smoothly.
3. Move against each boundary and confirm the player stays inside and on the ground.
4. Pause with Escape or the button, release the keys, resume, and confirm movement works without a stuck direction.
5. Resize from desktop to a narrow mobile width and continue keyboard movement. Check that the camera and canvas remain usable.
6. Check the browser console for errors and repeat the scene check in production preview.
