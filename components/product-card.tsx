"use client"

import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink, TrendingDown } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

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
  timeLeft?: string
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [liked, setLiked] = useState(false)

  const discount =
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : product.discount || 0

  const handleAddToCart = () => {
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

  const handleTrackPrice = () => {
    if (!user) {
      router.push("/auth")
      return
    }
    alert("Added to price tracking! View trends in your dashboard.")
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

  return (
    <div
      className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:z-10 border border-border
      p-4 sm:p-4 md:p-4 lg:p-4
      w-full max-w-xs
      "
    >
      {/* Image Container */}
      <div
        className="relative w-full aspect-square bg-muted overflow-hidden"
        style={{ maxHeight: "180px" }}
      >
        <img
          src={product.image || "/placeholder.svg?height=300&width=300&query=product"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300
            max-h-36 sm:max-h-44 md:max-h-52 lg:max-h-56"
        />

        {/* Badge */}
        <div
          className={`absolute top-3 right-3 ${sourceBadgeColor[product.source]} px-3 py-1 rounded-full text-xs font-bold`}
        >
          {sourceName}
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-accent text-white px-2 py-1 rounded-full text-xs font-bold">
            -{discount}%
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute bottom-3 right-3 bg-white dark:bg-card rounded-full p-2 shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
        >
          <Heart size={20} className={liked ? "fill-accent text-accent" : "text-foreground"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 text-xs sm:text-sm">{product.name}</h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs font-bold text-primary">★ {product.rating}</span>
            <span className="text-xs text-foreground/60">({product.reviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base sm:text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-foreground/60 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <div className="mb-3 p-2 bg-muted/50 rounded text-xs text-foreground/70">
          <p className="font-semibold text-foreground mb-1">Shop on {sourceName}</p>
          <p className="truncate">Redirects to: {platformLinks[product.source]}</p>
        </div>

        {/* Flash Sale Timer */}
        {product.timeLeft && <div className="text-xs text-accent font-semibold mb-2">⏱️ {product.timeLeft}</div>}

        {/* Buttons */}
        <div className="flex gap-1 sm:gap-2">
          <Button onClick={handleAddToCart} className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm py-1 sm:py-2">
            Add to Cart
          </Button>
          <Button onClick={handleTrackPrice} variant="outline" className="px-2 sm:px-3 bg-transparent" title="Track price">
            <TrendingDown size={14} />
          </Button>
          <a
            href={platformLinks[product.source]}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 sm:px-3 py-1 sm:py-2 border border-border rounded-md hover:bg-muted transition-smooth flex items-center"
            title="View on platform"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}
