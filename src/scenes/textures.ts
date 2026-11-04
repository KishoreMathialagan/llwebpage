import * as THREE from 'three'

/** Soft circular falloff used for particles and atmospheric glows. */
export function createRadialTexture(stops: Array<[number, string]> = [
  [0, 'rgba(255,255,255,1)'],
  [0.35, 'rgba(255,255,255,0.65)'],
  [1, 'rgba(255,255,255,0)'],
]) {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) return new THREE.Texture()

  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color))
  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}
