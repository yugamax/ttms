"use client"

import type React from "react"
import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SnapScrollCarouselProps {
  children: React.ReactNode[]
  title?: string
  icon?: React.ReactNode
}

export function SnapScrollCarousel({ children, title, icon }: SnapScrollCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  return (
    <div className="py-6 animate-fadeInUp">
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-3 px-4">
          {icon && <span className="text-2xl">{icon}</span>}
          {title && <h3 className="text-lg sm:text-xl font-bold text-foreground capitalize">{title}</h3>}
        </div>
      )}

      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-primary/90 hover:bg-primary text-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-4"
          style={{
            scrollBehavior: "smooth",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          {children.map((child, idx) => (
            <div key={idx} className="flex-shrink-0">
              {child}
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-primary/90 hover:bg-primary text-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
