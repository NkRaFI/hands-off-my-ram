import { Component, useCallback, useEffect, useRef, useState, type ErrorInfo, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import type { Group } from 'three'
import { PlayerScene } from './scene/PlayerScene'
import type { Motion } from './game/player/movement'
import { SAM_START, type EncounterPhase } from './game/ram-sam/encounter'

const MOVEMENT_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'])

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Scene failed to load', error, info)
  }

  render() {
    return this.state.failed ? (
      <p role="alert">The 3D scene could not start. Check that WebGL is enabled and reload.</p>
    ) : this.props.children
  }
}

export default function App() {
  const inspectionMode = new URLSearchParams(window.location.search).has('inspect')
  const [started, setStarted] = useState(inspectionMode)
  const [ready, setReady] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const [cityReady, setCityReady] = useState(false)
  const [samReady, setSamReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [motion, setMotion] = useState<Motion>('idle')
  const [position, setPosition] = useState<[number, number, number]>([0, 0.87, 0])
  const [encounterPhase, setEncounterPhase] = useState<EncounterPhase>('portal')
  const [samPosition, setSamPosition] = useState<[number, number]>([SAM_START.x, SAM_START.z])
  const pressed = useRef(new Set<string>())
  const [inspection, setInspection] = useState('')
  const [preview, setPreview] = useState<Group | null>(null)
  const onModelLoaded = useCallback(() => setModelReady(true), [])
  const onCityLoaded = useCallback(() => setCityReady(true), [])
  const onSamLoaded = useCallback(() => setSamReady(true), [])
  const onPositionChange = useCallback((x: number, y: number, z: number) => setPosition([x, y, z]), [])
  const onSamPositionChange = useCallback((x: number, z: number) => setSamPosition([x, z]), [])
  const direction = Math.atan2(samPosition[0] - position[0], position[2] - samPosition[1]) * 180 / Math.PI
  const distance = Math.hypot(samPosition[0] - position[0], samPosition[1] - position[2])

  useEffect(() => {
    if (!started || inspectionMode) return
    const pressedKeys = pressed.current
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        pressedKeys.clear()
        setPaused((wasPaused) => !wasPaused)
      } else if (MOVEMENT_KEYS.has(event.code)) {
        event.preventDefault()
        if (!paused) pressedKeys.add(event.code)
      }
    }
    const onKeyUp = (event: KeyboardEvent) => pressedKeys.delete(event.code)
    const onBlur = () => { pressedKeys.clear(); setPaused(true) }
    const onVisibility = () => { if (document.hidden) onBlur() }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVisibility)
      pressedKeys.clear()
    }
  }, [started, inspectionMode, paused])

  async function runInspection() {
    setInspection('Checking approved assets…')
    const { inspectAssets } = await import('./game/assets/inspect-assets')
    const errors = await inspectAssets(
      (done, total, id) => setInspection(`Checking ${done}/${total}: ${id}`),
      setPreview,
    )
    setInspection(errors.length ? `Asset errors: ${errors.join('; ')}` : 'All approved runtime assets loaded successfully.')
  }

  return (
    <main className="app">
      <header className="status">
        <h1>Hands Off My RAM!</h1>
        <p>{inspectionMode ? 'Approved asset inspection' : 'Opening theft and chase'}</p>
      </header>
      {!started ? (
        <div className="overlay">
          <p>Ram Sam is coming for your RAM.</p>
          <button type="button" onClick={() => setStarted(true)}>Start chase</button>
        </div>
      ) : (
        <SceneErrorBoundary>
          {(!ready || (!inspectionMode && (!modelReady || !cityReady || !samReady))) && <p className="loading" role="status">Loading scene…</p>}
          <Canvas
            aria-label={inspectionMode ? 'Approved asset inspection scene' : '3D RAM chase city'}
            camera={{ position: [0, 3.5, 5.5], fov: 50 }}
            dpr={[1, 2]}
            onCreated={() => setReady(true)}
          >
            {inspectionMode ? (
              <>
                <color attach="background" args={['#a8d7ed']} />
                <ambientLight intensity={1.4} />
                <directionalLight position={[5, 9, 4]} intensity={2} />
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                  <planeGeometry args={[40, 40]} />
                  <meshStandardMaterial color="#7cbf89" />
                </mesh>
                <gridHelper args={[40, 40, '#73a982', '#73a982']} position={[0, 0.01, 0]} />
                {preview && <primitive object={preview} />}
              </>
            ) : (
              <PlayerScene pressed={pressed} paused={paused} motion={motion} onMotionChange={setMotion} onModelLoaded={onModelLoaded} onCityLoaded={onCityLoaded} onSamLoaded={onSamLoaded} onPositionChange={onPositionChange} encounterPhase={encounterPhase} onEncounterPhaseChange={setEncounterPhase} onSamPositionChange={onSamPositionChange} sceneReady={modelReady && cityReady && samReady} />
            )}
          </Canvas>
          {!inspectionMode && (
            <aside className="direction-indicator" aria-label={`Ram Sam ${Math.round(distance)} metres away`}>
              <span className="direction-arrow" style={{ transform: `rotate(${direction}deg)` }}>↑</span>
              <span>{encounterPhase === 'chase' ? `Chase Ram Sam · ${Math.round(distance)} m` : encounterPhase === 'steal' ? 'Ram Sam is grabbing your RAM!' : 'Ram Sam is opening a portal…'}</span>
            </aside>
          )}
          {!inspectionMode && (
            <aside className="controls">
              <p>{encounterPhase === 'chase' ? 'WASD or arrow keys to chase · Esc to pause' : 'Ram Sam is stealing your RAM…'}</p>
              <p>State: {paused ? 'Paused' : motion === 'run' ? 'Running' : 'Idle'}</p>
              <p data-testid="player-position">Position: {position.map((value) => value.toFixed(1)).join(', ')}</p>
              <p data-testid="sam-position">Ram Sam: {samPosition.map((value) => value.toFixed(1)).join(', ')}</p>
              <p data-testid="encounter-phase">Encounter: {encounterPhase}</p>
              <p data-testid="ram-holder">RAM holder: {encounterPhase === 'chase' ? 'Ram Sam' : 'Player'}</p>
              <button type="button" onClick={() => { pressed.current.clear(); setPaused((value) => !value) }}>
                {paused ? 'Resume' : 'Pause'}
              </button>
            </aside>
          )}
          {paused && !inspectionMode && (
            <div className="pause-overlay">
              <p>Paused</p>
              <button type="button" onClick={() => setPaused(false)}>Resume movement</button>
            </div>
          )}
          {inspectionMode && (
            <aside className="inspection">
              <button type="button" onClick={runInspection}>Inspect approved assets</button>
              <p role="status">{inspection || 'Ready to inspect the approved runtime files.'}</p>
            </aside>
          )}
        </SceneErrorBoundary>
      )}
    </main>
  )
}
