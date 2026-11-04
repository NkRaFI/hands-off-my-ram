import { useCallback, useEffect, useMemo } from 'react'
import { Html, useGLTF } from '@react-three/drei'
import { BallCollider, CuboidCollider, RigidBody } from '@react-three/rapier'
import { InstancedMesh, Matrix4, Mesh, Object3D, Quaternion, Vector3 } from 'three'
import { assetUrl } from '../../game/assets/asset-manifest'
import {
  buildingModels, cityBuildings, CITY_LIMIT, landmarks, ROAD_LINES, type CityModelId,
} from '../../game/city/map'

const cityModelIds = [
  'city.building.large', 'city.building.medium', 'city.building.small',
  'city.street.straight', 'city.street.t', 'city.street.cross', 'city.street.curve',
  'city.sidewalk.straight', 'city.sidewalk.corner', 'city.prop.bollard', 'city.prop.planter',
] as const satisfies readonly CityModelId[]

const cityUrls = cityModelIds.map(assetUrl)
const segmentCenters = [-20, 20]
const planterPositions = [-7.5, 7.5].flatMap((x) => [-7.5, 7.5].map((z) => [x, z] as const))
const bollardPositions = [-22, 22].flatMap((at) => [
  [-7.5, at], [7.5, at], [at, -7.5], [at, 7.5],
] as const)

type Placement = {
  position: [number, number, number]
  rotation: number
  scale: [number, number, number]
  offset: [number, number, number]
}

function placement(position: Placement['position'], rotation = 0, scale: Placement['scale'] = [1, 1, 1], offset: Placement['offset'] = [0, 0, 0]): Placement {
  return { position, rotation, scale, offset }
}

const cityPlacements = cityModelIds.reduce((result, id) => {
  result[id] = []
  return result
}, {} as Record<CityModelId, Placement[]>)
function add(id: CityModelId, item: Placement) { cityPlacements[id].push(item) }

for (const line of ROAD_LINES) for (const center of segmentCenters) {
  add('city.street.straight', placement([line, 0.16, center], 0, [2, 1, 28 / 12]))
  add('city.street.straight', placement([center, 0.16, line], Math.PI / 2, [2, 1, 28 / 12]))
  for (const side of [-7.5, 7.5]) {
    add('city.sidewalk.straight', placement([line + side, 0.04, center], 0, [1, 1, 28 / 3]))
    add('city.sidewalk.straight', placement([center, 0.04, line + side], Math.PI / 2, [1, 1, 28 / 3]))
  }
}
add('city.street.cross', placement([0, 0.16, 0], 0, [0.5, 1, 0.5]))
for (const site of [
  { x: 0, z: -40, rotation: 0 }, { x: 40, z: 0, rotation: Math.PI / 2 },
  { x: 0, z: 40, rotation: Math.PI }, { x: -40, z: 0, rotation: -Math.PI / 2 },
]) add('city.street.t', placement([site.x, 0.16, site.z], site.rotation, [0.5, 1, 0.5], [0, 0, 1.665]))
for (const site of [
  { x: -40, z: -40, rotation: 0 }, { x: 40, z: -40, rotation: -Math.PI / 2 },
  { x: -40, z: 40, rotation: Math.PI / 2 }, { x: 40, z: 40, rotation: Math.PI },
]) add('city.street.curve', placement([site.x, 0.16, site.z], site.rotation, [1, 1, 1], [-6, 0, -6]))
for (const [x, z] of planterPositions) add('city.prop.planter', placement([x, 0.04, z]))
for (const [x, z] of bollardPositions) add('city.prop.bollard', placement([x, 0.04, z]))
for (const x of [-7.5, 7.5]) for (const z of [-7.5, 7.5]) add('city.sidewalk.corner', placement([x, 0.04, z]))
for (const building of cityBuildings) {
  const spec = buildingModels[building.model]
  add(building.model, placement([building.position[0], 0, building.position[1]], building.rotation, [1, 1, 1], [-spec.sourceCenter[0], 0, -spec.sourceCenter[1]]))
}

function CityBatchPart({ source, placements }: { source: Mesh; placements: Placement[] }) {
  const matrices = useMemo(() => placements.map((item) => {
    const transform = new Matrix4().compose(
      new Vector3(...item.position),
      new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), item.rotation),
      new Vector3(...item.scale),
    )
    return transform.multiply(new Matrix4().makeTranslation(...item.offset)).multiply(source.matrixWorld)
  }), [source, placements])
  const setMesh = useCallback((mesh: InstancedMesh | null) => {
    if (!mesh) return
    matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix))
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [matrices])
  return <instancedMesh args={[source.geometry, source.material, placements.length]} ref={setMesh} />
}

function CityInstances({ model, placements }: { model: Object3D; placements: Placement[] }) {
  const meshes = useMemo(() => {
    const layout = model.clone(true)
    layout.updateMatrixWorld(true)
    const result: Mesh[] = []
    layout.traverse((object) => { if (object instanceof Mesh) result.push(object) })
    return result
  }, [model])
  return meshes.map((mesh, index) => <CityBatchPart key={index} source={mesh} placements={placements} />)
}

function CityGeometry({ models }: { models: Record<CityModelId, Object3D> }) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[CITY_LIMIT * 2, CITY_LIMIT * 2]} />
        <meshStandardMaterial color="#b8c9bb" />
      </mesh>
      {cityModelIds.map((id) => <CityInstances key={id} model={models[id]} placements={cityPlacements[id]} />)}
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
      {planterPositions.map(([x, z]) => (
        <CuboidCollider key={`planter-${x}-${z}`} args={[1, 0.3, 1]} position={[x, 0.3, z]} />
      ))}
      {bollardPositions.map(([x, z]) => (
        <BallCollider key={`bollard-${x}-${z}`} args={[0.12]} position={[x, 0.48, z]} />
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
