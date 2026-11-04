# Phase 10 — Complete MVP and deployment readiness

## Objective

Finish a stable, deployable browser-local game with a complete, visually cohesive city and clothed open characters.

## Included

- Versioned local saves and safe migrations
- Finish the Kenney polygon city using the approved Commercial, Roads, and Nature assets: distinct readable landmarks, storefront and public-space detail, coherent color, and bright daylight lighting
- Remove visible placeholder city treatment from the active map while preserving chase routes, collision, and portal access
- Full regression testing
- Loading and failure fallbacks
- Baseline performance profiling
- Static production build and preview
- Release notes and known limitations
- Verification of all asset and audio records

## Excluded

- Final custom faces, emblems, and clothing refinements
- Optional extra city districts or environmental variants beyond the complete MVP map
- Blender-dependent modifications
- Multiplayer, backend, accounts, global leaderboard

## Acceptance criteria

- A clean checkout installs, tests, builds, and previews successfully.
- Core endless loop, assistance, progression, audio, and saves work together.
- At gameplay camera distance, all five landmarks and the plaza are visually distinct and the city has the vibrant low-poly direction of `docs/references/target-gameplay-look.png` without requiring a literal recreation.
- Roads, sidewalks, greenery, signs, and lighting look finished across the playable map; no active area still reads as a placeholder.
- Every major destination retains two clear approaches, building collision and portal zones work, and city presentation meets the documented desktop and mobile performance targets.
- No known blocker prevents a public static deployment.
- Licence/attribution records are complete.
- Remaining work is explicitly classified as later polish, not hidden MVP debt.

## Manual city review

1. Walk both approaches to each of the five landmarks and the central plaza at the gameplay camera distance. Confirm each destination is recognizable and the routes are unobstructed.
2. Review the city in desktop and narrow mobile viewports during daylight gameplay, including the chase and portal effects. Confirm the color, landmark signs, street detail, and lighting are cohesive and readable.
3. Check building walls, crossings, lamps, greenery, and portal candidate zones for clipping or blocked movement. Check the browser console and network responses.
4. Record desktop and physical mobile performance against the 60 FPS desktop and usable 30 FPS mobile targets, then resolve material regressions before declaring the MVP complete.
