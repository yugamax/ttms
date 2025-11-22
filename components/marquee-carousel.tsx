"use client"

import type React from "react"
import { useRef } from "react"

interface MarqueeCarouselProps {
  items: React.ReactNode[]
  rows?: number
  title?: string
  icon?: React.ReactNode
}

export function MarqueeCarousel({ items, rows = 2, title, icon }: MarqueeCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const itemsPerRow = Math.ceil(items.length / rows)
  const rowsArray = Array.from({ length: rows }, (_, i) => items.slice(i * itemsPerRow, (i + 1) * itemsPerRow))

  return (
    <div className="py-6 animate-fadeInUp">
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-3 px-4">
          {icon && <span className="text-2xl">{icon}</span>}
          {title && <h3 className="text-lg sm:text-xl font-bold text-foreground capitalize">{title}</h3>}
        </div>
      )}

      <div ref={containerRef} className="space-y-3 overflow-hidden px-4">
        {rowsArray.map((rowItems, rowIdx) => (
          <div key={rowIdx} className="relative overflow-hidden rounded-lg">
            <div
              className="marquee-row"
              style={{
                animationDirection: rowIdx % 2 === 0 ? "normal" : "reverse",
              }}
            >
              {[...rowItems, ...rowItems].map((item, idx) => (
                <div key={idx} className="flex-shrink-0 w-48">
                  {item}
                </div>
              ))}
            </div>

            {/* Fade edges */}
            <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
          </div>
        ))}
      </div>
    </div>
  )
}
