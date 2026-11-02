import { Component, useState, type ErrorInfo, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import type { Group } from 'three'

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
  const [inspection, setInspection] = useState('')
  const [preview, setPreview] = useState<Group | null>(null)

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
        <p>Phase 1 scene preview</p>
      </header>
      {!started ? (
        <div className="overlay">
          <p>A local 3D comedy chase game is taking shape.</p>
          <button type="button" onClick={() => setStarted(true)}>Start scene</button>
        </div>
      ) : (
        <SceneErrorBoundary>
          {!ready && <p className="loading" role="status">Loading scene…</p>}
          <Canvas
            aria-label="Empty 3D scene"
            camera={{ position: [7, 6, 9], fov: 50 }}
            dpr={[1, 2]}
            onCreated={() => setReady(true)}
          >
            <color attach="background" args={['#a8d7ed']} />
            <ambientLight intensity={1.4} />
            <directionalLight position={[5, 9, 4]} intensity={2} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[40, 40]} />
              <meshStandardMaterial color="#7cbf89" />
            </mesh>
            <gridHelper args={[40, 40, '#73a982', '#73a982']} position={[0, 0.01, 0]} />
            {preview && <primitive object={preview} />}
          </Canvas>
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
