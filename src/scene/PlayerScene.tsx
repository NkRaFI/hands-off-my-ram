import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import { CapsuleCollider, Physics, RigidBody, useBeforePhysicsStep, useRapier, type RapierRigidBody } from '@react-three/rapier'
import { AnimationMixer, Box3, Group, Object3D, Quaternion, Vector3 } from 'three'
import { assetUrl } from '../game/assets/asset-manifest'
import { movementVelocity, type Motion } from '../game/player/movement'
import { advanceEncounter, initialEncounter, PORTAL_SECONDS, SAM_START, type EncounterPhase } from '../game/ram-sam/encounter'
import { advanceCombat, attemptAttack, collectRam, initialCombat, waypointAfter, type AttackResult, type CombatState, type Point } from '../game/ram-sam/combat'
import { CityColliders, CityLayout } from './city/CityLayout'

const BODY_HEIGHT = 0.87
const IDLE_CLIP = 'CharacterArmature|Idle'
const WEAPON_IDLE_CLIP = 'CharacterArmature|Idle_Sword'
const RUN_CLIP = 'CharacterArmature|Run'
const INTERACT_CLIP = 'CharacterArmature|Interact'
const ATTACK_CLIP = 'CharacterArmature|Sword_Slash'
const HIT_CLIP = 'CharacterArmature|HitRecieve'

type PlayerSceneProps = {
  pressed: RefObject<Set<string>>
  attackRequests: RefObject<number>
  facingRef: RefObject<number>
  paused: boolean
  motion: Motion
  onMotionChange: (motion: Motion) => void
  onModelLoaded: () => void
  onCityLoaded: () => void
  onSamLoaded: () => void
  onPositionChange: (x: number, y: number, z: number) => void
  playerPosition: [number, number, number]
  encounterPhase: EncounterPhase
  onEncounterPhaseChange: (phase: EncounterPhase) => void
  onSamPositionChange: (x: number, z: number) => void
  onCombatChange: (state: CombatState) => void
  onAttackResult: (result: AttackResult) => void
  sceneReady: boolean
}

function Character({ id, motion, paused, carryingRam, holdingBat = false, onLoaded }: { id: 'character.player' | 'character.sam'; motion: Motion | 'interact' | 'attack' | 'hit'; paused: boolean; carryingRam: boolean; holdingBat?: boolean; onLoaded?: () => void }) {
  const character = useGLTF(assetUrl(id))
  const mixer = useMemo(() => new AnimationMixer(character.scene), [character.scene])
  const wrist = useMemo(() => {
    // GLTFLoader strips the dot from the source bone name `Wrist.R`.
    const bone = character.scene.getObjectByName('WristR')
    if (!bone) throw new Error(`Missing right wrist on approved character: ${id}`)
    return bone
  }, [character.scene, id])
  const gripPose = useMemo(() => {
    if (!holdingBat) return []
    const clip = character.animations.find((item) => item.name === WEAPON_IDLE_CLIP)
    if (!clip) throw new Error(`Missing approved weapon idle clip: ${WEAPON_IDLE_CLIP}`)
    const fingers = clip.tracks.flatMap((track) => {
      const name = track.name.replace(/\.quaternion$/, '').split('/').at(-1) ?? ''
      if (!/^(Index|Middle|Ring|Pinky|Thumb)[1-4]R$/.test(name) || !track.name.endsWith('.quaternion')) return []
      const bone = character.scene.getObjectByName(name)
      return bone ? [{ bone, rotation: new Quaternion().fromArray(track.values, 0) }] : []
    })
    if (fingers.length < 10) throw new Error('Approved character is missing the sword-grip finger pose')
    return fingers
  }, [character.animations, character.scene, holdingBat])
  const palmBones = useMemo(() => {
    if (!holdingBat) return null
    const knuckle = character.scene.getObjectByName('Middle1R')
    const middle = character.scene.getObjectByName('Middle2R')
    const thumb = character.scene.getObjectByName('Thumb2R')
    if (!knuckle || !middle || !thumb) throw new Error('Approved character is missing the right palm joints')
    return { knuckle, middle, thumb }
  }, [character.scene, holdingBat])

  useEffect(() => { onLoaded?.() }, [onLoaded])

  useEffect(() => {
    const name = motion === 'run' ? RUN_CLIP : motion === 'interact' ? INTERACT_CLIP : motion === 'attack' ? ATTACK_CLIP : motion === 'hit' ? HIT_CLIP : holdingBat ? WEAPON_IDLE_CLIP : IDLE_CLIP
    const clip = character.animations.find((item) => item.name === name)
    if (!clip) throw new Error(`Missing approved animation clip: ${name}`)
    const action = mixer.clipAction(clip)
    if (motion === 'attack' || motion === 'hit') action.timeScale = Math.max(1, clip.duration / 0.55)
    action.reset().fadeIn(0.18).play()
    return () => { action.fadeOut(0.18) }
  }, [character.animations, mixer, motion, holdingBat])

  useFrame((_, delta) => {
    if (paused) return
    mixer.update(Math.min(delta, 0.1))
    if (holdingBat && motion !== 'attack') for (const finger of gripPose) finger.bone.quaternion.copy(finger.rotation)
  })

  return <>
    <primitive object={character.scene} />
    {carryingRam && createPortal(
      <group position={[0, 0.0007, 0]} scale={0.01}>
        <RamProp />
      </group>, wrist,
    )}
    {holdingBat && palmBones && createPortal(
      <BatProp attacking={motion === 'attack'} paused={paused} wrist={wrist} palmBones={palmBones} />, wrist,
    )}
  </>
}

function PropModel({ id, length, anchor = 'center' }: { id: 'prop.ram' | 'prop.bat'; length: number; anchor?: 'center' | 'bat-grip' }) {
  const model = useGLTF(assetUrl(id))
  const scene = useMemo(() => {
    const scene = model.scene.clone(true)
    const bounds = new Box3().setFromObject(scene)
    const size = bounds.getSize(new Vector3())
    const center = bounds.getCenter(new Vector3())
    const scale = length / Math.max(size.x, size.y, size.z, 0.001)
    scene.scale.setScalar(scale)
    if (anchor === 'bat-grip') {
      // The approved bat's narrow handle is at its negative-X end. Place the
      // hand 8 cm in from that end, then rotate the bat around the grip.
      scene.position.set(-bounds.min.x * scale - 0.08, -center.y * scale, -center.z * scale)
    } else {
      scene.position.copy(center).multiplyScalar(-scale)
    }
    return scene
  }, [model.scene, length, anchor])
  return <primitive object={scene} />
}

function RamProp() {
  return <group rotation={[0.2, 0, -0.3]}><PropModel id="prop.ram" length={0.34} /></group>
}

function BatProp({ attacking, paused, wrist, palmBones }: { attacking: boolean; paused: boolean; wrist: Object3D; palmBones: { knuckle: Object3D; middle: Object3D; thumb: Object3D } }) {
  const anchor = useRef<Group>(null)
  const grip = useRef<Group>(null)
  const palmPoint = useRef(new Vector3())
  const middlePoint = useRef(new Vector3())
  const thumbPoint = useRef(new Vector3())
  useFrame((_, delta) => {
    if (!anchor.current || !grip.current || paused) return
    palmBones.knuckle.getWorldPosition(palmPoint.current)
    palmBones.middle.getWorldPosition(middlePoint.current)
    palmBones.thumb.getWorldPosition(thumbPoint.current)
    palmPoint.current.lerp(middlePoint.current, 0.65).lerp(thumbPoint.current, 0.25)
    wrist.worldToLocal(palmPoint.current)
    anchor.current.position.copy(palmPoint.current)
    const target = attacking ? 1.1 : 1.1 + Math.PI
    const difference = Math.atan2(Math.sin(target - grip.current.rotation.z), Math.cos(target - grip.current.rotation.z))
    grip.current.rotation.z += difference * (1 - Math.exp(-14 * Math.min(delta, 0.1)))
  })
  return <group ref={anchor} scale={0.01}>
    <group ref={grip} rotation={[0, 0, 1.1 + Math.PI]}><PropModel id="prop.bat" length={0.8} anchor="bat-grip" /></group>
  </group>
}

function Portal({ elapsed, paused, position = SAM_START }: { elapsed: number; paused: boolean; position?: Point }) {
  const ring = useRef<Group>(null)
  useFrame((_, delta) => {
    if (!ring.current || paused) return
    ring.current.rotation.z += delta * 1.8
    ring.current.scale.setScalar(Math.min(1, 0.15 + elapsed / PORTAL_SECONDS))
  })
  return (
    <group ref={ring} position={[position.x, 1.45, position.z]}>
      <mesh>
        <torusGeometry args={[1.35, 0.16, 10, 32]} />
        <meshStandardMaterial color="#a75cff" emissive="#7b22f8" emissiveIntensity={2.4} />
      </mesh>
      <mesh rotation={[0, 0, 0.4]}>
        <torusGeometry args={[1.06, 0.08, 8, 28]} />
        <meshStandardMaterial color="#61eaff" emissive="#27bafa" emissiveIntensity={2} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.98, 32]} />
        <meshBasicMaterial color="#7336c9" transparent opacity={0.67} depthWrite={false} side={2} />
      </mesh>
    </group>
  )
}

function DroppedRam({ at, paused }: { at: Point; paused: boolean }) {
  const visual = useRef<Group>(null)
  const elapsed = useRef(0)
  useFrame((_, delta) => {
    if (!visual.current || paused) return
    elapsed.current += delta
    visual.current.rotation.y = elapsed.current * 1.4
    visual.current.position.y = 0.35 + Math.sin(elapsed.current * 4) * 0.08
  })
  return <group position={[at.x, 0, at.z]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
      <ringGeometry args={[0.38, 0.48, 24]} />
      <meshBasicMaterial color="#92ff58" transparent opacity={0.8} side={2} />
    </mesh>
    <group ref={visual}><PropModel id="prop.ram" length={0.55} /></group>
    <Html position={[0, 1.05, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
      <span className="ram-drop-label">RAM! Grab it</span>
    </Html>
  </group>
}

function RamSam({ paused, sceneReady, onLoaded, onEncounterPhaseChange, onPositionChange, onCombatChange, onAttackResult, attackRequests, facingRef, playerPosition }: Pick<PlayerSceneProps, 'paused' | 'sceneReady' | 'onEncounterPhaseChange' | 'onCombatChange' | 'onAttackResult' | 'attackRequests' | 'facingRef' | 'playerPosition'> & { onLoaded: () => void; onPositionChange: (x: number, z: number) => void }) {
  const state = useRef(initialEncounter())
  const combat = useRef(initialCombat())
  const actor = useRef<Group>(null)
  const [phase, setPhase] = useState<EncounterPhase>('portal')
  const [combatView, setCombatView] = useState<CombatState>(initialCombat)
  const [visualPosition, setVisualPosition] = useState<Point>(SAM_START)
  const [portalElapsed, setPortalElapsed] = useState(0)
  const sync = useRef(0)
  const lastAttack = useRef(0)

  useFrame((_, delta) => {
    if (paused || !sceneReady) return
    const step = Math.min(delta, 0.1)
    const previous = state.current
    let next = previous.phase !== 'chase' || combat.current.stage === 'chase' ? advanceEncounter(previous, step) : previous
    const previousCombat = combat.current
    let nextCombat = previousCombat
    if (next.phase === 'chase') {
      const player = { x: playerPosition[0], z: playerPosition[2] }
      nextCombat = advanceCombat(nextCombat, step, player)
      if (nextCombat.stage === 'reappear' && previousCombat.stage !== 'reappear' && nextCombat.portal) {
        next = { ...next, x: nextCombat.portal.x, z: nextCombat.portal.z, waypoint: waypointAfter(nextCombat.portal) }
      }
      if (attackRequests.current !== lastAttack.current) {
        lastAttack.current = attackRequests.current
        const attack = attemptAttack(nextCombat, player, { x: next.x, z: next.z }, facingRef.current)
        nextCombat = attack.state
        onAttackResult(attack.result)
      }
      nextCombat = collectRam(nextCombat, player)
      if (nextCombat.stage !== previousCombat.stage || nextCombat.score !== previousCombat.score || nextCombat.holder !== previousCombat.holder) {
        onCombatChange(nextCombat)
      }
      combat.current = nextCombat
    }
    state.current = next
    if (next.phase !== previous.phase) {
      setPhase(next.phase)
      onEncounterPhaseChange(next.phase)
      if (previous.phase === 'portal') setPortalElapsed(PORTAL_SECONDS)
    }
    if (next.phase === 'portal' && Math.abs(next.elapsed - portalElapsed) > 0.08) setPortalElapsed(next.elapsed)
    if (actor.current) {
      actor.current.position.set(next.x, 0, next.z)
      const dx = next.x - previous.x
      const dz = next.z - previous.z
      if (Math.hypot(dx, dz) > 0.001) actor.current.rotation.y = Math.atan2(dx, dz)
    }
    sync.current += delta
    if (sync.current >= 0.1) {
      sync.current = 0
      onPositionChange(next.x, next.z)
      setVisualPosition({ x: next.x, z: next.z })
      if (next.phase === 'chase' && nextCombat.stage !== 'chase') setCombatView(nextCombat)
    }
    if (nextCombat.stage !== previousCombat.stage || nextCombat.score !== previousCombat.score || nextCombat.holder !== previousCombat.holder) {
      setCombatView(nextCombat)
    }
  })

  return (
    <>
      {phase !== 'chase' && <Portal elapsed={portalElapsed} paused={paused} />}
      {phase === 'chase' && combatView.stage === 'escape' && <Portal elapsed={combatView.elapsed} paused={paused} position={visualPosition} />}
      {phase === 'chase' && combatView.stage === 'reappear' && combatView.portal && <Portal elapsed={PORTAL_SECONDS} paused={paused} position={combatView.portal} />}
      {combatView.drop && <DroppedRam at={combatView.drop} paused={paused} />}
      {combatView.stage === 'stunned' && <Html position={[visualPosition.x, 2.3, visualPosition.z]} center distanceFactor={13} style={{ pointerEvents: 'none' }}><span className="hit-label">★ ★ ★</span></Html>}
      <group ref={actor} position={[SAM_START.x, 0, SAM_START.z]}>
        <Suspense fallback={null}>
          <Character id="character.sam" motion={phase === 'portal' ? 'idle' : phase === 'steal' ? 'interact' : phase !== 'chase' || combatView.stage === 'chase' ? 'run' : combatView.stage === 'stunned' && combatView.elapsed < 0.6 ? 'hit' : 'idle'} paused={paused} carryingRam={phase === 'chase' && combatView.holder === 'sam'} onLoaded={onLoaded} />
        </Suspense>
      </group>
    </>
  )
}

function Player({ pressed, attackRequests, facingRef, paused, motion, onMotionChange, onModelLoaded, onPositionChange, encounterPhase }: PlayerSceneProps) {
  const body = useRef<RapierRigidBody>(null)
  const visual = useRef<Group>(null)
  const { camera } = useThree()
  const { rapier, world } = useRapier()
  const cameraTarget = useRef(new Vector3(0, 1, 0))
  const cameraDestination = useRef(new Vector3())
  const lookDestination = useRef(new Vector3())
  const cameraDirection = useRef(new Vector3())
  const cameraRay = useRef(new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }))
  const wantedMotion = useRef<Motion>('idle')
  const positionSync = useRef(0)
  const lastAttack = useRef(0)
  const attackTime = useRef(0)
  const [attacking, setAttacking] = useState(false)

  useBeforePhysicsStep(() => {
    const rigidBody = body.current
    if (!rigidBody || paused) return
    const desired = movementVelocity(pressed.current)
    const vertical = rigidBody.linvel().y
    rigidBody.setLinvel({ x: desired.x, y: vertical, z: desired.z }, true)
    if (desired.motion !== wantedMotion.current) {
      wantedMotion.current = desired.motion
      onMotionChange(desired.motion)
    }
  })

  useEffect(() => {
    if (paused && body.current) {
      body.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      wantedMotion.current = 'idle'
      onMotionChange('idle')
    }
  }, [paused, onMotionChange])

  useFrame((_, delta) => {
    if (!paused && attackRequests.current !== lastAttack.current) {
      lastAttack.current = attackRequests.current
      attackTime.current = 0.6
      setAttacking(true)
    }
    if (!paused && attackTime.current > 0) {
      attackTime.current -= delta
      if (attackTime.current <= 0) setAttacking(false)
    }
    const position = body.current?.translation()
    if (!position) return
    positionSync.current += delta
    if (positionSync.current >= 0.1) {
      positionSync.current = 0
      onPositionChange(position.x, position.y, position.z)
    }
    const smoothing = 1 - Math.exp(-8 * Math.min(delta, 0.1))
    lookDestination.current.set(position.x, position.y + 0.65, position.z)
    cameraDestination.current.set(position.x, position.y + 2.6, position.z + 5.5)
    cameraDirection.current.subVectors(cameraDestination.current, lookDestination.current)
    const distance = cameraDirection.current.length()
    cameraDirection.current.divideScalar(distance)
    cameraRay.current.origin = lookDestination.current
    cameraRay.current.dir = cameraDirection.current
    const hit = world.castRay(cameraRay.current, distance, true, undefined, undefined, undefined, body.current ?? undefined)
    if (hit) cameraDestination.current.copy(lookDestination.current).addScaledVector(cameraDirection.current, Math.max(1.1, hit.timeOfImpact - 0.35))
    camera.position.lerp(cameraDestination.current, smoothing)
    cameraTarget.current.lerp(lookDestination.current, smoothing)
    camera.lookAt(cameraTarget.current)

    const desired = movementVelocity(pressed.current)
    if (visual.current && desired.motion === 'run' && !paused) {
      const heading = Math.atan2(desired.x, desired.z)
      const difference = Math.atan2(Math.sin(heading - visual.current.rotation.y), Math.cos(heading - visual.current.rotation.y))
      visual.current.rotation.y += difference * (1 - Math.exp(-12 * Math.min(delta, 0.1)))
    }
    if (visual.current) facingRef.current = visual.current.rotation.y
  })

  return (
    <RigidBody ref={body} colliders={false} position={[0, BODY_HEIGHT, 0]} lockRotations ccd>
      <CapsuleCollider args={[0.55, 0.32]} />
      <group ref={visual} position={[0, -BODY_HEIGHT, 0]} rotation={[0, Math.PI, 0]}>
        <Suspense fallback={null}>
          <Character id="character.player" motion={attacking ? 'attack' : motion} paused={paused} carryingRam={encounterPhase !== 'chase'} holdingBat={encounterPhase === 'chase'} onLoaded={onModelLoaded} />
        </Suspense>
      </group>
    </RigidBody>
  )
}

export function PlayerScene(props: PlayerSceneProps) {
  return (
    <>
      <color attach="background" args={['#a8d7ed']} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[20, 45, 12]} intensity={2.1} />
      <Physics gravity={[0, -9.81, 0]} paused={props.paused || props.encounterPhase !== 'chase'}>
        <CityColliders />
        <Suspense fallback={null}>
          <CityLayout onLoaded={props.onCityLoaded} />
        </Suspense>
        <Player {...props} paused={props.paused || props.encounterPhase !== 'chase'} />
        <RamSam paused={props.paused} sceneReady={props.sceneReady} onLoaded={props.onSamLoaded} onEncounterPhaseChange={props.onEncounterPhaseChange} onPositionChange={props.onSamPositionChange} onCombatChange={props.onCombatChange} onAttackResult={props.onAttackResult} attackRequests={props.attackRequests} facingRef={props.facingRef} playerPosition={props.playerPosition} />
      </Physics>
    </>
  )
}
