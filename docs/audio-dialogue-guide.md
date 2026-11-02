# Audio and dialogue guide

Audio is completed before final faces and facial animation so that character timing can be built around approved clips.

## Audio phase outcomes

- Final dialogue script
- Fictional AI voice selection
- Exported local dialogue files
- Subtitles and timing metadata
- Portal, RAM-drop, impact, UI, footsteps, rocket, and ambience effects
- Exploration and chase music
- Music state transitions
- Volume categories and mute controls
- Browser-compatible compressed output

## Voice rules

- Do not clone or imitate real voices.
- Do not upload interviews or speeches as voice references.
- Use clearly fictional directions such as `calm cartoon technology executive` or `eccentric fictional rocket entrepreneur`.
- Confirm commercial game usage, exported-audio distribution, and modification rights for the selected provider before generation.
- Save generated files locally; gameplay must not call a voice API.
- Include subtitles for every spoken line.

## Character direction

### Ram Sam

- Calm, polished fictional executive voice.
- Becomes hurried or nervous when chased.
- Full signature line is used in the opening; shortened fictional variations prevent repetition.

### Rocket Elon

- Energetic fictional space entrepreneur.
- Distinct from Ram Sam and not a real-person imitation.
- Signature line accompanies the first Space Assist arrival.

### NPCs

- Short, readable, role-specific reactions.
- Avoid long monologues during active chase gameplay.
- Dialogue selection must prevent the same line repeating too frequently.

## Music states

- Calm city exploration
- Active chase
- Ram Sam vulnerability/combo escalation
- Portal escape transition
- Space Assist arrival
- Recoverable cloud-takeover crisis

Transitions should crossfade rather than abruptly restart tracks.

## Delivery conventions

```text
public/assets/audio/
├── dialogue/
│   ├── ram-sam/
│   ├── rocket-elon/
│   └── npcs/
├── sfx/
├── music/
└── ambience/
```

- Keep lossless masters outside the runtime bundle when practical.
- Prefer OGG/WebM runtime delivery after browser compatibility testing.
- Normalize dialogue consistently and protect against clipping.
- Do not autoplay audible sound before user interaction.
