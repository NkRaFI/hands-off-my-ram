export type Motion = 'idle' | 'run'

export const PLAYER_SPEED = 4.5
export const TEST_AREA_HALF_SIZE = 10

export function movementVelocity(pressed: ReadonlySet<string>, speed = PLAYER_SPEED) {
  const x = Number(pressed.has('KeyD') || pressed.has('ArrowRight')) - Number(pressed.has('KeyA') || pressed.has('ArrowLeft'))
  const z = Number(pressed.has('KeyS') || pressed.has('ArrowDown')) - Number(pressed.has('KeyW') || pressed.has('ArrowUp'))
  const length = Math.hypot(x, z)
  if (length === 0) return { x: 0, z: 0, motion: 'idle' as Motion }
  return { x: (x / length) * speed, z: (z / length) * speed, motion: 'run' as Motion }
}
