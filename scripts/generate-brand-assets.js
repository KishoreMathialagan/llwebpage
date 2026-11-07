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

function rdpOpen(points, epsilon) {
  if (points.length <= 2) return points
  let dmax = 0
  let index = 0
  const a = points[0]
  const b = points[points.length - 1]
  const denom = Math.hypot(b.y - a.y, b.x - a.x)
  if (denom < 1e-6) return [a]

  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i]
    const d =
      Math.abs((b.y - a.y) * p.x - (b.x - a.x) * p.y + b.x * a.y - b.y * a.x) / denom
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

function rdpClosed(loop, epsilon = 0.45) {
  if (loop.length < 4) return loop
  let maxD = 0
  let maxIdx = Math.floor(loop.length / 2)
  const p0 = loop[0]
  for (let i = 1; i < loop.length; i++) {
    const d = Math.hypot(loop[i].x - p0.x, loop[i].y - p0.y)
    if (d > maxD) {
      maxD = d
      maxIdx = i
    }
  }
  const part1 = loop.slice(0, maxIdx + 1)
  const part2 = loop.slice(maxIdx)
  const s1 = rdpOpen(part1, epsilon)
  const s2 = rdpOpen(part2, epsilon)
  return s1.slice(0, s1.length - 1).concat(s2)
}

function loopsToPath(loops, offsetX = 0, offsetY = 0, scale = 1) {
  return loops
    .map((loop) => {
      const simplified = rdpClosed(loop, 0.45)
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

const userUploadDir = 'C:/Users/rajas/.gemini/antigravity/brain/d5fd30ac-e46f-45e3-ac8c-db4461115172/.user_uploaded/'
const brandDir = path.join(rootDir, 'public', 'brand')
if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true })

console.log('Extracting brand assets...')

// 1. Symbol Only from media_1793955183068_ebf871dc.png
const symImg = getPixelData(userUploadDir + 'media_1793955183068_ebf871dc.png')
const symWhite = new Uint8Array(symImg.width * symImg.height)
const symLime = new Uint8Array(symImg.width * symImg.height)

for (let i = 0; i < symImg.width * symImg.height; i++) {
  const idx = i * 4
  const a = symImg.pixels[idx + 3]
  const g = symImg.pixels[idx + 1]
  const b = symImg.pixels[idx + 2]
  if (a > 60) {
    if (g > 150 && b < 120) symLime[i] = 1
    else symWhite[i] = 1
  }
}

const symWLoops = marchingSquares(symWhite, symImg.width, symImg.height)
const symLLoops = marchingSquares(symLime, symImg.width, symImg.height)

// Symbol bounding box: x: 27 to 428, y: 0 to 350
const symBbox = { x: 24, y: 0, w: 408, h: 350 }
const symWhitePath = loopsToPath(symWLoops, symBbox.x, symBbox.y)
const symLimePath = loopsToPath(symLLoops, symBbox.x, symBbox.y)

// Export Symbol SVGs (Light & Dark)
const symbolSvgDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${symBbox.w} ${symBbox.h}" fill="none">
  <path d="${symWhitePath}" fill="#F1F0E9" fill-rule="evenodd" />
  <path d="${symLimePath}" fill="#B9D94A" />
</svg>`

const symbolSvgLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${symBbox.w} ${symBbox.h}" fill="none">
  <path d="${symWhitePath}" fill="#080A07" fill-rule="evenodd" />
  <path d="${symLimePath}" fill="#B9D94A" />
</svg>`

fs.writeFileSync(path.join(brandDir, 'antara-symbol.svg'), symbolSvgDark, 'utf8')
fs.writeFileSync(path.join(brandDir, 'antara-symbol-dark.svg'), symbolSvgLight, 'utf8')

// Copy symbol PNG directly
fs.copyFileSync(
  userUploadDir + 'media_1793955183068_ebf871dc.png',
  path.join(brandDir, 'antara-symbol.png')
)

// 2. Full Lockup from media_1793955170457_03c6d04b.png
const f1Img = getPixelData(userUploadDir + 'media_1793955170457_03c6d04b.png')
const f1White = new Uint8Array(f1Img.width * f1Img.height)
const f1Lime = new Uint8Array(f1Img.width * f1Img.height)

for (let i = 0; i < f1Img.width * f1Img.height; i++) {
  const idx = i * 4
  const a = f1Img.pixels[idx + 3]
  const g = f1Img.pixels[idx + 1]
  const b = f1Img.pixels[idx + 2]
  if (a > 60) {
    if (g > 150 && b < 120) f1Lime[i] = 1
    else f1White[i] = 1
  }
}

const f1WLoops = marchingSquares(f1White, f1Img.width, f1Img.height)
const f1LLoops = marchingSquares(f1Lime, f1Img.width, f1Img.height)

const f1Bbox = { x: 10, y: 0, w: 1014, h: 153 }
const f1WhitePath = loopsToPath(f1WLoops, f1Bbox.x, f1Bbox.y)
const f1LimePath = loopsToPath(f1LLoops, f1Bbox.x, f1Bbox.y)

const fullLockupSvgDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f1Bbox.w} ${f1Bbox.h}" fill="none">
  <path d="${f1WhitePath}" fill="#F1F0E9" fill-rule="evenodd" />
  <path d="${f1LimePath}" fill="#B9D94A" />
</svg>`

const fullLockupSvgLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f1Bbox.w} ${f1Bbox.h}" fill="none">
  <path d="${f1WhitePath}" fill="#080A07" fill-rule="evenodd" />
  <path d="${f1LimePath}" fill="#B9D94A" />
</svg>`

fs.writeFileSync(path.join(brandDir, 'antara-full-lockup.svg'), fullLockupSvgDark, 'utf8')
fs.writeFileSync(path.join(brandDir, 'antara-full-lockup-dark.svg'), fullLockupSvgLight, 'utf8')

fs.copyFileSync(
  userUploadDir + 'media_1793955170457_03c6d04b.png',
  path.join(brandDir, 'antara-full-lockup.png')
)

// 3. Wordmark Only from media_1793955194288_1416cc89.png
const f3Img = getPixelData(userUploadDir + 'media_1793955194288_1416cc89.png')
const f3White = new Uint8Array(f3Img.width * f3Img.height)
// ANTARA wordmark is between y: 0 and y: 152
for (let y = 0; y <= 152; y++) {
  for (let x = 0; x < f3Img.width; x++) {
    const idx = (y * f3Img.width + x) * 4
    if (f3Img.pixels[idx + 3] > 60) {
      f3White[y * f3Img.width + x] = 1
    }
  }
}

const f3WLoops = marchingSquares(f3White, f3Img.width, 155)
// Wordmark bbox: x: 4 to 1018, y: 0 to 153
const wmBbox = { x: 4, y: 0, w: 1016, h: 153 }
const wmWhitePath = loopsToPath(f3WLoops, wmBbox.x, wmBbox.y)

const wordmarkSvgDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${wmBbox.w} ${wmBbox.h}" fill="none">
  <path d="${wmWhitePath}" fill="#F1F0E9" fill-rule="evenodd" />
</svg>`

const wordmarkSvgLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${wmBbox.w} ${wmBbox.h}" fill="none">
  <path d="${wmWhitePath}" fill="#080A07" fill-rule="evenodd" />
</svg>`

fs.writeFileSync(path.join(brandDir, 'antara-wordmark.svg'), wordmarkSvgDark, 'utf8')
fs.writeFileSync(path.join(brandDir, 'antara-wordmark-dark.svg'), wordmarkSvgLight, 'utf8')

fs.copyFileSync(
  userUploadDir + 'media_1793955194288_1416cc89.png',
  path.join(brandDir, 'antara-wordmark.png')
)

// 4. Compact Navbar Horizontal Lockup (Symbol + ANTARA wordmark)
// Height normalized to 153, symbol width: ~178, gap: 54, wordmark: 1016
// Total viewBox: 0 0 1250 153
const navScale = 153 / symBbox.h // scale symbol to match wordmark height
const symNavWhitePath = loopsToPath(symWLoops, symBbox.x, symBbox.y, navScale)
const symNavLimePath = loopsToPath(symLLoops, symBbox.x, symBbox.y, navScale)
const symNavW = symBbox.w * navScale
const navGap = 42
const navTotalW = Math.round(symNavW + navGap + wmBbox.w)

const navLockupSvgDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${navTotalW} 153" fill="none">
  <g>
    <path d="${symNavWhitePath}" fill="#F1F0E9" fill-rule="evenodd" />
    <path d="${symNavLimePath}" fill="#B9D94A" />
  </g>
  <g transform="translate(${Math.round(symNavW + navGap)}, 0)">
    <path d="${wmWhitePath}" fill="#F1F0E9" fill-rule="evenodd" />
  </g>
</svg>`

const navLockupSvgLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${navTotalW} 153" fill="none">
  <g>
    <path d="${symNavWhitePath}" fill="#080A07" fill-rule="evenodd" />
    <path d="${symNavLimePath}" fill="#B9D94A" />
  </g>
  <g transform="translate(${Math.round(symNavW + navGap)}, 0)">
    <path d="${wmWhitePath}" fill="#080A07" fill-rule="evenodd" />
  </g>
</svg>`

fs.writeFileSync(path.join(brandDir, 'antara-nav-lockup.svg'), navLockupSvgDark, 'utf8')
fs.writeFileSync(path.join(brandDir, 'antara-nav-lockup-dark.svg'), navLockupSvgLight, 'utf8')

// 5. Favicon (Symbol centered inside square canvas with rounded corners)
const favSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#080A07"/>
  <rect x="2" y="2" width="508" height="508" rx="110" fill="none" stroke="#292B26" stroke-width="4"/>
  <g transform="translate(68, 80) scale(0.92)">
    <path d="${symWhitePath}" fill="#F1F0E9" fill-rule="evenodd" />
    <path d="${symLimePath}" fill="#B9D94A" />
  </g>
</svg>`

fs.writeFileSync(path.join(rootDir, 'public', 'favicon.svg'), favSvg, 'utf8')
fs.writeFileSync(path.join(brandDir, 'favicon.svg'), favSvg, 'utf8')

// 6. Generate LogoPaths.ts for native React SVG rendering
const logoPathsTs = `// Official vector path definitions extracted directly from approved ANTARA brand identity assets
export const SYMBOL_PATHS = {
  white: ${JSON.stringify(symWhitePath)},
  lime: ${JSON.stringify(symLimePath)},
  viewBox: '0 0 ${symBbox.w} ${symBbox.h}',
  width: ${symBbox.w},
  height: ${symBbox.h},
} as const

export const FULL_LOCKUP_PATHS = {
  white: ${JSON.stringify(f1WhitePath)},
  lime: ${JSON.stringify(f1LimePath)},
  viewBox: '0 0 ${f1Bbox.w} ${f1Bbox.h}',
  width: ${f1Bbox.w},
  height: ${f1Bbox.h},
} as const

export const WORDMARK_PATHS = {
  white: ${JSON.stringify(wmWhitePath)},
  viewBox: '0 0 ${wmBbox.w} ${wmBbox.h}',
  width: ${wmBbox.w},
  height: ${wmBbox.h},
} as const

export const NAV_LOCKUP_PATHS = {
  symbolWhite: ${JSON.stringify(symNavWhitePath)},
  symbolLime: ${JSON.stringify(symNavLimePath)},
  wordmark: ${JSON.stringify(wmWhitePath)},
  wordmarkOffset: ${Math.round(symNavW + navGap)},
  viewBox: '0 0 ${navTotalW} 153',
  width: ${navTotalW},
  height: 153,
} as const
`

fs.writeFileSync(path.join(rootDir, 'src', 'components', 'LogoPaths.ts'), logoPathsTs, 'utf8')

console.log('Brand assets generation and LogoPaths.ts completed successfully!')
