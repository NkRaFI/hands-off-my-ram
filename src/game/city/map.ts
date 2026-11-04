import type { AssetId } from '../assets/asset-manifest'

export const CITY_LIMIT = 70
export const ROAD_LINES = [-40, 0, 40] as const
export const ROAD_HALF_WIDTH = 5
export const SIDEWALK_WIDTH = 3

export type CityModelId = Extract<AssetId, `city.kenney.${string}`>
export type BuildingModelId = Extract<CityModelId, `city.kenney.building.${string}`>

export const buildingModels: Record<BuildingModelId, { width: number; depth: number; height: number }> = {
  'city.kenney.building.large': { width: 23.2, depth: 18.2, height: 24.8 },
  'city.kenney.building.medium': { width: 20.84, depth: 13.4, height: 16.93 },
  'city.kenney.building.small': { width: 8.84, depth: 9.4, height: 12.93 },
  'city.kenney.building.tall': { width: 13.6, depth: 13.6, height: 28.8 },
}

export type RoadNode = `${number},${number}`
export const nodeId = (x: number, z: number): RoadNode => `${x},${z}`

export const roadNodes = ROAD_LINES.flatMap((x) => ROAD_LINES.map((z) => nodeId(x, z)))
export const roadEdges = roadNodes.flatMap((id) => {
  const [x, z] = id.split(',').map(Number)
  return [nodeId(x + 40, z), nodeId(x, z + 40)].filter((next) => roadNodes.includes(next))
    .map((next) => [id, next] as const)
})

export type Landmark = {
  id: string
  label: string
  model: BuildingModelId
  position: [number, number]
  rotation: number
  access: [RoadNode, RoadNode]
  signPosition: [number, number, number]
}

export const landmarks: Landmark[] = [
  { id: 'data-centre', label: 'RamAI Data Centre', model: 'city.kenney.building.large', position: [-20, -20], rotation: 0, access: [nodeId(-40, 0), nodeId(0, -40)], signPosition: [-20, 5, -20] },
  { id: 'electronics', label: 'Electronics Shop', model: 'city.kenney.building.small', position: [20, -20], rotation: 0, access: [nodeId(0, -40), nodeId(40, 0)], signPosition: [20, 5, -20] },
  { id: 'cafe', label: 'Local AI Café', model: 'city.kenney.building.small', position: [-20, 20], rotation: Math.PI, access: [nodeId(-40, 0), nodeId(0, 40)], signPosition: [-20, 5, 20] },
  { id: 'gaming', label: 'Gaming Venue', model: 'city.kenney.building.medium', position: [20, 20], rotation: Math.PI, access: [nodeId(40, 0), nodeId(0, 40)], signPosition: [20, 5, 20] },
  { id: 'residential', label: 'Residential Area', model: 'city.kenney.building.small', position: [56, 20], rotation: Math.PI, access: [nodeId(40, 0), nodeId(40, 40)], signPosition: [56, 5, 20] },
]

export const backgroundBuildings: Array<Pick<Landmark, 'id' | 'model' | 'position' | 'rotation'>> = [
  { id: 'west-block', model: 'city.kenney.building.small', position: [-56, 20], rotation: Math.PI },
  { id: 'north-block', model: 'city.kenney.building.tall', position: [0, -56], rotation: 0 },
  { id: 'south-block', model: 'city.kenney.building.tall', position: [0, 56], rotation: Math.PI },
  { id: 'east-block', model: 'city.kenney.building.small', position: [56, -20], rotation: 0 },
]

export const cityBuildings = [...landmarks, ...backgroundBuildings]

export const portalCandidateZones = [
  { id: 'plaza', position: [0, 0] as const, radius: 3.5 },
  { id: 'north-west', position: [-40, -40] as const, radius: 3.5 },
  { id: 'south-east', position: [40, 40] as const, radius: 3.5 },
] as const

export function reachableNodes(start: RoadNode, removedEdge?: readonly [RoadNode, RoadNode]): Set<RoadNode> {
  const reached = new Set<RoadNode>([start])
  const queue = [start]
  for (const current of queue) {
    for (const [a, b] of roadEdges) {
      if (removedEdge && ((a === removedEdge[0] && b === removedEdge[1]) || (a === removedEdge[1] && b === removedEdge[0]))) continue
      const next = a === current ? b : b === current ? a : null
      if (next && !reached.has(next)) { reached.add(next); queue.push(next) }
    }
  }
  return reached
}
