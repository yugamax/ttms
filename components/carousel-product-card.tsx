"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, ExternalLink, TrendingDown } from "lucide-react"

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
}

export function CarouselProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const discount =
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : product.discount || 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      router.push("/auth")
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      source: product.source,
      originalPrice: product.originalPrice,
      discount,
    })
  }

  const platformLinks: Record<string, string> = {
    amazon: "https://amazon.in",
    flipkart: "https://flipkart.com",
    myntra: "https://myntra.com",
  }

  const sourceBadgeColor: Record<string, string> = {
    amazon: "bg-yellow-500 text-black",
    flipkart: "bg-blue-600 text-white",
    myntra: "bg-pink-600 text-white",
  }

  const sourceName = product.source.charAt(0).toUpperCase() + product.source.slice(1)

  const handleCardClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".card-content")) {
      window.open(platformLinks[product.source], "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-border cursor-pointer h-full flex flex-col
        p-2 sm:p-2 md:p-3 lg:p-4
        w-full max-w-[180px] sm:max-w-[220px]"
      style={{
        animation: isHovering ? "pulse 0.6s ease-out" : "none",
      }}
    >
      {/* Image Container - Compact */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden"
        style={{ maxHeight: "120px" }}
      >
        <img
          src={product.image || "/placeholder.svg?height=200&width=200&query=product"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300
            max-h-28 sm:max-h-32 md:max-h-36 lg:max-h-40"
        />

        {/* Badge - Smaller */}
        <div
          className={`absolute top-2 right-2 ${sourceBadgeColor[product.source]} px-2 py-0.5 rounded-full text-xs font-bold animate-slideInFromRight`}
        >
          {sourceName}
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-secondary text-white px-1.5 py-0.5 rounded-full text-xs font-bold animate-slideInFromLeft">
            -{discount}%
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setLiked(!liked)
          }}
          className="absolute bottom-2 right-2 bg-white dark:bg-card rounded-full p-1.5 shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
        >
          <Heart size={16} className={liked ? "fill-secondary text-secondary" : "text-foreground"} />
        </button>
      </div>

      {/* Content - Compact */}
      <div className="p-1 sm:p-2 flex-1 flex flex-col card-content">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-1 text-xs">{product.name}</h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs font-bold text-primary">★ {product.rating}</span>
            <span className="text-xs text-foreground/60">({product.reviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-xs font-bold text-primary">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-foreground/60 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Platform Info */}
        <div className="mb-2 p-1.5 bg-muted/50 rounded text-xs text-foreground/70 flex-1">
          <p className="font-semibold text-foreground">Shop on {sourceName}</p>
          <p className="truncate text-xs">{platformLinks[product.source]}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-1 pt-1 border-t border-border/50">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-primary hover:bg-primary text-white text-xs py-1 rounded font-semibold transition-smooth active:scale-95"
          >
            Add
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="px-2 py-1.5 border border-border rounded hover:bg-muted transition-smooth active:scale-95"
            title="Track price"
          >
            <TrendingDown size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              window.open(platformLinks[product.source], "_blank", "noopener,noreferrer")
            }}
            className="px-2 py-1.5 border border-primary/50 rounded hover:bg-primary/10 hover:border-primary transition-all active:scale-95"
            title="View on platform"
          >
            <ExternalLink size={14} className="text-primary" />
          </button>
        </div>
      </div>
    </div>
  )
}
