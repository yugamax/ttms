"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary/10 via-background to-accent/10 py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="animate-slideInFromTop">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              Shop Smart, <span className="text-primary">Save Bigger</span>
            </h1>
            <p className="text-base sm:text-lg text-foreground/70 mb-6">
              Discover products from Amazon, Flipkart, and Myntra in one place. Track prices, find flash deals, and
              never miss a bargain.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                  Explore Products
                </Button>
              </Link>
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  View Deals
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block animate-scaleIn">
            <div className="relative w-full aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center text-6xl sm:text-7xl overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              <span className="animate-float">🛍️</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
