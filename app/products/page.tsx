"use client"

import { Navbar } from "@/components/navbar"
import { ProductGrid } from "@/components/product-grid"
import { Footer } from "@/components/footer"

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 animate-slideInFromTop">
          <h1 className="text-4xl font-bold text-foreground mb-2">All Products</h1>
          <p className="text-foreground/70">Browse products from Amazon, Flipkart, and Myntra</p>
        </div>
        <ProductGrid />
      </div>
      <Footer />
    </main>
  )
}
