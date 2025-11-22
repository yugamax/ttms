"use client"

import { useEffect, useState, useRef } from "react"
// Removed Embla Autoplay for unified custom autoplay
import { CarouselProductCard } from "@/components/carousel-product-card"
import { fetchFlashSaleProducts } from "@/lib/api-service"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

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
  const carouselApiRef = useRef<any>(null)

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

  useEffect(() => {
    if (!carouselApiRef.current) return
    const interval = setInterval(() => {
      carouselApiRef.current?.scrollNext()
    }, 1500)
    return () => clearInterval(interval)
  }, [carouselApiRef.current])

  const handleNavClick = () => {
    // Manual navigation disables autoplay for 5 seconds
    if (!carouselApiRef.current) return
    clearInterval(carouselApiRef.current._autoplayInterval)
    carouselApiRef.current._autoplayInterval = setTimeout(() => {
      carouselApiRef.current._autoplayInterval = setInterval(() => {
        carouselApiRef.current?.scrollNext()
      }, 1500)
    }, 5000)
  }

  if (loading) {
    return (
      <section className="py-6 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-6 px-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-y border-border/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="animate-bounce-in text-3xl">⚡</div>
              <div className="absolute -top-2 -left-2 text-sm animate-twinkle">✨</div>
              <div className="absolute -bottom-2 -right-2 text-sm animate-twinkle" style={{ animationDelay: "0.3s" }}>
                ✨
              </div>
            </div>
            <div className="relative overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-shift">
                Lightning Deals
              </h2>
            </div>
          </div>

          <div className="px-6 py-3 rounded-xl bg-card border-2 border-primary/50 flex items-center gap-3">
            <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">ENDS IN</span>
            <span className="text-xl sm:text-3xl font-black text-foreground">
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Carousel container with auto-scrolling */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={(api) => (carouselApiRef.current = api)}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product, idx) => (
              <CarouselItem key={`${product.id}-${idx}`} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <CarouselProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious
              onClick={handleNavClick}
              className="ml-16 h-12 w-12 bg-card text-foreground border-2 border-border hover:bg-muted hover:border-primary/50 transition-all"
            />
            <CarouselNext
              onClick={handleNavClick}
              className="mr-16 h-12 w-12 bg-card text-foreground border-2 border-border hover:bg-muted hover:border-primary/50 transition-all"
            />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
