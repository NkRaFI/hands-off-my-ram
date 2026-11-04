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

## Manual test

1. Start the chase. Confirm the bat appears in the player's hand after the opening theft and follows the swing animation.
2. Press Space near and facing Ram Sam. Confirm a hit reaction, star feedback, a visible RAM drop, and a pickup prompt. Click the canvas for a second swing attempt; confirm mouse input also works. Try a swing from farther away and confirm it does not count as a hit.
3. Walk into the dropped RAM before the vulnerability window ends. Confirm the drop disappears, the recovery count increases once, and the RAM enters the player's inventory.
4. Wait for the escape warning and portal. Confirm Ram Sam reappears at a clear, reachable road junction and resumes the chase with another RAM stick. Repeat a hit and pickup cycle to confirm the game does not get stuck.
5. Pause during combat, resume, and resize to a narrow viewport. Confirm the attack button remains usable. Check the browser console and network responses for errors.
