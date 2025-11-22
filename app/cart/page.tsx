"use client"

import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CartPage() {
  const { user, loading } = useAuth()
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p>Loading cart...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8 animate-slideInFromTop">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 animate-fadeIn">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-foreground/70 mb-6">Start adding products to your cart!</p>
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="border-b border-border p-6 last:border-b-0 animate-slideInFromTop"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                        <p className="text-sm text-foreground/70 mb-3">
                          Source: {item.source.charAt(0).toUpperCase() + item.source.slice(1)}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-primary">₹{item.price.toLocaleString()}</span>
                          {item.originalPrice && (
                            <>
                              <span className="text-sm line-through text-foreground/60">
                                ₹{item.originalPrice.toLocaleString()}
                              </span>
                              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded font-bold">
                                {item.discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quantity and Remove */}
                      <div className="flex flex-col gap-4 items-end">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition"
                        >
                          <Trash2 size={20} />
                        </button>
                        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-background rounded transition"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-background rounded transition"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link href="/products">
                  <Button variant="outline" className="w-full bg-transparent">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-md p-6 border border-border sticky top-20">
                <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-foreground/70">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Shipping</span>
                    <span className="text-green-500 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Tax (18%)</span>
                    <span>₹{Math.round(total * 0.18).toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{Math.round(total * 1.18).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white mb-2">Proceed to Checkout</Button>
                </Link>
                <Button variant="outline" className="w-full text-destructive bg-transparent" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
