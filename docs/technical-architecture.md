# Technical architecture

## Goal

Deliver a single-player 3D game whose rendering, physics, AI state machines, audio, progress, and saves run locally in the browser.

## Proposed stack

| Concern | Direction |
|---|---|
| Build tooling | Vite + TypeScript |
| UI | React |
| 3D | Three.js via React Three Fiber |
| Helpers | `@react-three/drei` |
| Physics | Rapier via `@react-three/rapier` |
| Gameplay state | Zustand with small explicit stores |
| Model format | glTF/GLB |
| Model optimization | glTF-Transform, Meshopt/Draco as validated |
| Texture delivery | KTX2/Basis where it produces measurable benefit |
| Unit tests | Vitest |
| Component tests | React Testing Library |
| Browser smoke tests | Playwright when introduced by a phase |
| Package manager | pnpm |
| Persistence | Versioned localStorage initially; IndexedDB only if needed |

## Runtime boundaries

### React/UI layer

- Menus, HUD, subtitles, settings, pause state, accessibility options.
- Must not own frame-by-frame domain decisions.

### Game-domain layer

- Explicit state machines for Ram Sam, NPCs, portal transitions, scoring, assistance, and progression.
- Functions should be deterministic and unit-testable where possible.

### Scene layer

- React Three Fiber objects, cameras, animations, model instances, effects, and scene composition.
- Reads domain state and reports collision/event results through narrow interfaces.

### Physics/navigation layer

- Rapier colliders for the player, important characters, buildings, and boundaries.
- Navigation begins with bounded waypoints/steering. Add a navigation mesh only if map complexity demonstrates the need.

### Asset layer

- Central manifest for paths, licences, scale conventions, animation names, and preload policies.
- Runtime files are optimized GLB, compressed textures, and browser-compatible audio.

## Suggested source layout

```text
src/
├── app/
├── game/
│   ├── actors/
│   ├── systems/
│   ├── state-machines/
│   ├── physics/
│   ├── navigation/
│   └── config/
├── scene/
│   ├── characters/
│   ├── environment/
│   ├── effects/
│   └── camera/
├── ui/
├── audio/
├── assets/
└── test/
public/
└── assets/
```

This is a direction, not permission to create all folders during Phase 1. Add structure only when the active phase uses it.

## Performance targets

- Modern desktop/laptop: 60 FPS target.
- Modern mobile: stable 30 FPS target.
- Avoid allocation-heavy work in the render loop.
- Reuse objects and materials; instance repeated environment props.
- Use baked/static lighting for the environment and restrict dynamic shadow casters.
- Maintain quality presets rather than assuming one setting fits all devices.
- Measure before adding compression, LOD, or complex pooling.

## Save model

Initial save data:

- Schema version
- Settings
- Lifetime RAM recovered
- Unlocked upgrades
- Best combo and related local records

All migrations must be explicit. Corrupt or old saves should fall back safely without preventing the game from starting.

## Security and privacy

- No secrets in the browser bundle.
- No user account or personal data required.
- No network dependency after static assets are loaded.
- No analytics in the MVP.
- Any later external service requires an explicit privacy and architecture decision.

## Deployment

The production output is static and may be hosted on Vercel, Cloudflare Pages, GitHub Pages, or another static host. Hosting choice is deferred until the deployment phase.
