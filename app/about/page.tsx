"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Zap, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-4xl mx-auto text-center animate-slideInFromTop">
          <h1 className="text-5xl font-bold text-foreground mb-4">About MADshop</h1>
          <p className="text-xl text-foreground/70">
            We're revolutionizing online shopping by bringing the best deals from multiple retailers in one smart
            platform.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Why Choose MADshop?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Browse products from Amazon, Flipkart, and Myntra all in one place",
              },
              {
                icon: Heart,
                title: "Smart Tracking",
                description: "Track price changes and never miss out on the best deals ever again",
              },
              {
                icon: Shield,
                title: "Secure & Safe",
                description: "Your data is protected with enterprise-grade security and encryption",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-card rounded-lg p-6 border border-border text-center hover:shadow-lg transition-all animate-slideInFromBottom"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <item.icon className="text-primary mx-auto mb-4" size={40} />
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-foreground/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center animate-scaleIn">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Save More?</h2>
          <p className="text-lg text-foreground/70 mb-8">
            Start shopping smarter today and discover incredible deals across all your favorite brands.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90 btn-hover-lift">
              Explore Products Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
