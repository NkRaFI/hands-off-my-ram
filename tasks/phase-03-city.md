# Phase 3 — Polygon city

## Objective

Build a compact, navigable low-poly chase map using approved open assets.

## Included

- City construction from the approved `city.kenney.*` rows of `runtime-asset-manifest.csv`
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
- Road and paving surfaces align with the character feet, and greenery renders above the surface without dark underside artifacts.

## Manual test

1. Start the local app and select **Start chase**. Confirm the clothed male player, Kenney roads, paving, buildings, trees, lamps, named landmarks, and daylight scene are visible at the gameplay camera distance. Check that shoes remain visible above the road and the small bushes appear green above the paving.
2. Walk from the central junction toward the RamAI Data Centre, then into its east wall. Confirm movement stops at the building and the camera keeps the player visible.
3. Follow the streets around the central blocks. Confirm the two road approaches to each landmark remain open and the lamps and greenery do not block a route.
4. Resize the browser to a narrow mobile viewport. Confirm the canvas fits and movement still works.
5. Check the browser console and network responses for errors. Run the approved asset inspection at `?inspect=1`.

The 2026-11-03 performance sample applied to the earlier Quaternius city and does not measure the Kenney replacement. Sustained chase performance on a physical phone remains unmeasured.

## 2026-11-04 map correction

The user selected Kenney City Kit Commercial, City Kit Roads, and Nature Kit for the active map. Their stable IDs, exact files, licences, checksums, and color-map PNG dependencies are recorded in the asset registry and runtime manifest. Earlier Quaternius city files remain as legacy intake assets. The road graph, landmark access pairs, building blockers, portal candidate zones, and Phase 4 chase behaviour are preserved. See `docs/phase-03-kenney-verification.md` for checks and limits.
