import { describe, expect, it } from 'vitest'
import { advanceCombat, attemptAttack, collectRam, initialCombat, portalFor, waypointAfter } from './combat'

describe('RAM recovery combat', () => {
  it('requires a close forward swing and gives a visible recovery window', () => {
    const base = initialCombat()
    expect(attemptAttack(base, { x: 0, z: 0 }, { x: 0, z: -4 }, Math.PI).result).toBe('miss')
    const hit = attemptAttack(base, { x: 0, z: 0 }, { x: 0, z: -2 }, Math.PI)
    expect(hit.result).toBe('hit')
    expect(hit.state.stage).toBe('stunned')
    expect(hit.state.holder).toBe('ground')
    expect(hit.state.drop).toEqual({ x: 0, z: -2 })
    expect(advanceCombat(hit.state, 2.9, { x: 0, z: 0 }).stage).toBe('stunned')
    expect(advanceCombat(hit.state, 3.1, { x: 0, z: 0 }).stage).toBe('escape')
  })

  it('collects a drop once and cycles through a telegraphed safe portal', () => {
    let state = attemptAttack(initialCombat(), { x: 0, z: 0 }, { x: 0, z: -1.5 }, Math.PI).state
    expect(collectRam(state, { x: 0, z: 0 }).score).toBe(0)
    state = collectRam(state, { x: 0, z: -1.5 })
    expect(state.score).toBe(1)
    expect(collectRam(state, { x: 0, z: -1.5 }).score).toBe(1)
    state = advanceCombat(state, 3.1, { x: 0, z: 0 })
    expect(state.stage).toBe('escape')
    state = advanceCombat(state, 2.3, { x: 0, z: 0 })
    expect(state.stage).toBe('reappear')
    expect(state.portal).toBeTruthy()
    expect(waypointAfter(state.portal!)).toBeGreaterThanOrEqual(0)
    state = advanceCombat(state, 1.1, { x: 0, z: 0 })
    expect(state.stage).toBe('chase')
    expect(state.cycle).toBe(1)
    expect(state.score).toBe(1)
  })

  it('keeps portal choices far from the player and hit windows variable', () => {
    const portal = portalFor({ x: -40, z: -40 })
    expect(portal).toEqual({ x: 40, z: 40 })
    const first = attemptAttack(initialCombat(), { x: 0, z: 0 }, { x: 0, z: -1 }, Math.PI).state
    const next = attemptAttack({ ...initialCombat(), cycle: 1 }, { x: 0, z: 0 }, { x: 0, z: -1 }, Math.PI).state
    expect(next.stunSeconds).toBeGreaterThan(first.stunSeconds)
  })

  it('can complete repeated hit, pickup, escape, and return cycles', () => {
    let state = initialCombat()
    for (let cycle = 0; cycle < 20; cycle++) {
      const attack = attemptAttack(state, { x: 0, z: 0 }, { x: 0, z: -2 }, Math.PI)
      expect(attack.result).toBe('hit')
      state = collectRam(attack.state, { x: 0, z: -2 })
      state = advanceCombat(state, state.stunSeconds + 0.1, { x: 0, z: 0 })
      expect(state.stage).toBe('escape')
      state = advanceCombat(state, 2.3, { x: 0, z: 0 })
      expect(state.stage).toBe('reappear')
      state = advanceCombat(state, 1.1, { x: 0, z: 0 })
      expect(state.stage).toBe('chase')
      expect(state.drop).toBeNull()
      expect(state.score).toBe(cycle + 1)
    }
  })
})
