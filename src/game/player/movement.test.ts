import { describe, expect, it } from 'vitest'
import { movementVelocity, PLAYER_SPEED } from './movement'

describe('player movement input', () => {
  it('moves at the same speed on cardinal and diagonal input', () => {
    const forward = movementVelocity(new Set(['KeyW']))
    const diagonal = movementVelocity(new Set(['KeyW', 'KeyD']))
    expect(forward).toEqual({ x: 0, z: -PLAYER_SPEED, motion: 'run' })
    expect(Math.hypot(diagonal.x, diagonal.z)).toBeCloseTo(PLAYER_SPEED)
    expect(diagonal.x).toBeGreaterThan(0)
    expect(diagonal.z).toBeLessThan(0)
  })

  it('cancels opposing directions and accepts arrow keys', () => {
    expect(movementVelocity(new Set(['KeyW', 'ArrowDown']))).toEqual({ x: 0, z: 0, motion: 'idle' })
    expect(movementVelocity(new Set(['ArrowLeft']))).toEqual({ x: -PLAYER_SPEED, z: 0, motion: 'run' })
  })
})
