import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { Box3, Vector3, type Group } from 'three'
import { assetManifest, type AssetId } from './asset-manifest'

type Progress = (done: number, total: number, id: AssetId) => void

function imageLoads(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('Image could not load'))
    image.src = url
  })
}

function audioLoads(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.onloadedmetadata = () => resolve()
    audio.onerror = () => reject(new Error('Audio metadata could not load'))
    audio.src = url
    audio.load()
  })
}

function centerForPreview(scene: Group): Group {
  const bounds = new Box3().setFromObject(scene)
  if (bounds.isEmpty()) return scene
  const size = bounds.getSize(new Vector3())
  const center = bounds.getCenter(new Vector3())
  const scale = 3 / Math.max(size.x, size.y, size.z, 0.001)
  scene.scale.setScalar(scale)
  scene.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale)
  return scene
}

export async function inspectAssets(progress: Progress, preview: (scene: Group) => void): Promise<string[]> {
  const ids = Object.keys(assetManifest) as AssetId[]
  const loader = new GLTFLoader()
  const models = new Map<string, GLTF>()
  const errors: string[] = []

  for (const [index, id] of ids.entries()) {
    const asset = assetManifest[id]
    try {
      if (asset.url.endsWith('.glb')) {
        let model = models.get(asset.url)
        if (!model) {
          model = await loader.loadAsync(asset.url)
          models.set(asset.url, model)
          if (model.scene.children.length) preview(centerForPreview(model.scene))
        }
        if ('clip' in asset && !model.animations.some((clip) => clip.name === asset.clip)) {
          throw new Error(`Missing clip ${asset.clip}`)
        }
      } else if (asset.url.endsWith('.png')) {
        await imageLoads(asset.url)
      } else {
        await audioLoads(asset.url)
      }
    } catch (error) {
      errors.push(`${id}: ${error instanceof Error ? error.message : String(error)}`)
    }
    progress(index + 1, ids.length, id)
  }
  return errors
}
