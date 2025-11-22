"use client"

import { Navbar } from "@/components/navbar"
import { FlashSaleSection } from "@/components/flash-sale-section"
import { Footer } from "@/components/footer"

export default function FlashDealsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 animate-slideInFromTop">
          <h1 className="text-4xl font-bold text-foreground mb-2">Flash Deals</h1>
          <p className="text-foreground/70">Catch our hottest limited-time offers before they're gone!</p>
        </div>
      </div>
      <FlashSaleSection />
      <Footer />
    </main>
  )
}
