"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Check, Truck, Lock, AlertCircle } from "lucide-react"

export default function CheckoutPage() {
  const { user, loading } = useAuth()
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push("/cart")
    }
  }, [items, router, orderPlaced])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setOrderPlaced(true)
    setIsProcessing(false)

    // Clear cart after order
    clearCart()

    // Show success for 3 seconds then redirect
    setTimeout(() => {
      router.push("/")
    }, 3000)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </main>
    )
  }

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-scaleIn">
          <div className="inline-block p-4 bg-green-500/20 rounded-full mb-6">
            <Check size={48} className="text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Order Placed Successfully!</h1>
          <p className="text-lg text-foreground/70 mb-6">
            Thank you for your purchase. Your order has been confirmed and will be delivered soon.
          </p>
          <div className="bg-card rounded-lg p-6 mb-8 border border-border">
            <p className="text-sm text-foreground/70 mb-2">Order ID</p>
            <p className="text-2xl font-bold text-primary">MAD-{Date.now()}</p>
          </div>
          <p className="text-foreground/70 mb-4">Redirecting to home...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8 animate-slideInFromTop">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Steps */}
            <div className="flex gap-4 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= s ? "bg-primary text-white" : "bg-muted text-foreground/50"
                    }`}
                  >
                    {step > s ? <Check size={20} /> : s}
                  </div>
                  <span className="text-sm font-medium text-foreground/70">
                    {s === 1 ? "Shipping" : s === 2 ? "Payment" : "Review"}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-lg shadow-md p-6 border border-border">
              {/* Shipping Address */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-xl font-bold text-foreground mb-6">Shipping Address</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    <Input
                      placeholder="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      className="md:col-span-2"
                    />
                    <Input
                      placeholder="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="md:col-span-2"
                    />
                    <Input
                      placeholder="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="md:col-span-2"
                    />
                    <Input placeholder="City" name="city" value={formData.city} onChange={handleInputChange} />
                    <Input placeholder="State" name="state" value={formData.state} onChange={handleInputChange} />
                    <Input placeholder="Pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} />
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={() => router.push("/cart")} className="flex-1">
                      Back to Cart
                    </Button>
                    <Button onClick={() => setStep(2)} className="flex-1 bg-primary hover:bg-primary/90">
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-xl font-bold text-foreground mb-6">Payment Method</h2>

                  <div className="bg-muted/50 rounded-lg p-6 mb-6 border-2 border-primary">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock size={24} className="text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Secure Checkout</p>
                        <p className="text-sm text-foreground/70">Your payment information is encrypted</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {["Credit/Debit Card", "UPI", "Net Banking", "Wallet"].map((method) => (
                      <div
                        key={method}
                        className="border-2 border-border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-muted/50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border-2 border-primary" />
                          <span className="font-medium text-foreground">{method}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={() => setStep(3)} className="flex-1 bg-primary hover:bg-primary/90">
                      Continue to Review
                    </Button>
                  </div>
                </div>
              )}

              {/* Order Review */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-xl font-bold text-foreground mb-6">Review Order</h2>

                  <div className="bg-muted/50 rounded-lg p-4 border border-border mb-6">
                    <p className="text-sm text-foreground/70 mb-2">Shipping To</p>
                    <p className="font-semibold text-foreground">
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p className="text-sm text-foreground/70">{formData.address}</p>
                    <p className="text-sm text-foreground/70">
                      {formData.city}, {formData.state} - {formData.pincode}
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-start gap-3 mb-4">
                      <Truck className="text-primary mt-1 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-semibold text-foreground">Free Delivery</p>
                        <p className="text-sm text-foreground/70">Delivery in 3-5 business days</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      {isProcessing ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-md p-6 border border-border sticky top-20">
              <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-border last:border-b-0">
                    <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-foreground line-clamp-1">{item.name}</p>
                      <p className="text-foreground/70">x{item.quantity}</p>
                      <p className="font-semibold text-primary">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-foreground/70 text-sm">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-foreground/70 text-sm">
                  <span>Shipping</span>
                  <span className="text-green-500 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-foreground/70 text-sm">
                  <span>Tax (18%)</span>
                  <span>₹{Math.round(total * 0.18).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground text-lg border-t border-border pt-3 mt-3">
                  <span>Total</span>
                  <span className="text-primary">₹{Math.round(total * 1.18).toLocaleString()}</span>
                </div>
              </div>

              {items.length > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded p-3 mt-4 flex gap-2">
                  <AlertCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 dark:text-green-400">
                    You're saving ₹
                    {items
                      .reduce((sum, item) => {
                        const discount = item.originalPrice ? item.originalPrice - item.price : 0
                        return sum + discount * item.quantity
                      }, 0)
                      .toLocaleString()}{" "}
                    on this order!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
