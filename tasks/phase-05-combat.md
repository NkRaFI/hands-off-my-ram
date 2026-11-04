# Phase 5 — Chase combat and RAM recovery

## Objective

Make the first complete playable interaction: catch Ram Sam, attack, and recover RAM before a telegraphed escape.

## Included

- `PROP_POLYPIZZA_BAT`
- Attack input using the audited embedded `CharacterArmature|Sword_Slash` clip from `character.player`
- Generous hit detection/assistance
- Ram Sam hit reactions and variable vulnerability window
- `PROP_POLYPIZZA_RAM` drops, collection, score, portal escape/reappearance test cycle
- Cartoon feedback without graphic injury

## Excluded

- NPC population and dialogue
- Rocket assistance
- Upgrades and final audio

## Acceptance criteria

- The player can consistently catch and hit Ram Sam.
- Each valid hit produces readable feedback and collectible RAM.
- Escape is clearly telegraphed and never feels instantaneous.
- Portal destinations are collision-safe and reachable.
- Repeated cycles do not leak actors or become stuck.
