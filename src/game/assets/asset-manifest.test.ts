// @vitest-environment node
import { createHash } from 'node:crypto'
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { assetManifest } from './asset-manifest'

describe('approved asset intake', () => {
  it('resolves every locked runtime ID to a checked production file', () => {
    const lockedIds = readFileSync('docs/runtime-asset-manifest.csv', 'utf8')
      .trim().split('\n').slice(1).map((line) => line.split(',')[0])
    expect(Object.keys(assetManifest).sort()).toEqual(lockedIds.sort())

    const checksums = new Map(
      readFileSync('docs/runtime-asset-checksums.csv', 'utf8')
        .trim().split('\n').slice(1).map((line) => {
          const [file, bytes, sha256] = line.split(',')
          return [file, { bytes: Number(bytes), sha256: sha256.trim() }] as const
        }),
    )

    for (const asset of Object.values(assetManifest)) {
      expect(asset.url.startsWith('/assets/')).toBe(true)
      const relative = asset.url.slice('/assets/'.length)
      expect(relative.includes('..')).toBe(false)
      const expected = checksums.get(relative)
      expect(expected, relative).toBeDefined()
    }
    for (const [relative, expected] of checksums) {
      const file = resolve('public/assets', relative)
      const bytes = readFileSync(file)
      expect(statSync(file).size).toBe(expected.bytes)
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(expected.sha256)
      expect(bytes.length).toBeLessThan(24 * 1024 * 1024)
    }
  })
})
