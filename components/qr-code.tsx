"use client"

import { useMemo } from "react"
import { generateQrMatrix, generateQrSvgPath } from "@/lib/qr"

interface QrCodeProps {
  value: string
  size?: number
  className?: string
  fgColor?: string
  bgColor?: string
}

export function QrCode({
  value,
  size = 220,
  className = "",
  fgColor = "#ffffff",
  bgColor = "transparent"
}: QrCodeProps) {
  const { path, matrixSize } = useMemo(() => {
    try {
      const matrix = generateQrMatrix(value)
      return {
        path: generateQrSvgPath(matrix),
        matrixSize: matrix.length
      }
    } catch {
      return { path: "", matrixSize: 21 }
    }
  }, [value])

  return (
    <div
      className={`relative inline-flex items-center justify-center p-3 rounded-xl border border-white/10 bg-black/60 shadow-[0_0_30px_rgba(255,0,212,0.1)] backdrop-blur-md ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`-2 -2 ${matrixSize + 4} ${matrixSize + 4}`}
        className="w-full h-full"
        style={{ shapeRendering: "crispEdges" }}
      >
        {bgColor !== "transparent" && (
          <rect
            x={-2}
            y={-2}
            width={matrixSize + 4}
            height={matrixSize + 4}
            fill={bgColor}
          />
        )}
        <path d={path} fill={fgColor} />
      </svg>
    </div>
  )
}
