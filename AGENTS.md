# Codex working agreement

These instructions apply to every automated coding session in this repository.

## 1. Read before acting

Before any implementation:

1. Read this file.
2. Read `docs/decision-log.md`.
3. Read the task file for the requested phase.
4. Read only the linked supporting documents necessary for that task.
5. For visual work, inspect `docs/references/target-gameplay-look.png`, `docs/visual-style-guide.md`, and `docs/asset-visual-references.md`.

If the user has not named a phase or task, ask which documented phase to work on. Do not infer permission to start later work.

## 2. Phase discipline

- Implement exactly one phase at a time.
- Respect every `Included`, `Excluded`, and `Acceptance criteria` section.
- Do not build future-phase systems “while here.”
- Use only the stable asset IDs assigned to the phase. Placeholder means an approved manifest asset, not an unplanned substitute.
- Do not mark a phase complete until automated checks and documented manual tests pass.
- Stop after reporting results. The user decides when the next phase begins.

## 3. Verification

For every implementation task:

- Run the narrowest relevant tests first, then the full required phase checks.
- Run type-checking, linting, and production build when available.
- Check the browser console for errors.
- Report what was tested, what was not tested, and any known limitations.
- Never conceal a failing check or weaken a test merely to obtain green output.

## 4. Architecture constraints

- The MVP is single-player and runs locally in the browser.
- Do not add a backend, authentication, database, multiplayer, analytics, ad SDK, or cloud save unless a later explicit decision authorizes it.
- NPC behaviour must be deterministic coded state machines; do not add runtime LLM calls.
- Keep game-domain logic outside React rendering components where practical.
- Avoid unnecessary abstractions and large state libraries.
- Optimize for a stable 60 FPS desktop target and a usable 30 FPS mobile target.

## 5. Asset rules

- Asset discovery is complete. Phase 1 downloads and verifies the complete approved manifest in `docs/asset-catalog.md`; later phases must not browse for or download alternative assets.
- Never download an asset unless its stable ID, exact source URL, role, and licence are recorded in `docs/asset-registry.csv`.
- Prefer CC0 or project-compatible commercial-use licences.
- Do not use assets marked noncommercial, editorial-only, or with unclear provenance.
- Do not redistribute source assets as a standalone pack.
- Use the exact Quaternius, Kenney, Poly Pizza, and OpenGameArt items listed in the approved catalogue. KayKit, Mixamo, Freesound, and unlisted catalogue items are not approved for the MVP.
- If an approved asset is unavailable or its licence has changed, stop and report it. Do not silently substitute another asset.
- Keep third-party raw/source files out of the repository when their licence prohibits redistribution. Store processed runtime files only when permitted, and retain the source record.
- Do not add official OpenAI, ChatGPT, SpaceX, X, Tesla, or other third-party logos.
- The RamAI emblem may be a recognizable satirical spiral-flower made from RAM modules, but it must remain the project's original asset and must not imply endorsement.

## 6. Audio and likeness rules

- Do not clone, imitate, or train on the voices of real people.
- Use fictional, clearly non-imitative voices and local exported audio files.
- Do not incorporate copyrighted podcast/interview recordings without documented permission.
- Keep combat cartoonish: no blood, gore, visible injury, or realistic suffering.
- Characters are exaggerated fictional caricatures named Ram Sam and Rocket Elon; do not market the game as official or endorsed.

## 7. Blender prerequisite gate

Existing open assets are sufficient through the complete gameplay MVP. Blender-dependent modifications belong only to the documented polishing phases.

Before any Blender-dependent task:

1. Check whether Blender is installed and executable.
2. If unavailable, stop immediately.
3. Do not install Blender, modify assets, download substitutes, or start adjacent work.
4. Tell the user: `Blender is required for this phase but was not detected. Please install Blender and ask me to continue. I have not started or changed anything.`
5. Continue only in a later user request after installation is confirmed and verified.

## 8. Git and change safety

- Preserve user changes and inspect the working tree before editing.
- Use focused commits with meaningful messages.
- Do not rewrite history, force-push, delete branches, or remove assets without explicit approval.
- Never commit secrets, API keys, paid-asset credentials, or generated service tokens.

## 9. Documentation maintenance

- Record durable architectural or product decisions in `docs/decision-log.md`.
- Update the active phase task when acceptance criteria change.
- Update the asset registry in the same commit as every new asset.
- Do not silently change established gameplay rules.
