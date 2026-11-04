# Asset visual references

Open these source pages to inspect the exact approved assets before Phase 1. The links are the canonical references used by the asset IDs in `asset-registry.csv`.

## Characters and animations

| Stable ID | What to inspect | Preview/source |
|---|---|---|
| `CHAR_QUATERNIUS_BASE` | Body styles, hairstyles, clothing separation, low-poly proportions, humanoid rig | [Universal Base Characters — Quaternius](https://quaternius.com/packs/universalbasecharacters.html) |
| `CHAR_QUATERNIUS_MODULAR_MEN` | Finished casual, hoodie, astronaut, and urban NPC models with embedded clips | [Ultimate Modular Men — Quaternius on Poly Pizza](https://poly.pizza/bundle/Ultimate-Modular-Men-Pack-ZiH8muWqwQ) |
| `ANIM_QUATERNIUS_CORE` | Retained legacy animation source from the original intake | [Universal Animation Library — Quaternius](https://quaternius.com/packs/universalanimationlibrary.html) |
| `ANIM_QUATERNIUS_ACTION` | Retained legacy animation source from the original intake | [Universal Animation Library 2 — Quaternius](https://quaternius.com/packs/universalanimationlibrary2.html) |

The player, Ram Sam, Rocket Elon, and male NPCs use finished clothed models from the same pack. Final original emblems, faces, and clothing refinements remain later polishing work.

## City environment

| Stable ID | What to inspect | Preview/source |
|---|---|---|
| `ENV_QUATERNIUS_DOWNTOWN` | Retained legacy city source; no active map placements | [Downtown City MegaKit — Quaternius](https://quaternius.com/packs/downtowncitymegakit.html) |
| `ENV_KENNEY_COMMERCIAL` | Polygon commercial buildings and skyline | [City Kit Commercial — Kenney](https://kenney.nl/assets/city-kit-commercial) |
| `ENV_KENNEY_ROADS` | Matching roads, paving, street lamps, and crossing | [City Kit Roads — Kenney](https://kenney.nl/assets/city-kit-roads) |
| `ENV_KENNEY_NATURE` | Matching low-poly trees and bushes | [Nature Kit — Kenney](https://kenney.nl/assets/nature-kit) |

The reference image is a color-and-composition target, not a promise that the unmodified packs look identical. Phase 3 establishes the playable Kenney map; Phase 10 must finish its landmark presentation, public-space detail, palette, and lighting before the MVP is complete.

## Gameplay props

| Stable ID | Exact model | Preview/source |
|---|---|---|
| `PROP_POLYPIZZA_BAT` | Baseball Bat by CreativeTrio | [View interactive model — Poly Pizza](https://poly.pizza/m/i2JCd3w8gh) |
| `PROP_POLYPIZZA_RAM` | RAM by iPoly3D | [View interactive model — Poly Pizza](https://poly.pizza/m/obBMPOGYvy) |
| `PROP_POLYPIZZA_ROCKET` | Rocket by hat_my_guy | [View interactive model — Poly Pizza](https://poly.pizza/m/9awwTQWYux) |

The portal is not a downloaded model. `FX_PORTAL_ORIGINAL` is created in code with a glowing ring, particles, distortion, and layered digital effects.

## Interface and controls

| Stable ID | What to inspect | Preview/source |
|---|---|---|
| `UI_KENNEY_INPUT_PROMPTS` | Keyboard, mouse, touch, and controller prompt glyphs | [Input Prompts — Kenney](https://kenney.nl/assets/input-prompts) |
| `UI_KENNEY_UI_PACK` | Buttons, panels, meters, sliders, and interface building blocks | [UI Pack — Kenney](https://kenney.nl/assets/ui-pack) |

## Sound and music

| Stable ID | What to preview | Preview/source |
|---|---|---|
| `SFX_KENNEY_IMPACTS` | Cartoon impacts, bat hits, collisions, and landing layers | [Impact Sounds — Kenney](https://kenney.nl/assets/impact-sounds) |
| `SFX_KENNEY_INTERFACE` | Menu, notification, button, and settings feedback | [Interface Sounds — Kenney](https://kenney.nl/assets/interface-sounds) |
| `MUSIC_OGA_ACTION5` | Five loopable action chiptunes used across exploration, chase, assist, and crisis states | [5 Chiptunes (Action) — OpenGameArt](https://opengameart.org/content/5-chiptunes-action) |

## Project-owned visual references

- `docs/references/target-gameplay-look.png` — target mood, camera, color, density, and comedic chase composition.
- `docs/references/ramai-emblem-concept.png` — concept direction for a new RAM-module spiral-flower emblem.

## Review rule

If you dislike a locked asset after viewing its page, change the decision now and update the catalogue, registry, decision log, and affected phase task together. Once Phase 1 starts, Codex must use the locked IDs and cannot silently choose something else.
