import { Component, useCallback, useEffect, useRef, useState, type ErrorInfo, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import type { Group } from 'three'
import { PlayerScene } from './scene/PlayerScene'
import type { Motion } from './game/player/movement'

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
  const [paused, setPaused] = useState(false)
  const [motion, setMotion] = useState<Motion>('idle')
  const [position, setPosition] = useState<[number, number, number]>([0, 0.87, 0])
  const pressed = useRef(new Set<string>())
  const [inspection, setInspection] = useState('')
  const [preview, setPreview] = useState<Group | null>(null)
  const onModelLoaded = useCallback(() => setModelReady(true), [])
  const onCityLoaded = useCallback(() => setCityReady(true), [])
  const onPositionChange = useCallback((x: number, y: number, z: number) => setPosition([x, y, z]), [])

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
        <p>{inspectionMode ? 'Approved asset inspection' : 'Phase 3 city preview'}</p>
      </header>
      {!started ? (
        <div className="overlay">
          <p>Explore the placeholder chase map.</p>
          <button type="button" onClick={() => setStarted(true)}>Explore city</button>
        </div>
      ) : (
        <SceneErrorBoundary>
          {(!ready || (!inspectionMode && (!modelReady || !cityReady))) && <p className="loading" role="status">Loading scene…</p>}
          <Canvas
            aria-label={inspectionMode ? 'Approved asset inspection scene' : '3D placeholder city'}
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
              <PlayerScene pressed={pressed} paused={paused} motion={motion} onMotionChange={setMotion} onModelLoaded={onModelLoaded} onCityLoaded={onCityLoaded} onPositionChange={onPositionChange} />
            )}
          </Canvas>
          {!inspectionMode && (
            <aside className="controls">
              <p>WASD or arrow keys to explore · Esc to pause</p>
              <p>State: {paused ? 'Paused' : motion === 'run' ? 'Running' : 'Idle'}</p>
              <p data-testid="player-position">Position: {position.map((value) => value.toFixed(1)).join(', ')}</p>
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
