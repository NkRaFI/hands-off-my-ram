# Approved asset catalogue

Asset discovery is complete for the gameplay MVP. This is an approved manifest, not a list of suggestions. Phase 1 downloads, verifies, normalizes, and registers the assets in one batch. Later phases reference the stable IDs below and must not search for or silently substitute another asset.

## Locked MVP assets

| Stable ID | Approved source | Exact role | Licence |
|---|---|---|---|
| `CHAR_QUATERNIUS_BASE` | [Quaternius Universal Base Characters](https://quaternius.com/packs/universalbasecharacters.html) | Retained Phase 1 legacy runtime files; no longer assigned to active characters | CC0 |
| `CHAR_QUATERNIUS_MODULAR_MEN` | [Quaternius Ultimate Modular Men via Poly Pizza](https://poly.pizza/bundle/Ultimate-Modular-Men-Pack-ZiH8muWqwQ) | Clothed male player, Ram Sam, Rocket Elon, and four male NPC variants | CC0 |
| `ANIM_QUATERNIUS_CORE` | [Quaternius Universal Animation Library](https://quaternius.com/packs/universalanimationlibrary.html) | Retained Phase 1 legacy runtime clips; active characters use embedded clips | CC0 |
| `ANIM_QUATERNIUS_ACTION` | [Quaternius Universal Animation Library 2](https://quaternius.com/packs/universalanimationlibrary2.html) | Retained Phase 1 legacy runtime clips; active characters use embedded clips | CC0 |
| `ENV_QUATERNIUS_DOWNTOWN` | [Quaternius Downtown City MegaKit](https://quaternius.com/packs/downtowncitymegakit.html) | Buildings, urban props, and primary city kit | CC0 |
| `PROP_POLYPIZZA_BAT` | [Baseball Bat by CreativeTrio](https://poly.pizza/m/i2JCd3w8gh) | Player weapon | CC0 |
| `PROP_POLYPIZZA_RAM` | [RAM by iPoly3D](https://poly.pizza/m/obBMPOGYvy) | Stolen, carried, dropped, and collected RAM stick | CC0 |
| `PROP_POLYPIZZA_ROCKET` | [Rocket by hat_my_guy](https://poly.pizza/m/9awwTQWYux) | Space Assist arrival/portal landmark | CC0 |
| `UI_KENNEY_INPUT_PROMPTS` | [Kenney Input Prompts](https://kenney.nl/assets/input-prompts) | Keyboard, mouse, touch, and controller glyphs | CC0 |
| `UI_KENNEY_UI_PACK` | [Kenney UI Pack](https://kenney.nl/assets/ui-pack) | Temporary panels, meters, buttons, and settings controls | CC0 |
| `SFX_KENNEY_IMPACTS` | [Kenney Impact Sounds](https://kenney.nl/assets/impact-sounds) | Bat impacts, landing, and cartoon collision layers | CC0 |
| `SFX_KENNEY_INTERFACE` | [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) | Menu, meter, notification, and settings feedback | CC0 |
| `MUSIC_OGA_ACTION5` | [5 Chiptunes (Action) by SubspaceAudio/Juhani Junkala](https://opengameart.org/content/5-chiptunes-action) | Approved five-track loopable music pool; Phase 9 assigns tracks to gameplay states | CC0 |

Quaternius and Kenney publish the selected packs as CC0. The individual Poly Pizza and OpenGameArt pages identify the selected items as CC0. The archives and internal filenames were audited before implementation; see `asset-audit-report.md` and `runtime-asset-manifest.csv`.

## Original project assets (not third-party downloads)

| Stable ID | Creation rule | Use phase |
|---|---|---:|
| `FX_PORTAL_ORIGINAL` | Build in code from geometry, emissive material, particles, and approved digital SFX; no downloaded portal model | 4 |
| `BRAND_RAMAI_ORIGINAL` | Derive a simplified original RAM-module spiral-flower from the concept reference; do not use official logos | 7 initially, polish in 12 |
| `VOICE_RAM_SAM_ORIGINAL` | Generate a clearly fictional, non-imitative energetic tech-villain performance from the approved script | 9 |
| `VOICE_ROCKET_ELON_ORIGINAL` | Generate a clearly fictional, non-imitative dry space-helper performance from the approved script | 9 |
| `VOICE_NPCS_ORIGINAL` | Generate a small varied ensemble with no real-person imitation | 9 |

The voice generation vendor is an execution tool, not a creative asset choice. Phase 9 may use an available provider only if its current commercial terms are verified and the voice is not marketed or prompted as an imitation of a real person. The exported local files and their generation notes become the project assets.

## Role assignments

- Player: `character.player`, the pack's clothed Casual Character.
- Ram Sam: `character.sam`, the pack's Hoodie Character; add `BRAND_RAMAI_ORIGINAL` when branding is introduced.
- Rocket Elon: `character.rocket`, the pack's Astronaut, used primarily in the assistance panel.
- Male NPCs: `character.npc.worker`, `character.npc.business`, `character.npc.punk`, and `character.npc.swat`. Female NPCs require a later explicit compatible asset decision; the old female superhero base remains a legacy file, not an active NPC assignment.
- No phase may replace these with Mixamo, KayKit, another Poly Pizza model, or an AI-generated model without an explicit decision-log amendment approved by the user.

## Phase 1 intake rules

1. Acquire the audited archives/files whose checksums are recorded in `asset-audit-report.md`.
2. Capture the source URL, creator, stated licence, download date, archive filename, and SHA-256.
3. Preserve licence/readme evidence under `docs/licenses/<asset-id>/`.
4. Extract only rows listed in `runtime-asset-manifest.csv`, then convert them as specified; do not ship entire source archives.
5. Add normalized files under `public/assets/` using stable-ID-based paths.
6. Produce `src/game/assets/asset-manifest.ts`; later code imports IDs from it instead of hard-coded URLs.
7. If a link, licence, or archive is unavailable or materially different, stop and report the specific asset. Do not choose a substitute.

## Runtime storage

```text
public/assets/
├── models/
├── textures/
├── audio/
└── ui/
```

Use lowercase kebab-case filenames, avoid duplicate runtime formats, and do not redistribute the source collection as a standalone asset pack.
