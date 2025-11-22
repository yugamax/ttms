"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { OpeningAnimation } from "@/components/opening-animation"
import { HeroSection } from "@/components/hero-section"
import { FlashSaleCarousel } from "@/components/flash-sale-carousel"
import { CategoryCarousel } from "@/components/category-carousel"
import { Footer } from "@/components/footer"
import { fetchAmazonProducts, fetchFlipkartProducts, fetchMyntraProducts } from "@/lib/api-service"
import { Monitor, Shirt, Headphones, Sparkles, Home } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  source: "amazon" | "flipkart" | "myntra"
  discount?: number
  rating?: number
  reviews?: number
  category: string
}

export default function HomePage() {
  const [showAnimation, setShowAnimation] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [amazon, flipkart, myntra] = await Promise.all([
          fetchAmazonProducts(),
          fetchFlipkartProducts(),
          fetchMyntraProducts(),
        ])

        const allProducts: Product[] = [
          ...amazon.map((p) => ({
            id: `amazon-${p.asin}`,
            name: p.title,
            price: p.price,
            originalPrice: p.originalPrice,
            image: p.image,
            source: "amazon" as const,
            rating: p.rating,
            reviews: p.reviews,
            discount: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
            category: "electronics",
          })),
          ...flipkart.map((p) => ({
            id: `flipkart-${p.id}`,
            name: p.title,
            price: p.price,
            originalPrice: p.originalPrice,
            image: p.image,
            source: "flipkart" as const,
            rating: p.rating,
            reviews: p.reviews,
            discount: p.discount,
            category: "electronics",
          })),
          ...myntra.map((p) => ({
            id: `myntra-${p.id}`,
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice,
            image: p.image,
            source: "myntra" as const,
            rating: p.rating,
            reviews: p.reviews,
            discount: p.discount,
            category: "fashion",
          })),
        ]

        setProducts(allProducts)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (showAnimation) {
    return <OpeningAnimation />
  }

  const categories = {
    electronics: products.filter((p) => p.category === "electronics"),
    fashion: products.filter((p) => p.category === "fashion"),
    audio: products.filter((p) => p.source === "amazon" && p.category === "electronics"),
    home: products.filter((p) => p.source === "flipkart"),
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <FlashSaleCarousel />

      <section className="py-8 px-4 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="max-w-7xl mx-auto space-y-8">
          {categories.electronics.length > 0 && (
            <CategoryCarousel category="Electronics" products={categories.electronics} icon={<Monitor size={24} />} direction="right" />
          )}
          {categories.fashion.length > 0 && (
            <CategoryCarousel category="Fashion" products={categories.fashion} icon={<Shirt size={24} />} direction="left" />
          )}
          {categories.audio.length > 0 && (
            <CategoryCarousel
              category="Audio & Accessories"
              products={categories.audio}
              icon={<Headphones size={24} />}
              direction="right"
            />
          )}
          {categories.home.length > 0 && (
            <CategoryCarousel category="Home Essentials" products={categories.home} icon={<Home size={24} />} direction="left" />
          )}
        </div>
      </section>

      <section className="py-8 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="max-w-7xl mx-auto">
          {categories.fashion.length > 0 && (
            <CategoryCarousel
              category="Trending Now"
              icon={<Sparkles size={24} />}
              products={categories.fashion}
            />
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
