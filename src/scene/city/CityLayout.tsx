import { useCallback, useEffect, useMemo } from 'react'
import { Html, useGLTF } from '@react-three/drei'
import { BallCollider, CuboidCollider, RigidBody } from '@react-three/rapier'
import { DoubleSide, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from 'three'
import { assetUrl } from '../../game/assets/asset-manifest'
import {
  buildingModels, cityBuildings, CITY_LIMIT, landmarks, ROAD_LINES, type CityModelId,
} from '../../game/city/map'

const cityModelIds = [
  'city.kenney.building.large', 'city.kenney.building.medium', 'city.kenney.building.small',
  'city.kenney.building.tall', 'city.kenney.road.straight', 'city.kenney.road.crossroad',
  'city.kenney.road.intersection', 'city.kenney.road.bend', 'city.kenney.road.crossing',
  'city.kenney.road.tile', 'city.kenney.road.lamp', 'city.kenney.road.traffic-light',
  'city.kenney.nature.tree', 'city.kenney.nature.tree-fat', 'city.kenney.nature.bush',
] as const satisfies readonly CityModelId[]

const cityUrls = cityModelIds.map(assetUrl)
const segmentCenters = [-30, -20, -10, 10, 20, 30]
const lampPositions = [-6, 6].flatMap((x) => [-6, 6].map((z) => [x, z] as const))
const outerLampPositions = [-34, 34].flatMap((x) => [-34, 34].map((z) => [x, z] as const))
const TREE_SCALE = 5
// Kenney tiles are 0.02 units thick; only their footprint needs tenfold scaling.
const ROAD_SCALE: [number, number, number] = [10, 1, 10]
const ROAD_BASE_Y = 0.02

type Placement = {
  position: [number, number, number]
  rotation: number
  scale: [number, number, number]
}

function placement(position: Placement['position'], rotation = 0, scale: Placement['scale'] = [1, 1, 1]): Placement {
  return { position, rotation, scale }
}

const cityPlacements = cityModelIds.reduce((result, id) => {
  result[id] = []
  return result
}, {} as Record<CityModelId, Placement[]>)
function add(id: CityModelId, item: Placement) { cityPlacements[id].push(item) }

for (const line of ROAD_LINES) for (const center of segmentCenters) {
  const verticalId = line === 0 && center === -10 ? 'city.kenney.road.crossing' : 'city.kenney.road.straight'
  add(verticalId, placement([line, ROAD_BASE_Y, center], 0, ROAD_SCALE))
  add('city.kenney.road.straight', placement([center, ROAD_BASE_Y, line], Math.PI / 2, ROAD_SCALE))
}
add('city.kenney.road.crossroad', placement([0, ROAD_BASE_Y, 0], 0, ROAD_SCALE))
for (const site of [
  { x: 0, z: -40, rotation: 0 }, { x: 40, z: 0, rotation: Math.PI / 2 },
  { x: 0, z: 40, rotation: Math.PI }, { x: -40, z: 0, rotation: -Math.PI / 2 },
]) add('city.kenney.road.intersection', placement([site.x, ROAD_BASE_Y, site.z], site.rotation, ROAD_SCALE))
for (const site of [
  { x: -40, z: -40, rotation: 0 }, { x: 40, z: -40, rotation: -Math.PI / 2 },
  { x: -40, z: 40, rotation: Math.PI / 2 }, { x: 40, z: 40, rotation: Math.PI },
]) add('city.kenney.road.bend', placement([site.x, ROAD_BASE_Y, site.z], site.rotation, ROAD_SCALE))

// The Kenney paving tiles fill every block, including the plaza, without covering roads.
for (let x = -60; x <= 60; x += 10) for (let z = -60; z <= 60; z += 10) {
  if (ROAD_LINES.includes(x as -40 | 0 | 40) || ROAD_LINES.includes(z as -40 | 0 | 40)) continue
  add('city.kenney.road.tile', placement([x, ROAD_BASE_Y, z], 0, ROAD_SCALE))
}

for (const [x, z] of [...lampPositions, ...outerLampPositions]) {
  add('city.kenney.road.lamp', placement([x, 0.02, z], Math.PI / 2, [7, 7, 7]))
}
add('city.kenney.road.traffic-light', placement([6, 0.02, -34], 0, [7, 7, 7]))
for (const [x, z] of [[-54, -54], [54, -54], [-54, 54], [54, 54], [-60, 0], [60, 0]]) {
  add('city.kenney.nature.tree', placement([x, 0.27, z], 0, [TREE_SCALE, TREE_SCALE, TREE_SCALE]))
}
for (const [x, z] of [[-60, -60], [60, 60]]) {
  add('city.kenney.nature.tree-fat', placement([x, 0.32, z], 0, [6, 6, 6]))
}
for (const x of [-8, 8]) for (const z of [-8, 8]) {
  add('city.kenney.nature.bush', placement([x, 0.17, z], 0, [3, 3, 3]))
}
for (const building of cityBuildings) {
  add(building.model, placement([building.position[0], 0.02, building.position[1]], building.rotation, [10, 10, 10]))
}

function CityBatchPart({ source, placements, bush }: { source: Mesh; placements: Placement[]; bush: boolean }) {
  const material = useMemo(() => {
    if (!bush || !(source.material instanceof MeshStandardMaterial)) return source.material
    const result = source.material.clone()
    result.metalness = 0
    result.side = DoubleSide
    return result
  }, [source.material, bush])
  const matrices = useMemo(() => placements.map((item) => {
    const transform = new Matrix4().compose(
      new Vector3(...item.position),
      new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), item.rotation),
      new Vector3(...item.scale),
    )
    return transform.multiply(source.matrixWorld)
  }), [source, placements])
  const setMesh = useCallback((mesh: InstancedMesh | null) => {
    if (!mesh) return
    matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix))
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [matrices])
  return <instancedMesh args={[source.geometry, material, placements.length]} ref={setMesh} />
}

function CityInstances({ model, placements, bush }: { model: Object3D; placements: Placement[]; bush: boolean }) {
  const meshes = useMemo(() => {
    const layout = model.clone(true)
    layout.updateMatrixWorld(true)
    const result: Mesh[] = []
    layout.traverse((object) => { if (object instanceof Mesh) result.push(object) })
    return result
  }, [model])
  return meshes.map((mesh, index) => <CityBatchPart key={index} source={mesh} placements={placements} bush={bush} />)
}

function CityGeometry({ models }: { models: Record<CityModelId, Object3D> }) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[CITY_LIMIT * 2, CITY_LIMIT * 2]} />
        <meshStandardMaterial color="#cce8b8" />
      </mesh>
      {cityModelIds.map((id) => <CityInstances key={id} model={models[id]} placements={cityPlacements[id]} bush={id === 'city.kenney.nature.bush'} />)}
      {landmarks.map((site) => (
        <Html key={site.id} position={site.signPosition} center distanceFactor={18} style={{ pointerEvents: 'none' }}>
          <span className="landmark-label">{site.label}</span>
        </Html>
      ))}
    </>
  )
}

export function CityColliders() {
  const edge = CITY_LIMIT
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[edge, 0.1, edge]} position={[0, -0.1, 0]} />
      <CuboidCollider args={[0.5, 2, edge + 0.5]} position={[edge + 0.5, 2, 0]} />
      <CuboidCollider args={[0.5, 2, edge + 0.5]} position={[-edge - 0.5, 2, 0]} />
      <CuboidCollider args={[edge + 0.5, 2, 0.5]} position={[0, 2, edge + 0.5]} />
      <CuboidCollider args={[edge + 0.5, 2, 0.5]} position={[0, 2, -edge - 0.5]} />
      {cityBuildings.map((building) => {
        const spec = buildingModels[building.model]
        return (
          <CuboidCollider
            key={building.id}
            args={[spec.width / 2, spec.height / 2, spec.depth / 2]}
            position={[building.position[0], spec.height / 2, building.position[1]]}
            rotation={[0, building.rotation, 0]}
          />
        )
      })}
      {[...lampPositions, ...outerLampPositions].map(([x, z]) => (
        <BallCollider key={`lamp-${x}-${z}`} args={[0.25]} position={[x, 0.25, z]} />
      ))}
    </RigidBody>
  )
}

export function CityLayout({ onLoaded }: { onLoaded: () => void }) {
  const files = useGLTF(cityUrls)
  const models = useMemo(() => cityModelIds.reduce((result, id, index) => {
    result[id] = files[index].scene
    return result
  }, {} as Record<CityModelId, Object3D>), [files])
  useEffect(() => onLoaded(), [onLoaded])

  return (
    <CityGeometry models={models} />
  )
}
