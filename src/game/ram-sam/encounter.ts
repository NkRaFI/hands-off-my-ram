import { nodeId, roadEdges, roadNodes, type RoadNode } from '../city/map'

export type EncounterPhase = 'portal' | 'approach' | 'steal' | 'chase'

export type EncounterState = {
  phase: EncounterPhase
  elapsed: number
  x: number
  z: number
  waypoint: number
}

export const SAM_START = { x: 0, z: -4 } as const
export const SAM_SPEED = 3.7
export const PORTAL_SECONDS = 0.8
export const APPROACH_SECONDS = 0.8
export const STEAL_SECONDS = 0.8

// Each consecutive pair is a road edge; this keeps the chase clear of buildings.
export const chaseRoute: RoadNode[] = [
  nodeId(0, 0), nodeId(0, -40), nodeId(-40, -40), nodeId(-40, 0),
  nodeId(-40, 40), nodeId(0, 40), nodeId(40, 40), nodeId(40, 0),
  nodeId(40, -40), nodeId(0, -40),
]

export function initialEncounter(): EncounterState {
  return { phase: 'portal', elapsed: 0, x: SAM_START.x, z: SAM_START.z, waypoint: 1 }
}

function moveTowards(x: number, z: number, targetX: number, targetZ: number, distance: number) {
  const dx = targetX - x
  const dz = targetZ - z
  const remaining = Math.hypot(dx, dz)
  if (remaining <= distance) return { x: targetX, z: targetZ, left: distance - remaining, reached: true }
  return { x: x + dx / remaining * distance, z: z + dz / remaining * distance, left: 0, reached: false }
}

export function advanceEncounter(state: EncounterState, delta: number): EncounterState {
  if (!Number.isFinite(delta) || delta <= 0) return state
  let remaining = delta
  let next = { ...state }

  if (next.phase === 'portal') {
    const step = Math.min(remaining, PORTAL_SECONDS - next.elapsed)
    next.elapsed += step
    remaining -= step
    if (next.elapsed >= PORTAL_SECONDS) next = { ...next, phase: 'approach', elapsed: 0 }
  }
  if (next.phase === 'approach') {
    const step = Math.min(remaining, APPROACH_SECONDS - next.elapsed)
    next.elapsed += step
    remaining -= step
    next.z = SAM_START.z + (SAM_START.z * -1 - 1.2) * (next.elapsed / APPROACH_SECONDS)
    if (next.elapsed >= APPROACH_SECONDS) next = { ...next, phase: 'steal', elapsed: 0, z: -1.2 }
  }
  if (next.phase === 'steal') {
    const step = Math.min(remaining, STEAL_SECONDS - next.elapsed)
    next.elapsed += step
    remaining -= step
    if (next.elapsed >= STEAL_SECONDS) next = { ...next, phase: 'chase', elapsed: 0 }
  }
  if (next.phase === 'chase') {
    next.elapsed += remaining
    let travel = remaining * SAM_SPEED
    let guard = 0
    while (travel > 0 && guard++ < chaseRoute.length + 1) {
      const [x, z] = chaseRoute[next.waypoint].split(',').map(Number)
      const moved = moveTowards(next.x, next.z, x, z, travel)
      next.x = moved.x
      next.z = moved.z
      travel = moved.left
      if (!moved.reached) break
      next.waypoint = (next.waypoint + 1) % chaseRoute.length
    }
  }
  return next
}

export function routeIsValid(): boolean {
  return chaseRoute.every((node, index) => {
    if (!roadNodes.includes(node)) return false
    const next = chaseRoute[(index + 1) % chaseRoute.length]
    return roadEdges.some(([a, b]) => (a === node && b === next) || (a === next && b === node))
  })
}
