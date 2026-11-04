import { describe, expect, it } from 'vitest'
import {
  buildingModels, cityBuildings, CITY_LIMIT, landmarks, nodeId, portalCandidateZones,
  reachableNodes, ROAD_HALF_WIDTH, ROAD_LINES, roadEdges, roadNodes, SIDEWALK_WIDTH,
} from './map'

describe('Kenney city layout', () => {
  it('keeps two road approaches open to every landmark even if one road link is blocked', () => {
    const plaza = nodeId(0, 0)
    for (const landmark of landmarks) {
      expect(landmark.access[0]).not.toBe(landmark.access[1])
      for (const blocked of [undefined, ...roadEdges]) {
        const reachable = reachableNodes(plaza, blocked)
        expect(reachable.size).toBe(roadNodes.length)
        expect(landmark.access.every((node) => reachable.has(node))).toBe(true)
      }
    }
  })

  it('keeps building footprints clear of road and sidewalk corridors', () => {
    for (const building of cityBuildings) {
      const [x, z] = building.position
      const dimensions = buildingModels[building.model]
      expect(Math.abs(x) + dimensions.width / 2).toBeLessThan(CITY_LIMIT)
      expect(Math.abs(z) + dimensions.depth / 2).toBeLessThan(CITY_LIMIT)
      for (const line of ROAD_LINES) {
        if (Math.abs(z) - dimensions.depth / 2 < 40 + ROAD_HALF_WIDTH) {
          expect(Math.abs(x - line)).toBeGreaterThanOrEqual(dimensions.width / 2 + ROAD_HALF_WIDTH + SIDEWALK_WIDTH)
        }
        if (Math.abs(x) - dimensions.width / 2 < 40 + ROAD_HALF_WIDTH) {
          expect(Math.abs(z - line)).toBeGreaterThanOrEqual(dimensions.depth / 2 + ROAD_HALF_WIDTH + SIDEWALK_WIDTH)
        }
      }
    }
  })

  it('reserves clear portal candidate zones at connected intersections', () => {
    for (const zone of portalCandidateZones) {
      expect(roadNodes).toContain(nodeId(zone.position[0], zone.position[1]))
      for (const building of cityBuildings) {
        const dimensions = buildingModels[building.model]
        const dx = Math.max(Math.abs(zone.position[0] - building.position[0]) - dimensions.width / 2, 0)
        const dz = Math.max(Math.abs(zone.position[1] - building.position[1]) - dimensions.depth / 2, 0)
        expect(Math.hypot(dx, dz)).toBeGreaterThan(zone.radius)
      }
    }
  })
})
