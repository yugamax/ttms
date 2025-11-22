"use client"

import { useEffect, useState, useRef } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { ProductCard } from "@/components/product-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchAmazonProducts, fetchFlipkartProducts, fetchMyntraProducts } from "@/lib/api-service"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  source: "amazon" | "flipkart" | "myntra"
  rating?: number
  reviews?: number
  discount?: number
}

export default function ProductGrid({ products = [], loading }) {
  const [activeSource, setActiveSource] = useState("all")
  const carouselApiRef = useRef<any>(null)
  // Autoplay logic for infinite scrolling
  useEffect(() => {
    if (!carouselApiRef.current) return
    const interval = setInterval(() => {
      carouselApiRef.current?.scrollNext()
    }, 1500)
    return () => clearInterval(interval)
  }, [carouselApiRef.current])

  const filteredProducts = activeSource === "all" ? products : products.filter((p) => p.source === activeSource)

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 relative">
      {/* Fade effect on sides */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-background/80 to-transparent z-10" />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-background/80 to-transparent z-10" />
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-6 sm:mb-8">Featured Products</h2>

        <Tabs defaultValue="all" className="mb-6 sm:mb-8">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-fit">
            <TabsTrigger value="all" onClick={() => setActiveSource("all")}>All</TabsTrigger>
            <TabsTrigger value="amazon" onClick={() => setActiveSource("amazon")}>Amazon</TabsTrigger>
            <TabsTrigger value="flipkart" onClick={() => setActiveSource("flipkart")}>Flipkart</TabsTrigger>
            <TabsTrigger value="myntra" onClick={() => setActiveSource("myntra")}>Myntra</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex justify-center py-12 sm:py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-foreground/70">Loading products...</p>
            </div>
          </div>
        ) : (
          <Carousel
            opts={{ align: "start", loop: true }}
            setApi={(api) => (carouselApiRef.current = api)}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, idx) => (
                  <CarouselItem key={product.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                    <ProductCard product={product} />
                  </CarouselItem>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-foreground/70">No products found</p>
                </div>
              )}
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
        )}
      </div>
    </section>
  )
}
