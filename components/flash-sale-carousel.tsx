"use client"

import { useEffect, useState, useRef } from "react"
import { CarouselProductCard } from "@/components/carousel-product-card"
import { fetchFlashSaleProducts } from "@/lib/api-service"

interface FlashProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  source: "amazon" | "flipkart" | "myntra"
  discount: number
  rating?: number
  reviews?: number
}

export function FlashSaleCarousel() {
  const [products, setProducts] = useState<FlashProduct[]>([])
  const [timeLeft, setTimeLeft] = useState("00:30:00")
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [isInstant, setIsInstant] = useState(false)
  const itemWidth = typeof window !== "undefined" && window.innerWidth < 640 ? 140 : 220

  useEffect(() => {
    const loadFlashProducts = async () => {
      try {
        const allProducts = await fetchFlashSaleProducts()
        setProducts(allProducts)
      } catch (error) {
        console.error("Error loading flash sale products:", error)
      } finally {
        setLoading(false)
      }
    }
    loadFlashProducts()
  }, [])

  // Sliding animation
  useEffect(() => {
    if (!products.length) return
    const loopProducts = [...products, ...products]
    const maxOffset = (loopProducts.length / 2) * itemWidth
    const interval = setInterval(() => {
      setOffset((prev) => {
        let next = prev + 0.5
        if (next >= maxOffset) {
          setIsInstant(true)
          setTimeout(() => setIsInstant(false), 20)
          return 0
        }
        setIsInstant(false)
        return next
      })
    }, 16)
    return () => clearInterval(interval)
  }, [products, itemWidth])

  // Navigation buttons
  const handleNav = (type: 'prev' | 'next') => {
    const loopProducts = [...products, ...products]
    const maxOffset = (loopProducts.length / 2) * itemWidth
    setOffset((prev) => {
      if (type === 'prev') {
        if (prev - itemWidth <= 0) {
          setIsInstant(true)
          setTimeout(() => setIsInstant(false), 20)
          return maxOffset
        }
        return Math.max(prev - itemWidth, 0)
      } else {
        if (prev + itemWidth >= maxOffset) {
          setIsInstant(true)
          setTimeout(() => setIsInstant(false), 20)
          return 0
        }
        return Math.min(prev + itemWidth, maxOffset)
      }
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const [hours, minutes, seconds] = prev.split(":").map(Number)
        let totalSeconds = hours * 3600 + minutes * 60 + seconds - 1
        if (totalSeconds <= 0) totalSeconds = 1800
        const h = Math.floor(totalSeconds / 3600)
        const m = Math.floor((totalSeconds % 3600) / 60)
        const s = totalSeconds % 60
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <section className="py-6 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      </section>
    )
  }

  // Duplicate products for seamless loop
  const loopProducts = [...products, ...products]

  return (
    <section className="py-6 px-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-y border-border/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="text-3xl text-yellow-500 drop-shadow-lg">⚡</div>
            <h2 className="text-2xl sm:text-3xl font-black text-yellow-600 drop-shadow-xl">Lightning Deals</h2>
          </div>
          <div className="px-6 py-3 rounded-xl bg-card border-2 border-primary/50 flex items-center gap-3">
            <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">ENDS IN</span>
            <span className="text-xl sm:text-3xl font-black text-foreground">
              {timeLeft}
            </span>
          </div>
        </div>
        {/* Custom sliding carousel */}
        <div className="w-full overflow-hidden relative">
          <div
            className="flex"
            style={{
              width: `${loopProducts.length * itemWidth}px`,
              transform: `translateX(-${offset}px)`,
              transition: isInstant ? 'none' : 'transform 0.5s linear',
            }}
          >
            {loopProducts.map((product, idx) => (
              <div
                key={`${product.id}-${idx}`}
                style={{ minWidth: `${itemWidth}px`, maxWidth: `${itemWidth}px` }}
                className="p-0 m-0"
              >
                <CarouselProductCard product={product} />
              </div>
            ))}
          </div>
          {/* Navigation Buttons */}
          <button
            className="absolute top-1/2 left-2 -translate-y-1/2 z-20 h-10 w-10 bg-card text-foreground border-2 border-border hover:bg-muted hover:border-primary/50 transition-all rounded-full"
            onClick={() => handleNav('prev')}
            aria-label="Previous"
          >
            &#8592;
          </button>
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 z-20 h-10 w-10 bg-card text-foreground border-2 border-border hover:bg-muted hover:border-primary/50 transition-all rounded-full"
            onClick={() => handleNav('next')}
            aria-label="Next"
          >
            &#8594;
          </button>
        </div>
      </div>
    </section>
  )
}
