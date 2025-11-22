"use client"

import React, { useEffect, useState } from "react"
import { CarouselProductCard } from "@/components/carousel-product-card"

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

interface CategoryCarouselProps {
  category: string
  products: Product[]
  icon?: React.ReactNode
  direction?: 'left' | 'right'
}


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

  interface CategoryCarouselProps {
    category: string
    products: Product[]
    icon?: React.ReactNode
    direction?: 'left' | 'right'
  }

  const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ category, products, icon, direction = 'right' }) => {
    let testProducts = products
    if (products.length < 10) {
      const extra = Array.from({ length: 10 - products.length }, (_, i) => ({
        id: `test-${i}`,
        name: `Test Product ${i + 1}`,
        price: 999 + i * 10,
        originalPrice: 1099 + i * 10,
        image: "https://via.placeholder.com/200x200?text=Test+Product",
        source: "amazon" as "amazon",
        category,
        discount: 10,
        rating: 4.5,
        reviews: 100 + i,
      }))
      testProducts = [...products, ...extra]
    }

    if (testProducts.length === 0) return null

    // Duplicate products for seamless loop
    const loopProducts = [...testProducts, ...testProducts]
    const itemWidth = 220 // px, adjust to match card width
    const [offset, setOffset] = useState(0)
    const [isInstant, setIsInstant] = useState(false)

    // Stable dependency array for useEffect
    const effectDeps = [loopProducts.length, itemWidth, direction];
    useEffect(() => {
      const interval = setInterval(() => {
        setOffset((prev) => {
          // Move smoothly in the direction specified
          const increment = direction === 'left' ? 0.5 : -0.5;
          let next = prev + increment;
          const maxOffset = (loopProducts.length / 2) * itemWidth;
          // If reached end, instantly reset to start
          if (direction === 'left' && next >= maxOffset) {
            setIsInstant(true);
            return 0;
          }
          if (direction === 'right' && next <= 0) {
            setIsInstant(true);
            return maxOffset;
          }
          setIsInstant(false);
          return next;
        });
      }, 16);
      return () => clearInterval(interval);
    }, effectDeps);

    return (
      <div className="py-6 animate-fadeInUp relative">
        {/* Fade effect on sides */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-background/80 to-transparent z-10" />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-background/80 to-transparent z-10" />
        <div className="flex items-center gap-2 mb-3 px-4">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="text-lg sm:text-xl font-bold text-foreground capitalize">{category}</h3>
        </div>
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
                className="px-2"
              >
                <CarouselProductCard product={product} />
              </div>
            ))}
          </div>
          {/* Navigation Buttons */}
          <button
            className="absolute top-1/2 left-2 -translate-y-1/2 z-20 h-10 w-10 bg-card text-foreground border-2 border-border hover:bg-muted hover:border-primary/50 transition-all rounded-full"
            onClick={() => setOffset((prev) => {
              const maxOffset = (loopProducts.length / 2) * itemWidth;
              // Left button always moves opposite to flow
              if (direction === 'left') {
                // Flow is left, so left button moves right
                return Math.min(prev + itemWidth, maxOffset);
              } else {
                // Flow is right, so left button moves left
                return Math.max(prev - itemWidth, 0);
              }
            })}
            aria-label="Previous"
          >
            &#8592;
          </button>
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 z-20 h-10 w-10 bg-card text-foreground border-2 border-border hover:bg-muted hover:border-primary/50 transition-all rounded-full"
            onClick={() => setOffset((prev) => {
              const maxOffset = (loopProducts.length / 2) * itemWidth;
              // Right button always moves in direction of flow
              if (direction === 'left') {
                // Flow is left, so right button moves left
                return Math.max(prev - itemWidth, 0);
              } else {
                // Flow is right, so right button moves right
                return Math.min(prev + itemWidth, maxOffset);
              }
            })}
            aria-label="Next"
          >
            &#8594;
          </button>
        </div>
      </div>
    )
  }

  export { CategoryCarousel }
