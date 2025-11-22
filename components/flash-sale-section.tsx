"use client"

import { useEffect, useState, useRef } from "react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
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
  const [isAutoplaying, setIsAutoplaying] = useState(true)
  const [userInteracted, setUserInteracted] = useState(false)
  const carouselApiRef = useRef<any>(null)
  const autoplayTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const loadFlashProducts = async () => {
      try {
        const flashProducts = await fetchFlashSaleProducts()
        setProducts(flashProducts)
      } catch (error) {
        console.error("Error loading flash sale products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFlashProducts()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const [hours, minutes, seconds] = prev.split(":").map(Number)
        let totalSeconds = hours * 3600 + minutes * 60 + seconds - 1

        if (totalSeconds <= 0) {
          totalSeconds = 1800 // Reset to 30 minutes
        }

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
        <Carousel
          opts={{ align: "start", loop: true }}
          setApi={(api) => (carouselApiRef.current = api)}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product, idx) => (
              <CarouselItem key={product.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg blur-md -z-10" />
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious
              className="ml-16 h-12 w-12 bg-card text-foreground border-2 border-border hover:bg-muted hover:border-primary/50 transition-all"
              onClick={() => {
                setIsAutoplaying(false)
                setUserInteracted(true)
                carouselApiRef.current?.scrollPrev()
              }}
            />
            <CarouselNext
              className="mr-16 h-12 w-12 bg-card text-foreground border-2 border-border hover:bg-muted hover:border-primary/50 transition-all"
              onClick={() => {
                setIsAutoplaying(false)
                setUserInteracted(true)
                carouselApiRef.current?.scrollNext()
              }}
            />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
