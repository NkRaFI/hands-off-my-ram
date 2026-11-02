# Quality and testing

## Definition of done for a phase

- Every acceptance criterion in the active task is met.
- Every required automated command passes.
- The documented manual test has been completed.
- No serious browser-console errors remain.
- No unrelated future-phase scope was introduced.
- New assets have complete registry records.
- Relevant decisions and limitations are documented.
- The change has a focused commit.

## Testing layers

### Unit tests

Use for deterministic gameplay logic:

- State transitions
- Portal destination validation
- Scoring and assistance calculations
- Save migrations
- Cooldowns and progression

### Component tests

Use for menus, HUD, settings, subtitles, and error/fallback UI.

### Browser smoke tests

Use for:

- Application load
- Canvas creation
- Start/pause/restart
- Basic movement
- Local-save restore
- No fatal console errors

Do not attempt to automate every 3D interaction prematurely. Manual playtesting remains required for game feel.

## Manual review dimensions

- Input responsiveness
- Camera comfort
- Chase-route readability
- Hit feedback
- Portal fairness
- NPC recovery from edge cases
- Audio timing
- Mobile target size
- Frame rate and thermal behaviour
- Visual consistency with the reference

## Performance budgets

Budgets become measured baselines during implementation rather than invented hard limits. Track:

- Initial transfer size
- Largest GLB and texture files
- Draw calls
- Active triangles
- Dynamic lights and shadow casters
- Main-thread frame time
- Peak memory during a representative chase
- Desktop and mobile FPS

## Accessibility baseline

- Subtitles enabled by default for dialogue.
- Independent music, effects, and voice volume controls.
- Reduced motion/effects setting.
- High-contrast HUD state where needed.
- Keyboard and touch controls.
- Avoid meaning communicated by color alone.
