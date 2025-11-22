"use client"

import { useEffect, useState, useRef } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { ProductCard } from "@/components/product-card"
import { fetchFlashSaleProducts } from "@/lib/api-service"
import { Zap } from "lucide-react"

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
  const carouselRef = useRef<HTMLDivElement>(null)
  const itemWidth = typeof window !== "undefined" && window.innerWidth < 640 ? 140 : 220

  useEffect(() => {
    const loadFlashProducts = async () => {
      try {
        const flashProducts = await fetchFlashSaleProducts()
        let allProducts = flashProducts
        // Add random products if less than 10
        if (allProducts.length < 10) {
          const extra = Array.from({ length: 10 - allProducts.length }, (_, i) => ({
            id: `random-${i}`,
            name: `Random Product ${i + 1}`,
            price: 999 + i * 10,
            originalPrice: 1099 + i * 10,
            image: "https://via.placeholder.com/200x200?text=Random+Product",
            source: ["amazon", "flipkart", "myntra"][i % 3] as "amazon" | "flipkart" | "myntra",
            discount: 10 + i,
            rating: 4.5,
            reviews: 100 + i,
          }))
          allProducts = [...allProducts, ...extra]
        }
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
      <section className="py-8 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      </section>
    )
  }

  // Duplicate products for seamless loop
  const loopProducts = [...products, ...products]

  return (
    <section className="py-10 px-4 bg-gradient-to-r from-yellow-100 via-primary/10 to-accent/10 border-y-4 border-yellow-400 relative shadow-xl">
      {/* Extra fancy effects */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-yellow-200/80 to-transparent z-10" />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-yellow-200/80 to-transparent z-10" />
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-4 left-1/4 w-32 h-32 bg-gradient-to-br from-yellow-300 via-yellow-100 to-transparent rounded-full blur-2xl opacity-40 animate-pulse-glow" />
        <div className="absolute bottom-4 right-1/4 w-24 h-24 bg-gradient-to-tr from-accent via-primary to-transparent rounded-full blur-2xl opacity-30 animate-pulse-glow" />
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 via-yellow-200 to-transparent rounded-full blur-xl opacity-20 animate-twinkle" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Lightning Icon */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="animate-bounce-in text-5xl text-yellow-500 drop-shadow-lg">⚡</div>
              <div className="absolute -top-2 -left-2 text-lg animate-twinkle text-yellow-400">✨</div>
              <div className="absolute -bottom-2 -right-2 text-lg animate-twinkle text-yellow-400" style={{ animationDelay: "0.3s" }}>✨</div>
            </div>
            <div className="relative overflow-hidden">
              <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-yellow-500 via-primary to-accent bg-clip-text text-transparent animate-gradient-shift drop-shadow-xl">Lightning Deals</h2>
              <p className="text-lg text-yellow-700 font-bold mt-1 animate-pulse-glow">Ends in</p>
            </div>
          </div>
          {/* Timer with special animation */}
          <div className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-200 to-accent/20 border-4 border-yellow-400 shadow-lg backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1 left-2 animate-twinkle text-lg text-yellow-400">⭐</div>
              <div className="absolute top-3 right-3 animate-twinkle text-lg text-yellow-400" style={{ animationDelay: "0.2s" }}>✨</div>
              <div className="absolute bottom-2 left-1/4 animate-twinkle text-lg text-yellow-400" style={{ animationDelay: "0.4s" }}>⭐</div>
              <div className="absolute bottom-1 right-1/4 animate-twinkle text-lg text-yellow-400" style={{ animationDelay: "0.6s" }}>✨</div>
            </div>
            <div className="relative flex items-center gap-4">
              <span className="text-lg font-bold text-yellow-700 uppercase tracking-wider">ENDS IN</span>
              <span className="text-3xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-yellow-500 to-accent bg-clip-text animate-star-burst drop-shadow-lg">
                {timeLeft}
              </span>
            </div>
          </div>
        </div>

        {/* Products Carousel - infinite scroll */}
        <div className="w-full overflow-hidden relative">
          <div
            ref={carouselRef}
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
                <ProductCard product={product} />
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
