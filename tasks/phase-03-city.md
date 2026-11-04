# Phase 3 — Placeholder city

## Objective

Build a compact, navigable low-poly chase map using approved open assets.

## Included

- City construction from the exact `city.*` rows of `runtime-asset-manifest.csv`; no new asset download
- Roads, sidewalks, buildings, landmarks, props, boundaries
- Collision-safe chase routes and portal candidate zones
- Basic lighting aligned with the visual guide

## Excluded

- Custom landmark modelling
- Final lighting polish
- Ram Sam, NPC behaviour, combat, audio

## Acceptance criteria

- All major areas are reachable by at least two practical routes.
- The player cannot walk through primary buildings.
- Every included asset has verified licence metadata.
- The map remains readable and performant at the gameplay camera distance.

## Manual test

1. Start the local app and select **Explore city**. Confirm the player, roads, sidewalks, named landmarks, and daylight scene are visible at the gameplay camera distance.
2. Walk from the central junction toward the RamAI Data Centre, then into its east wall. Confirm movement stops at the building and the camera keeps the player visible.
3. Follow the streets around the central blocks. Confirm the two road approaches to each landmark remain open and the planter and bollard props do not block a route.
4. Resize the browser to a narrow mobile viewport. Confirm the canvas fits and movement still works.
5. Check the browser console and network responses for errors. Run the approved asset inspection at `?inspect=1`.

The city is a placeholder. On 2026-11-03, production preview in headless Chrome with Apple M5 Metal rendering held 60 FPS during a three-second stationary scene sample at 1280×800 and 390×844 with 2× pixel density. A separate SwiftShader software-rendered sample ran at 13 FPS and is not representative of GPU rendering. Sustained chase performance on a physical phone remains unmeasured.
