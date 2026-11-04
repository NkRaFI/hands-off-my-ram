# Decision log

## Confirmed decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-11-03 | Title: `Hands Off My RAM!` | Clear, memorable, and independent of a real person's name |
| 2026-11-03 | Repository: `hands-off-my-ram` | Stable project identifier |
| 2026-11-03 | Antagonist: `Ram Sam` | Rhyming fictional caricature name |
| 2026-11-03 | Fictional company: `RamAI` | Communicates the parody while creating an original brand |
| 2026-11-03 | Endless play | The player should continue as long as desired; no fixed match timer |
| 2026-11-03 | Easy default balancing | Players should experience the full joke and perks early |
| 2026-11-03 | Browser-local MVP | Rendering, gameplay, NPCs, audio, and saves run locally |
| 2026-11-03 | Coded NPCs | State machines are predictable, testable, cheap, and offline |
| 2026-11-03 | Rocket assistance | Earned frequently and introduced early |
| 2026-11-03 | Audio before final faces | Facial timing can be built around approved clips |
| 2026-11-03 | Existing assets through MVP | Prove the complete game before expensive customization |
| 2026-11-03 | Blender prerequisite gate | Codex must pause and request manual installation before dependent polishing |
| 2026-11-03 | No official third-party logos | Original parody marks reduce confusion and create project identity |
| 2026-11-03 | Asset discovery completed before implementation | Exact sources and stable IDs prevent repeated decisions and unsupported substitutions |
| 2026-11-03 | All approved assets are fetched in Phase 1 | One intake creates licence evidence, checksums, normalized paths, and a manifest for later phases |
| 2026-11-03 | Pre-implementation asset audit completed | Exact internal filenames, checksums, source sizes, Cloudflare limits, and payload budgets are known before scaffolding |
| 2026-11-03 | Use only free verified Quaternius character bodies | The Standard archive contains two bodies; paid/source-only variants are not assumed |
| 2026-11-03 | Downtown pack supplies streets | Its audited Standard archive contains the required road and sidewalk pieces, making Modular Streets redundant |
| 2026-11-03 | Phase 1 runtime music uses AAC in M4A containers | The available local encoder produced browser-compatible compressed files within the static payload budget; Phase 9 still owns music editing and playback |
| 2026-11-03 | Phase 2 uses a fixed rear follow camera and Rapier capsule collision | This keeps the first movement test predictable and leaves camera orbit and detailed presentation for later phases |
| 2026-11-03 | Phase 3 uses a compact three-by-three road grid with five named landmarks and three reserved portal candidate zones | Multiple routes remain available around buildings while portal implementation stays in its later phase |
| 2026-11-03 | Phase 3 batches repeated static city meshes with instancing | Shared geometry and materials reduce draw calls without altering the approved asset set |
| 2026-11-03 | Player is male and uses the approved Quaternius male superhero base through the MVP | Corrects the earlier female player assignment; final clothing and face remain part of character polish |
| 2026-11-04 | Supersede the base-character MVP assignment with Quaternius Ultimate Modular Men | The player, Ram Sam, and Rocket Elon need finished colorful clothing before polish; the user selected this pack |
| 2026-11-04 | Use the creator's Poly Pizza distribution for Ultimate Modular Men | Quaternius's linked Google Drive files returned a quota-exceeded response; Poly Pizza supplies the same creator's CC0 pack with 11 GLBs and 24 embedded clips each |
| 2026-11-04 | Use embedded Modular Men clips for the player and Ram Sam | The audited idle, run, interact, hit, and sword-slash clips avoid an unverified retarget from the older animation libraries |
| 2026-11-04 | Supersede the active Downtown city with Kenney City Kit Commercial, City Kit Roads, and Nature Kit | The user chose a matching polygon city and character direction; the existing three-by-three road graph and chase routes remain in use while the rendered buildings, streets, lamps, trees, and bushes use the approved Kenney packs |

## Deferred decisions

- Final code licence
- Hosting provider
- Voice generation service availability and commercial terms at Phase 9 execution time; performance direction is already locked
- Controller support timing
- Whether a public leaderboard is ever added
- Monetization, if any

Add new durable decisions here with date, decision, and rationale. Do not rewrite prior entries to disguise a change; append a superseding decision.
