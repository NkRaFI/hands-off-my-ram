import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { CapsuleCollider, Physics, RigidBody, useBeforePhysicsStep, useRapier, type RapierRigidBody } from '@react-three/rapier'
import { AnimationMixer, Box3, Group, Vector3 } from 'three'
import { assetUrl } from '../game/assets/asset-manifest'
import { movementVelocity, type Motion } from '../game/player/movement'
import { advanceEncounter, initialEncounter, PORTAL_SECONDS, SAM_START, type EncounterPhase } from '../game/ram-sam/encounter'
import { CityColliders, CityLayout } from './city/CityLayout'

const BODY_HEIGHT = 0.87
const IDLE_CLIP = 'CharacterArmature|Idle'
const RUN_CLIP = 'CharacterArmature|Run'
const INTERACT_CLIP = 'CharacterArmature|Interact'

type PlayerSceneProps = {
  pressed: RefObject<Set<string>>
  paused: boolean
  motion: Motion
  onMotionChange: (motion: Motion) => void
  onModelLoaded: () => void
  onCityLoaded: () => void
  onSamLoaded: () => void
  onPositionChange: (x: number, y: number, z: number) => void
  encounterPhase: EncounterPhase
  onEncounterPhaseChange: (phase: EncounterPhase) => void
  onSamPositionChange: (x: number, z: number) => void
  sceneReady: boolean
}

function Character({ id, motion, paused, carryingRam, onLoaded }: { id: 'character.player' | 'character.sam'; motion: Motion | 'interact'; paused: boolean; carryingRam: boolean; onLoaded?: () => void }) {
  const character = useGLTF(assetUrl(id))
  const mixer = useMemo(() => new AnimationMixer(character.scene), [character.scene])
  const wrist = useMemo(() => {
    // GLTFLoader strips the dot from the source bone name `Wrist.R`.
    const bone = character.scene.getObjectByName('WristR')
    if (!bone) throw new Error(`Missing right wrist on approved character: ${id}`)
    return bone
  }, [character.scene, id])

  useEffect(() => { onLoaded?.() }, [onLoaded])

  useEffect(() => {
    const name = motion === 'run' ? RUN_CLIP : motion === 'interact' ? INTERACT_CLIP : IDLE_CLIP
    const clip = character.animations.find((item) => item.name === name)
    if (!clip) throw new Error(`Missing approved animation clip: ${name}`)
    const action = mixer.clipAction(clip)
    action.reset().fadeIn(0.18).play()
    return () => { action.fadeOut(0.18) }
  }, [character.animations, mixer, motion])

  useFrame((_, delta) => { if (!paused) mixer.update(Math.min(delta, 0.1)) })

  return <>
    <primitive object={character.scene} />
    {carryingRam && createPortal(
      <group position={[0, 0.0007, 0]} scale={0.01}>
        <RamProp />
      </group>, wrist,
    )}
  </>
}

function RamProp() {
  const model = useGLTF(assetUrl('prop.ram'))
  const scene = useMemo(() => {
    const scene = model.scene.clone(true)
    const bounds = new Box3().setFromObject(scene)
    const size = bounds.getSize(new Vector3())
    const center = bounds.getCenter(new Vector3())
    const scale = 0.34 / Math.max(size.x, size.y, size.z, 0.001)
    scene.scale.setScalar(scale)
    scene.position.copy(center).multiplyScalar(-scale)
    return scene
  }, [model.scene])
  return <group rotation={[0.2, 0, -0.3]}><primitive object={scene} /></group>
}

function Portal({ elapsed, paused }: { elapsed: number; paused: boolean }) {
  const ring = useRef<Group>(null)
  useFrame((_, delta) => {
    if (!ring.current || paused) return
    ring.current.rotation.z += delta * 1.8
    ring.current.scale.setScalar(Math.min(1, 0.15 + elapsed / PORTAL_SECONDS))
  })
  return (
    <group ref={ring} position={[SAM_START.x, 1.45, SAM_START.z]}>
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

function RamSam({ paused, sceneReady, onLoaded, onPhaseChange, onPositionChange }: { paused: boolean; sceneReady: boolean; onLoaded: () => void; onPhaseChange: (phase: EncounterPhase) => void; onPositionChange: (x: number, z: number) => void }) {
  const state = useRef(initialEncounter())
  const actor = useRef<Group>(null)
  const [phase, setPhase] = useState<EncounterPhase>('portal')
  const [portalElapsed, setPortalElapsed] = useState(0)
  const sync = useRef(0)

  useFrame((_, delta) => {
    if (paused || !sceneReady) return
    const previous = state.current
    const next = advanceEncounter(previous, Math.min(delta, 0.1))
    state.current = next
    if (next.phase !== previous.phase) {
      setPhase(next.phase)
      onPhaseChange(next.phase)
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
    }
  })

  return (
    <>
      {phase !== 'chase' && <Portal elapsed={portalElapsed} paused={paused} />}
      <group ref={actor} position={[SAM_START.x, 0, SAM_START.z]}>
        <Suspense fallback={null}>
          <Character id="character.sam" motion={phase === 'portal' ? 'idle' : phase === 'steal' ? 'interact' : 'run'} paused={paused} carryingRam={phase === 'chase'} onLoaded={onLoaded} />
        </Suspense>
      </group>
    </>
  )
}

function Player({ pressed, paused, motion, onMotionChange, onModelLoaded, onPositionChange, encounterPhase }: PlayerSceneProps) {
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
  })

  return (
    <RigidBody ref={body} colliders={false} position={[0, BODY_HEIGHT, 0]} lockRotations ccd>
      <CapsuleCollider args={[0.55, 0.32]} />
      <group ref={visual} position={[0, -BODY_HEIGHT, 0]} rotation={[0, Math.PI, 0]}>
        <Suspense fallback={null}>
          <Character id="character.player" motion={motion} paused={paused} carryingRam={encounterPhase !== 'chase'} onLoaded={onModelLoaded} />
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
        <RamSam paused={props.paused} sceneReady={props.sceneReady} onLoaded={props.onSamLoaded} onPhaseChange={props.onEncounterPhaseChange} onPositionChange={props.onSamPositionChange} />
      </Physics>
    </>
  )
}
