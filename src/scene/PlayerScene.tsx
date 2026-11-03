import { Suspense, useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { CapsuleCollider, CuboidCollider, Physics, RigidBody, useBeforePhysicsStep, type RapierRigidBody } from '@react-three/rapier'
import { AnimationMixer, Group, Vector3 } from 'three'
import { assetManifest, assetUrl } from '../game/assets/asset-manifest'
import { movementVelocity, TEST_AREA_HALF_SIZE, type Motion } from '../game/player/movement'

const BODY_HEIGHT = 0.87
const IDLE_CLIP = assetManifest['animation.idle'].clip
const RUN_CLIP = assetManifest['animation.jog'].clip

type PlayerSceneProps = {
  pressed: RefObject<Set<string>>
  paused: boolean
  motion: Motion
  onMotionChange: (motion: Motion) => void
  onModelLoaded: () => void
  onPositionChange: (x: number, y: number, z: number) => void
}

function Character({ motion, paused, onLoaded }: { motion: Motion; paused: boolean; onLoaded: () => void }) {
  const character = useGLTF(assetUrl('character.female'))
  const library = useGLTF(assetUrl('animation.core'))
  const mixer = useMemo(() => new AnimationMixer(character.scene), [character.scene])

  useEffect(() => onLoaded(), [onLoaded])

  useEffect(() => {
    const name = motion === 'run' ? RUN_CLIP : IDLE_CLIP
    const clip = library.animations.find((item) => item.name === name)
    if (!clip) throw new Error(`Missing approved animation clip: ${name}`)
    const action = mixer.clipAction(clip)
    action.reset().fadeIn(0.18).play()
    return () => { action.fadeOut(0.18) }
  }, [library.animations, mixer, motion])

  useFrame((_, delta) => { if (!paused) mixer.update(Math.min(delta, 0.1)) })

  return <primitive object={character.scene} />
}

function Player({ pressed, paused, motion, onMotionChange, onModelLoaded, onPositionChange }: PlayerSceneProps) {
  const body = useRef<RapierRigidBody>(null)
  const visual = useRef<Group>(null)
  const { camera } = useThree()
  const cameraTarget = useRef(new Vector3(0, 1, 0))
  const cameraDestination = useRef(new Vector3())
  const lookDestination = useRef(new Vector3())
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
    cameraDestination.current.set(position.x, position.y + 2.6, position.z + 5.5)
    camera.position.lerp(cameraDestination.current, smoothing)
    lookDestination.current.set(position.x, position.y + 0.65, position.z)
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
          <Character motion={motion} paused={paused} onLoaded={onModelLoaded} />
        </Suspense>
      </group>
    </RigidBody>
  )
}

function TestArea() {
  const edge = TEST_AREA_HALF_SIZE
  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[20, 0.1, 20]} position={[0, -0.1, 0]} />
        <CuboidCollider args={[0.5, 1.5, edge + 0.5]} position={[edge + 0.5, 1.5, 0]} />
        <CuboidCollider args={[0.5, 1.5, edge + 0.5]} position={[-edge - 0.5, 1.5, 0]} />
        <CuboidCollider args={[edge + 0.5, 1.5, 0.5]} position={[0, 1.5, edge + 0.5]} />
        <CuboidCollider args={[edge + 0.5, 1.5, 0.5]} position={[0, 1.5, -edge - 0.5]} />
      </RigidBody>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#7cbf89" />
      </mesh>
      <gridHelper args={[20, 20, '#659b75', '#659b75']} position={[0, 0.015, 0]} />
      {[edge, -edge].map((at) => (
        <group key={at}>
          <mesh position={[at, 0.025, 0]}>
            <boxGeometry args={[0.08, 0.03, edge * 2]} />
            <meshStandardMaterial color="#f4e8a0" />
          </mesh>
          <mesh position={[0, 0.025, at]}>
            <boxGeometry args={[edge * 2, 0.03, 0.08]} />
            <meshStandardMaterial color="#f4e8a0" />
          </mesh>
        </group>
      ))}
    </>
  )
}

export function PlayerScene(props: PlayerSceneProps) {
  return (
    <>
      <color attach="background" args={['#a8d7ed']} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[5, 9, 4]} intensity={2} />
      <Physics gravity={[0, -9.81, 0]} paused={props.paused}>
        <TestArea />
        <Player {...props} />
      </Physics>
    </>
  )
}
