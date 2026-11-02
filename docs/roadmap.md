# Roadmap

The roadmap contains ten implementation phases followed by four controlled improvement phases. Each phase is started only by an explicit user request.

| Phase | Outcome | Blender required? |
|---:|---|:---:|
| 1 | Project foundation plus one-batch intake and validation of the already-approved asset manifest | No |
| 2 | Player movement, camera, boundaries, and collisions | No |
| 3 | Placeholder city, landmarks, and navigable chase routes | No |
| 4 | Ram Sam opening portal, theft, and basic running | No |
| 5 | Bat attack, hit detection, vulnerability, RAM drops | No |
| 6 | NPC state machines, targeting, theft, reactions, endless loop | No |
| 7 | Rocket Elon assistance meter and support portal | No |
| 8 | Progression, balancing, accessibility, mobile controls | No |
| 9 | Voices, dialogue, music, sound effects, subtitles | No |
| 10 | Local saves, complete MVP QA, static deployment readiness | No |
| 11 | Environment and lighting polish | Possibly; pause if needed |
| 12 | Final character models, faces, clothing, RamAI branding | Yes; prerequisite gate |
| 13 | Final animations, expressions, and lip movement | Yes; prerequisite gate |
| 14 | Performance optimization, compatibility, and release QA | Possibly |

## Global phase workflow

1. Read the phase task.
2. Confirm included and excluded work.
3. Implement the smallest complete increment.
4. Run automated checks.
5. Complete the manual browser checklist.
6. Fix failures.
7. Update durable documentation where required.
8. Commit the verified result.
9. Stop and wait for the user to start the next phase.

Asset discovery is preproduction work and is already complete. Phase 1 performs download/intake only. Phases 2–10 consume stable IDs from the manifest and may not select replacements.

## MVP checkpoint

At the end of Phase 10, the game is complete and deployable with cohesive open assets, even though final custom faces, clothing, animation cleanup, and environment polish remain later improvements.
