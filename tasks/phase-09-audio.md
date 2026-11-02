# Phase 9 — Voices, sound, and music

## Objective

Complete the game's audio identity before final facial work.

## Included

- Original `VOICE_RAM_SAM_ORIGINAL`, `VOICE_ROCKET_ELON_ORIGINAL`, and `VOICE_NPCS_ORIGINAL` files using the locked non-imitative directions
- Ram Sam, Rocket Elon, and NPC voice clips
- Subtitles and timing metadata
- Exploration/chase/assist/crisis music selected only from `MUSIC_OGA_ACTION5`
- Effects use only the exact `sfx.*` rows in `runtime-asset-manifest.csv`; portal layers combine verified interface glitches with code-generated synthesis
- Mixing, compression, preloading, and settings integration
- Complete source/licence and generated-voice workflow records; no audio asset discovery

## Excluded

- Voice cloning or real speech samples
- Final facial animation
- Unlicensed or noncommercial audio

## Acceptance criteria

- Every voice line has a subtitle and valid local asset.
- Repeated lines are controlled.
- Music transitions are smooth.
- Audio starts only after user interaction.
- Independent volume/mute controls work.
- Every audio file has commercial-use and attribution metadata.
