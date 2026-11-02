# Phase 1 — Foundation and approved asset intake

## Objective

Create a minimal, maintainable React/TypeScript 3D application and fetch the complete pre-approved MVP asset manifest in one controlled intake.

## Included

- Vite React TypeScript project
- pnpm lockfile and Node engine declaration
- React Three Fiber, Drei, Rapier, and the selected small state/test dependencies
- One empty, responsive 3D scene with a ground plane, camera, and basic light
- Minimal start/loading/error UI
- Type-check, lint, unit-test, and production-build commands
- One browser smoke test only if the environment supports it without destabilizing setup
- Acquire the checksum-pinned sources in `docs/asset-audit-report.md` and extract only rows locked in `docs/runtime-asset-manifest.csv`
- Capture licence evidence, original archive names, download dates, and SHA-256 checksums
- Normalize permitted runtime files into stable-ID-based paths and generate `src/game/assets/asset-manifest.ts`
- Validate that each asset loads in a simple inspection scene; do not yet build gameplay with it

## Excluded

- Player movement
- Character or city gameplay implementation
- Portals
- Combat
- NPCs
- Audio implementation (approved audio archives are still acquired during intake)
- Final UI styling
- Backend or deployment configuration

## Acceptance criteria

- `pnpm install` completes from a clean checkout.
- The development server renders the empty 3D scene without console errors.
- The canvas resizes correctly.
- A production build completes.
- Type-check, lint, and unit tests pass.
- No unnecessary dependency or future-phase folder is added.
- README setup commands reflect the actual project.
- Every approved archive is downloaded or the phase stops on a named blocker without substitution.
- Every registry row is complete and every normalized runtime asset resolves through the generated manifest.
- No new asset source was discovered or selected during the phase.
- Every production file is below 24 MiB and the generated bundle report satisfies the documented initial/deferred payload budgets.

## Manual test

1. Clone a clean copy.
2. Install using the documented Node and pnpm versions.
3. Start development mode.
4. Resize the browser from desktop width to a narrow mobile width.
5. Confirm the scene remains visible and responsive.
6. Confirm there are no fatal console errors.
7. Run the production preview.

## Completion report

Report dependency versions, commands run, manual checks completed, known limitations, and the commit SHA. Stop after Phase 1.
