"use client"

import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TrendingDown, AlertCircle, ShoppingBag } from "lucide-react"
import Link from "next/link"

interface TrackedProduct {
  id: string
  name: string
  price: number
  source: "amazon" | "flipkart" | "myntra"
  priceHistory: { date: string; price: number }[]
  image: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [trackedProducts, setTrackedProducts] = useState<TrackedProduct[]>([])
  const [favorites, setFavorites] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  // Load mock tracked products
  useEffect(() => {
    const mockTracked: TrackedProduct[] = [
      {
        id: "track-1",
        name: "Premium Wireless Headphones",
        price: 2999,
        source: "amazon",
        image: "/diverse-people-listening-headphones.png",
        priceHistory: [
          { date: "Day 1", price: 3999 },
          { date: "Day 2", price: 3799 },
          { date: "Day 3", price: 3499 },
          { date: "Day 4", price: 3199 },
          { date: "Day 5", price: 2999 },
        ],
      },
      {
        id: "track-2",
        name: "Ultra HD 4K Camera",
        price: 15999,
        source: "flipkart",
        image: "/vintage-camera-still-life.png",
        priceHistory: [
          { date: "Day 1", price: 24999 },
          { date: "Day 2", price: 22999 },
          { date: "Day 3", price: 18999 },
          { date: "Day 4", price: 17499 },
          { date: "Day 5", price: 15999 },
        ],
      },
    ]
    setTrackedProducts(mockTracked)
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p>Loading dashboard...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slideInFromTop">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, {user.email?.split("@")[0]}!</h1>
          <p className="text-foreground/70">Manage your wishlist and track price changes</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70 text-sm mb-1">Tracked Products</p>
                <p className="text-3xl font-bold text-primary">{trackedProducts.length}</p>
              </div>
              <TrendingDown size={40} className="text-primary/30" />
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70 text-sm mb-1">Total Savings</p>
                <p className="text-3xl font-bold text-accent">₹4,000</p>
              </div>
              <AlertCircle size={40} className="text-accent/30" />
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70 text-sm mb-1">Orders Placed</p>
                <p className="text-3xl font-bold text-secondary">0</p>
              </div>
              <ShoppingBag size={40} className="text-secondary/30" />
            </div>
          </div>
        </div>

        {/* Price Tracking Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Price Tracking</h2>
          <div className="grid gap-6">
            {trackedProducts.map((product) => {
              const lowestPrice = Math.min(...product.priceHistory.map((p) => p.price))
              const savings = product.priceHistory[0].price - product.price
              const savingsPercent = Math.round((savings / product.priceHistory[0].price) * 100)

              return (
                <div key={product.id} className="bg-card rounded-lg shadow-md p-6 border border-border">
                  <div className="flex gap-6 items-start">
                    {/* Image */}
                    <div className="w-32 h-32 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">{product.name}</h3>
                      <p className="text-sm text-foreground/70 mb-4">
                        Source: {product.source.charAt(0).toUpperCase() + product.source.slice(1)}
                      </p>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-foreground/70 mb-1">Current Price</p>
                          <p className="text-2xl font-bold text-primary">₹{product.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/70 mb-1">Lowest Price</p>
                          <p className="text-2xl font-bold text-accent">₹{lowestPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/70 mb-1">You Saved</p>
                          <p className="text-2xl font-bold text-green-500">
                            {savingsPercent}% (₹{savings.toLocaleString()})
                          </p>
                        </div>
                      </div>

                      {/* Price History Mini Chart */}
                      <div className="bg-muted rounded p-4 mb-4">
                        <p className="text-xs font-semibold text-foreground/70 mb-2">Price History</p>
                        <div className="flex items-end gap-1 h-12">
                          {product.priceHistory.map((point, idx) => {
                            const maxPrice = Math.max(...product.priceHistory.map((p) => p.price))
                            const minPrice = Math.min(...product.priceHistory.map((p) => p.price))
                            const range = maxPrice - minPrice
                            const height = ((point.price - minPrice) / range) * 100

                            return (
                              <div
                                key={idx}
                                className="flex-1 bg-primary rounded-t hover:bg-primary/80 transition relative group"
                                style={{ height: `${height}%`, minHeight: "4px" }}
                              >
                                <div className="invisible group-hover:visible absolute bottom-6 left-1/2 -translate-x-1/2 bg-background border border-border px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                                  ₹{point.price}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <Button className="bg-primary hover:bg-primary/90">View on {product.source}</Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Shop?</h3>
          <p className="text-foreground/70 mb-6">Browse our latest products and find amazing deals</p>
          <Link href="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
