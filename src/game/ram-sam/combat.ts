import { nodeId, portalCandidateZones } from '../city/map'
import { chaseRoute } from './encounter'

export type Point = { x: number; z: number }
export type CombatStage = 'chase' | 'stunned' | 'escape' | 'reappear'
export type RamHolder = 'sam' | 'ground' | 'player'

export type CombatState = {
  stage: CombatStage
  elapsed: number
  cycle: number
  score: number
  holder: RamHolder
  drop: Point | null
  portal: Point | null
  stunSeconds: number
  attackCooldown: number
}

export const ATTACK_RANGE = 3.2
export const PICKUP_RANGE = 1.45
export const ATTACK_COOLDOWN = 0.65
export const ESCAPE_SECONDS = 2.2
export const REAPPEAR_SECONDS = 1

export function initialCombat(): CombatState {
  return { stage: 'chase', elapsed: 0, cycle: 0, score: 0, holder: 'sam', drop: null, portal: null, stunSeconds: 0, attackCooldown: 0 }
}

export function portalFor(player: Point): Point {
  // The farthest approved road junction leaves room for the player and a clear exit route.
  return portalCandidateZones.reduce<Point>((best, zone) => {
    const candidate = { x: zone.position[0], z: zone.position[1] }
    return distanceSquared(candidate, player) > distanceSquared(best, player) ? candidate : best
  }, { x: portalCandidateZones[0].position[0], z: portalCandidateZones[0].position[1] })
}

export function waypointAfter(portal: Point): number {
  const index = chaseRoute.indexOf(nodeId(portal.x, portal.z))
  if (index < 0) throw new Error('Approved portal is not on the chase route')
  return (index + 1) % chaseRoute.length
}

function distanceSquared(a: Point, b: Point) {
  return (a.x - b.x) ** 2 + (a.z - b.z) ** 2
}

export type AttackResult = 'hit' | 'miss' | 'cooldown' | 'unavailable'

export function attemptAttack(state: CombatState, player: Point, sam: Point, facing: number): { state: CombatState; result: AttackResult } {
  if (state.stage !== 'chase') return { state, result: 'unavailable' }
  if (state.attackCooldown > 0) return { state, result: 'cooldown' }
  const distance = Math.sqrt(distanceSquared(player, sam))
  const dx = sam.x - player.x
  const dz = sam.z - player.z
  const facingDot = distance > 0 ? (Math.sin(facing) * dx + Math.cos(facing) * dz) / distance : 1
  if (distance > ATTACK_RANGE || (distance > 1.1 && facingDot < -0.2)) {
    return { state: { ...state, attackCooldown: ATTACK_COOLDOWN }, result: 'miss' }
  }
  return {
    result: 'hit',
    state: {
      ...state, stage: 'stunned', elapsed: 0, holder: 'ground', drop: { ...sam }, portal: null,
      stunSeconds: 3 + (state.cycle % 3) * 0.6, attackCooldown: ATTACK_COOLDOWN,
    },
  }
}

export function collectRam(state: CombatState, player: Point): CombatState {
  if (!state.drop || state.holder !== 'ground' || distanceSquared(state.drop, player) > PICKUP_RANGE ** 2) return state
  return { ...state, drop: null, holder: 'player', score: state.score + 1 }
}

export function advanceCombat(state: CombatState, delta: number, player: Point): CombatState {
  if (!Number.isFinite(delta) || delta <= 0) return state
  let next = { ...state, attackCooldown: Math.max(0, state.attackCooldown - delta) }
  if (next.stage === 'chase') return next
  next.elapsed += delta
  if (next.stage === 'stunned' && next.elapsed >= next.stunSeconds) next = { ...next, stage: 'escape', elapsed: 0 }
  else if (next.stage === 'escape' && next.elapsed >= ESCAPE_SECONDS) {
    next = { ...next, stage: 'reappear', elapsed: 0, portal: portalFor(player), drop: null, holder: 'sam' }
  } else if (next.stage === 'reappear' && next.elapsed >= REAPPEAR_SECONDS) {
    next = { ...next, stage: 'chase', elapsed: 0, cycle: next.cycle + 1, portal: null }
  }
  return next
}
