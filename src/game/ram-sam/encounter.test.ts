import { describe, expect, it } from 'vitest'
import { advanceEncounter, chaseRoute, initialEncounter, routeIsValid, SAM_SPEED } from './encounter'

describe('Ram Sam opening encounter', () => {
  it('always reaches a theft and chase from the opening portal', () => {
    let state = initialEncounter()
    for (let index = 0; index < 180; index++) state = advanceEncounter(state, 1 / 60)
    expect(state.phase).toBe('chase')
    expect(state.z).toBeLessThan(-1.2)
    expect(Number.isFinite(state.x)).toBe(true)
  })

  it('keeps the chase on connected road waypoints and slower than the player', () => {
    expect(routeIsValid()).toBe(true)
    expect(chaseRoute.length).toBeGreaterThan(3)
    expect(SAM_SPEED).toBeLessThan(4.5)
    let state = advanceEncounter(initialEncounter(), 2.4)
    for (let index = 0; index < 2400; index++) {
      state = advanceEncounter(state, 1 / 60)
      expect(Number.isFinite(state.x) && Number.isFinite(state.z)).toBe(true)
      expect(state.phase).toBe('chase')
    }
    expect(state.waypoint).toBeGreaterThan(1)
  })

  it('ignores invalid frame times without changing state', () => {
    const state = initialEncounter()
    expect(advanceEncounter(state, Number.NaN)).toBe(state)
    expect(advanceEncounter(state, -1)).toBe(state)
  })
})
