export function generateQrMatrix(text: string): boolean[][] {
  const dataBytes = new TextEncoder().encode(text)
  const length = dataBytes.length

  let version = 1
  const capacityM = [0, 14, 26, 42, 62, 84, 106, 122, 152, 180, 213]
  for (let v = 1; v <= 10; v++) {
    if (length <= capacityM[v]) {
      version = v
      break
    }
  }

  const size = version * 4 + 17
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null)
  )

  const isReserved: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  )

  function setReserved(r: number, c: number, val: boolean) {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      matrix[r][c] = val
      isReserved[r][c] = true
    }
  }

  function placeFinder(r: number, c: number) {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const nr = r + dr
        const nc = c + dc
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue
        if (dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6) {
          const isBlack =
            dr === 0 ||
            dr === 6 ||
            dc === 0 ||
            dc === 6 ||
            (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4)
          setReserved(nr, nc, isBlack)
        } else {
          setReserved(nr, nc, false)
        }
      }
    }
  }

  placeFinder(0, 0)
  placeFinder(0, size - 7)
  placeFinder(size - 7, 0)

  for (let i = 8; i < size - 8; i++) {
    setReserved(6, i, i % 2 === 0)
    setReserved(i, 6, i % 2 === 0)
  }

  setReserved(size - 8, 8, true)

  const alignmentPatterns: Record<number, number[]> = {
    2: [6, 18],
    3: [6, 22],
    4: [6, 26],
    5: [6, 30],
    6: [6, 34],
    7: [6, 22, 38],
    8: [6, 24, 42],
    9: [6, 26, 46],
    10: [6, 28, 50]
  }

  if (alignmentPatterns[version]) {
    const coords = alignmentPatterns[version]
    for (const r of coords) {
      for (const c of coords) {
        if (
          (r === 6 && c === 6) ||
          (r === 6 && c === size - 7) ||
          (r === size - 7 && c === 6)
        ) {
          continue
        }
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const isBlack =
              Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0)
            setReserved(r + dr, c + dc, isBlack)
          }
        }
      }
    }
  }

  for (let i = 0; i < 9; i++) {
    setReserved(8, i, false)
    setReserved(i, 8, false)
    setReserved(8, size - 1 - i, false)
    setReserved(size - 1 - i, 8, false)
  }

  const totalCodewords = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346][version]
  const ecCodewords = [0, 10, 16, 26, 36, 48, 64, 72, 88, 110, 130][version]
  const dataCodewordsCount = totalCodewords - ecCodewords

  const bits: number[] = []
  function pushBits(val: number, numBits: number) {
    for (let i = numBits - 1; i >= 0; i--) {
      bits.push((val >> i) & 1)
    }
  }

  pushBits(0b0100, 4)
  pushBits(length, 8)
  for (let i = 0; i < length; i++) {
    pushBits(dataBytes[i], 8)
  }

  const maxDataBits = dataCodewordsCount * 8
  const terminatorLength = Math.min(4, maxDataBits - bits.length)
  pushBits(0, terminatorLength)

  while (bits.length % 8 !== 0) {
    bits.push(0)
  }

  const padBytes = [0xec, 0x11]
  let padIdx = 0
  while (bits.length < maxDataBits) {
    pushBits(padBytes[padIdx % 2], 8)
    padIdx++
  }

  const dataBlocks: number[] = []
  for (let i = 0; i < bits.length; i += 8) {
    let byteVal = 0
    for (let b = 0; b < 8; b++) {
      byteVal = (byteVal << 1) | bits[i + b]
    }
    dataBlocks.push(byteVal)
  }

  const expTable = new Uint8Array(512)
  const logTable = new Uint8Array(256)
  let x = 1
  for (let i = 0; i < 255; i++) {
    expTable[i] = x
    expTable[i + 255] = x
    logTable[x] = i
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0)
  }

  function gfMul(a: number, b: number): number {
    if (a === 0 || b === 0) return 0
    return expTable[logTable[a] + logTable[b]]
  }

  function getGeneratorPoly(numEc: number): number[] {
    let poly = [1]
    for (let i = 0; i < numEc; i++) {
      const next = [1, expTable[i]]
      const res: number[] = new Array(poly.length + 1).fill(0)
      for (let j = 0; j < poly.length; j++) {
        for (let k = 0; k < 2; k++) {
          res[j + k] ^= gfMul(poly[j], next[k])
        }
      }
      poly = res
    }
    return poly
  }

  const genPoly = getGeneratorPoly(ecCodewords)
  const remainder = new Array(ecCodewords).fill(0)
  for (let i = 0; i < dataBlocks.length; i++) {
    const factor = dataBlocks[i] ^ remainder[0]
    remainder.shift()
    remainder.push(0)
    for (let j = 0; j < ecCodewords; j++) {
      remainder[j] ^= gfMul(genPoly[j + 1], factor)
    }
  }

  const finalCodewords = [...dataBlocks, ...remainder]
  const finalBits: number[] = []
  for (const b of finalCodewords) {
    for (let i = 7; i >= 0; i--) {
      finalBits.push((b >> i) & 1)
    }
  }

  let bitIdx = 0
  let upward = true
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right--
    const rows = upward
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i)

    for (const r of rows) {
      for (const col of [right, right - 1]) {
        if (!isReserved[r][col]) {
          const bit = bitIdx < finalBits.length ? finalBits[bitIdx++] : 0
          const mask = (r + col) % 2 === 0
          matrix[r][col] = (bit ^ (mask ? 1 : 0)) === 1
        }
      }
    }
    upward = !upward
  }

  const formatBits = [
    1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0
  ]

  const formatCoordsTopLeft = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
  ]

  const formatCoordsSplit = [
    [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8], [size - 5, 8],
    [size - 6, 8], [size - 7, 8],
    [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5],
    [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1]
  ]

  for (let i = 0; i < 15; i++) {
    const bit = formatBits[i] === 1
    const [r1, c1] = formatCoordsTopLeft[i]
    matrix[r1][c1] = bit
    const [r2, c2] = formatCoordsSplit[i]
    matrix[r2][c2] = bit
  }

  return matrix.map((row) => row.map((cell) => cell ?? false))
}

export function generateQrSvgPath(matrix: boolean[][]): string {
  const size = matrix.length
  let path = ""
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) {
        path += `M${c},${r}h1v1h-1z `
      }
    }
  }
  return path.trim()
}
