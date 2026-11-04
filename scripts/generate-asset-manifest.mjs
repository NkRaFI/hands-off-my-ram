import { readFileSync, writeFileSync } from 'node:fs'

const rows = readFileSync('docs/runtime-asset-manifest.csv', 'utf8')
  .trim().split(/\r?\n/).slice(1).map((line) => {
    const [id, sourceId, sourceFile] = line.split(',')
    return { id, sourceId, sourceFile }
  })

const entries = new Map()
for (const { id, sourceId, sourceFile } of rows) {
  if (sourceFile.startsWith('clip:')) {
    const parent = sourceId === 'ANIM_QUATERNIUS_CORE' ? 'animation.core' : 'animation.action'
    entries.set(id, { url: entries.get(parent).url, clip: sourceFile.slice(5).trim(), sourceId })
    continue
  }
  if (id === 'city.kenney.texture.commercial' || id === 'city.kenney.texture.roads') {
    const name = id.endsWith('.roads') ? 'colormad.png' : 'colormap.png'
    entries.set(id, { url: `/assets/models/Textures/${name}`, sourceId })
    continue
  }
  const filename = id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const folder = sourceFile.endsWith('.png') ? 'ui' : sourceFile.endsWith('.wav') || sourceFile.endsWith('.ogg') ? 'audio' : 'models'
  const extension = sourceFile.endsWith('.png') ? 'png' : sourceFile.endsWith('.ogg') ? 'ogg' : sourceFile.endsWith('.wav') ? 'm4a' : 'glb'
  entries.set(id, { url: `/assets/${folder}/${filename}.${extension}`, sourceId })
}

const output = [
  '// Generated from docs/runtime-asset-manifest.csv during Phase 1.',
  '// Paths are stable runtime IDs; source and licence details are in docs/asset-registry.csv.',
  'export const assetManifest = {',
  ...Array.from(entries, ([id, value]) => `  ${JSON.stringify(id)}: ${JSON.stringify(value)},`),
  '} as const',
  '',
  'export type AssetId = keyof typeof assetManifest',
  'export function assetUrl(id: AssetId): string { return assetManifest[id].url }',
  '',
].join('\n')
writeFileSync('src/game/assets/asset-manifest.ts', output)
