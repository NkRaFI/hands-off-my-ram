# Visual style guide

## Canonical references

- `references/target-gameplay-look.png` is the target gameplay mood and composition.
- `references/ramai-emblem-concept.png` is the RamAI emblem concept.

These are concept references, not optimized runtime assets. Inspect them before visual work.

## Target appearance

- Vibrant low-poly 3D browser-game aesthetic.
- Friendly, exaggerated cartoon proportions.
- Large readable heads, hands, props, and silhouettes.
- Rounded/chamfered geometry rather than sharp realism.
- Bright daylight with soft, economical shadows.
- Saturated green RAM, cyan/purple portals, and clean city surfaces.
- Visually dense enough to feel alive but navigationally uncluttered.

## Character direction

- Third-person player silhouette must remain readable against buildings and portals.
- Ram Sam is a clearly fictional caricature with a distinctive hairstyle, corporate clothing, and RamAI emblem.
- Rocket Elon is a separate fictional caricature with space-themed clothing and an original rocket-support emblem.
- NPCs share one modular visual family with varied bodies, skin tones, hair, clothing, and accessories.
- Main characters may use simple facial blend shapes later; NPCs may use cheaper texture or bone-based expressions.
- Final likeness should come from the full combination of shape, costume, movement, dialogue, and context—not photorealism.

## Environment direction

Required landmarks:

- RamAI data centre
- Electronics shop
- Local AI café
- Gaming venue
- Residential/Grandma area
- Open plaza and portal-compatible spaces
- Roads, sidewalks, alleys, trees, benches, and lamps

The map must support continuous pursuit. Every major destination needs at least two reasonable approach paths, and portal destinations must not trap actors.

## Palette roles

- RAM/recovery: luminous green
- RamAI portal/cloud technology: purple and cyan
- Space Assist: cyan/blue with a warm rocket accent
- Player/local computing: warm red/orange accents
- Public anger/danger: red/orange
- Neutral environment: bright stone, cool glass, green vegetation

Exact color values are deferred until implementation and must be tested in the scene.

## Production constraints

- Prefer atlas textures and shared materials.
- Use GLB for runtime models.
- Keep transparent materials limited.
- Use particles sparingly and provide a reduced-effects mode.
- Avoid tiny text baked into 3D objects unless it remains legible at gameplay distance.
- Do not reproduce the concept image's third-party-like logos. Apply the original RamAI emblem instead.

## Avoid

- Photorealism
- Gritty violence
- Horror styling
- Unrelated asset-pack aesthetics mixed without adaptation
- Excessive bloom, reflective materials, or dynamic lights
- Crowded props that obstruct chase routes
- Official third-party logos or branding that implies endorsement

## Acceptance test for any new visual asset

1. Does it look at home beside the canonical reference?
2. Is it readable from the gameplay camera?
3. Does its licence permit the intended distribution?
4. Is its scale/orientation consistent?
5. Does it meet the current performance budget?
6. Does it avoid official marks and misleading affiliation?
