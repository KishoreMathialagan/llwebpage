import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

function getPixelData(filePath) {
  const buf = fs.readFileSync(filePath)
  let pos = 8
  const chunks = []
  let width = 0
  let height = 0
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.slice(pos + 4, pos + 8).toString('ascii')
    const data = buf.slice(pos + 8, pos + 8 + len)
    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
    } else if (type === 'IDAT') chunks.push(data)
    pos += 12 + len
  }
  const decompressed = zlib.inflateSync(Buffer.concat(chunks))
  const bpp = 4
  const rowBytes = width * bpp
  const pixels = Buffer.alloc(width * height * 4)
  let srcPos = 0
  const prevRow = Buffer.alloc(rowBytes)
  const currRow = Buffer.alloc(rowBytes)
  for (let y = 0; y < height; y++) {
    const filter = decompressed[srcPos++]
    for (let x = 0; x < rowBytes; x++) {
      let b = decompressed[srcPos++]
      let a = x >= bpp ? currRow[x - bpp] : 0
      let c = prevRow[x]
      let d = x >= bpp ? prevRow[x - bpp] : 0
      if (filter === 1) b = (b + a) & 255
      else if (filter === 2) b = (b + c) & 255
      else if (filter === 3) b = (b + Math.floor((a + c) / 2)) & 255
      else if (filter === 4) {
        const p = a + c - d
        const pa = Math.abs(p - a)
        const pb = Math.abs(p - c)
        const pc = Math.abs(p - d)
        b = (b + (pa <= pb && pa <= pc ? a : pb <= pc ? c : d)) & 255
      }
      currRow[x] = b
    }
    currRow.copy(pixels, y * rowBytes)
    currRow.copy(prevRow)
  }
  return { width, height, pixels }
}

function marchingSquares(grid, w, h) {
  const pw = w + 2
  const ph = h + 2
  const pgrid = new Uint8Array(pw * ph)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) pgrid[(y + 1) * pw + (x + 1)] = grid[y * w + x]
  }
  const segments = []
  for (let y = 0; y < ph - 1; y++) {
    for (let x = 0; x < pw - 1; x++) {
      const tl = pgrid[y * pw + x]
      const tr = pgrid[y * pw + (x + 1)]
      const br = pgrid[(y + 1) * pw + (x + 1)]
      const bl = pgrid[(y + 1) * pw + x]
      const caseIdx = (tl << 3) | (tr << 2) | (br << 1) | bl
      if (caseIdx === 0 || caseIdx === 15) continue
      const top = { x: x + 0.5 - 1, y: y - 1 }
      const right = { x: x + 1 - 1, y: y + 0.5 - 1 }
      const bottom = { x: x + 0.5 - 1, y: y + 1 - 1 }
      const left = { x: x - 1, y: y + 0.5 - 1 }
      switch (caseIdx) {
        case 1: segments.push([left, bottom]); break
        case 2: segments.push([bottom, right]); break
        case 3: segments.push([left, right]); break
        case 4: segments.push([top, right]); break
        case 5: segments.push([left, top]); segments.push([bottom, right]); break
        case 6: segments.push([top, bottom]); break
        case 7: segments.push([left, top]); break
        case 8: segments.push([top, left]); break
        case 9: segments.push([top, bottom]); break
        case 10: segments.push([top, right]); segments.push([left, bottom]); break
        case 11: segments.push([top, right]); break
        case 12: segments.push([right, left]); break
        case 13: segments.push([right, bottom]); break
        case 14: segments.push([bottom, left]); break
      }
    }
  }
  const loops = []
  const used = new Uint8Array(segments.length)
  for (let i = 0; i < segments.length; i++) {
    if (used[i]) continue
    used[i] = 1
    const loop = [segments[i][0], segments[i][1]]
    let currEnd = segments[i][1]
    let found = true
    while (found) {
      found = false
      for (let j = 0; j < segments.length; j++) {
        if (used[j]) continue
        const p1 = segments[j][0]
        const p2 = segments[j][1]
        if (Math.abs(p1.x - currEnd.x) < 0.01 && Math.abs(p1.y - currEnd.y) < 0.01) {
          used[j] = 1
          loop.push(p2)
          currEnd = p2
          found = true
          break
        } else if (Math.abs(p2.x - currEnd.x) < 0.01 && Math.abs(p2.y - currEnd.y) < 0.01) {
          used[j] = 1
          loop.push(p1)
          currEnd = p1
          found = true
          break
        }
      }
    }
    if (loop.length > 8) loops.push(loop)
  }
  return loops
}

function rdpOpen(points, epsilon = 0.5) {
  if (points.length <= 2) return points
  let dmax = 0
  let index = 0
  const a = points[0]
  const b = points[points.length - 1]
  const denom = Math.hypot(b.y - a.y, b.x - a.x)
  if (denom === 0) return [a]
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i]
    const d = Math.abs((b.y - a.y) * p.x - (b.x - a.x) * p.y + b.x * a.y - b.y * a.x) / denom
    if (d > dmax) {
      index = i
      dmax = d
    }
  }
  if (dmax > epsilon) {
    const rec1 = rdpOpen(points.slice(0, index + 1), epsilon)
    const rec2 = rdpOpen(points.slice(index), epsilon)
    return rec1.slice(0, rec1.length - 1).concat(rec2)
  } else {
    return [a, b]
  }
}

function rdpClosed(points, epsilon = 0.5) {
  if (points.length <= 3) return points
  let maxD = 0
  let farIdx = 1
  const p0 = points[0]
  for (let i = 1; i < points.length; i++) {
    const d = Math.hypot(points[i].x - p0.x, points[i].y - p0.y)
    if (d > maxD) {
      maxD = d
      farIdx = i
    }
  }
  const half1 = rdpOpen(points.slice(0, farIdx + 1), epsilon)
  const half2 = rdpOpen(points.slice(farIdx), epsilon)
  return half1.slice(0, half1.length - 1).concat(half2)
}

function loopsToPath(loops, offsetX = 0, offsetY = 0, scale = 1) {
  return loops
    .map((loop) => {
      const simplified = rdpClosed(loop, 0.5)
      if (simplified.length < 3) return ''
      return (
        'M ' +
        simplified
          .map((p) => `${((p.x - offsetX) * scale).toFixed(2)} ${((p.y - offsetY) * scale).toFixed(2)}`)
          .join(' L ') +
        ' Z'
      )
    })
    .filter(Boolean)
    .join(' ')
}

const imgPath = 'C:/Users/rajas/.gemini/antigravity/brain/d5fd30ac-e46f-45e3-ac8c-db4461115172/.user_uploaded/media_1793960399765_21856af4.png'
const img = getPixelData(imgPath)
const whiteGrid = new Uint8Array(img.width * img.height)
const limeGrid = new Uint8Array(img.width * img.height)

for (let i = 0; i < img.width * img.height; i++) {
  const idx = i * 4
  const a = img.pixels[idx + 3]
  const g = img.pixels[idx + 1]
  const b = img.pixels[idx + 2]
  if (a > 50) {
    if (g > 150 && b < 120) limeGrid[i] = 1
    else whiteGrid[i] = 1
  }
}

const wLoops = marchingSquares(whiteGrid, img.width, img.height)
const lLoops = marchingSquares(limeGrid, img.width, img.height)

const bbox = { x: 0, y: 0, w: 404, h: 350 }
const whitePath = loopsToPath(wLoops, bbox.x, bbox.y)
const limePath = loopsToPath(lLoops, bbox.x, bbox.y)

console.log('Loops found - white:', wLoops.length, 'lime:', lLoops.length)
console.log('Path lengths - white:', whitePath.length, 'lime:', limePath.length)

// Save updated symbol SVG
const brandDir = path.join(rootDir, 'public', 'brand')
const symDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${bbox.w} ${bbox.h}" fill="none">
  <path d="${whitePath}" fill="#F1F0E9" fill-rule="evenodd" />
  <path d="${limePath}" fill="#B9D94A" />
</svg>`

const symLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${bbox.w} ${bbox.h}" fill="none">
  <path d="${whitePath}" fill="#080A07" fill-rule="evenodd" />
  <path d="${limePath}" fill="#B9D94A" />
</svg>`

fs.writeFileSync(path.join(brandDir, 'antara-symbol.svg'), symDark, 'utf8')
fs.writeFileSync(path.join(brandDir, 'antara-symbol-dark.svg'), symLight, 'utf8')
fs.copyFileSync(imgPath, path.join(brandDir, 'antara-symbol.png'))

// Also update favicon.svg
const favSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#080A07"/>
  <rect x="2" y="2" width="508" height="508" rx="110" fill="none" stroke="#292B26" stroke-width="4"/>
  <g transform="translate(54, 81) scale(1.0)">
    <path d="${whitePath}" fill="#F1F0E9" fill-rule="evenodd" />
    <path d="${limePath}" fill="#B9D94A" />
  </g>
</svg>`
fs.writeFileSync(path.join(rootDir, 'public', 'favicon.svg'), favSvg, 'utf8')
fs.writeFileSync(path.join(brandDir, 'favicon.svg'), favSvg, 'utf8')

// Update LogoPaths.ts
const logoPathsFile = path.join(rootDir, 'src', 'components', 'LogoPaths.ts')
let logoPathsContent = fs.readFileSync(logoPathsFile, 'utf8')
logoPathsContent = logoPathsContent.replace(/export const SYMBOL_PATHS = \{[\s\S]*?\}/, 
`export const SYMBOL_PATHS = {
  viewBox: '0 0 ${bbox.w} ${bbox.h}',
  white: '${whitePath}',
  lime: '${limePath}',
}`)
fs.writeFileSync(logoPathsFile, logoPathsContent, 'utf8')
console.log('Successfully updated symbol assets and LogoPaths.ts!')
