"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoryNav } from "@/components/category-nav"
import { MerchantOfferButton } from "@/components/merchant-offer-button"
import Image from "next/image"
import { Star, Heart, Share2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock product data
const mockProduct = {
  id: "1",
  title: "Sony WH-1000XM5 Wireless Headphones",
  description:
    "Industry-leading noise cancelling with 30-hour battery life. Premium sound quality with comfortable fit for all-day use.",
  brand: "Sony",
  rating: 4.6,
  ratingCount: 3421,
  images: ["/placeholder.svg?key=6snly", "/placeholder.svg?key=uiace"],
  attributes: {
    color: "Black",
    battery: "30h",
    weight: "250g",
    connectivity: "Bluetooth 5.3",
  },
  merchantOffers: [
    {
      id: "mo-1",
      merchant: "amazon",
      name: "Amazon",
      price: 24999,
      mrp: 29999,
      availability: "in_stock",
      affiliate_url: "https://amazon.in/Sony-WH-1000XM5-Noise-Cancelling?tag=AFFILIATE_TAG_AMAZON",
    },
    {
      id: "mo-2",
      merchant: "flipkart",
      name: "Flipkart",
      price: 24499,
      mrp: 29999,
      availability: "in_stock",
      affiliate_url: "https://flipkart.com/Sony-WH-1000XM5?affid=AFFILIATE_TAG_FLIPKART",
    },
  ],
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const cheapestOffer = mockProduct.merchantOffers.reduce((min, offer) => (offer.price < min.price ? offer : min))

  const discount = Math.round(((cheapestOffer.mrp - cheapestOffer.price) / cheapestOffer.mrp) * 100)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CategoryNav />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Product</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Images */}
            <div>
              <div className="bg-secondary rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center">
                <Image
                  src={mockProduct.images[selectedImage] || "/placeholder.svg"}
                  alt={mockProduct.title}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {mockProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 flex-shrink-0 rounded border-2 overflow-hidden ${
                      selectedImage === index ? "border-primary" : "border-border"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`View ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              {/* Brand and Title */}
              <div>
                <p className="text-sm text-primary font-semibold mb-2">{mockProduct.brand}</p>
                <h1 className="text-3xl font-bold text-foreground mb-4">{mockProduct.title}</h1>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{mockProduct.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    ({mockProduct.ratingCount.toLocaleString()} ratings)
                  </span>
                </div>
              </div>

              {/* Price Comparison */}
              <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                <p className="text-sm text-muted-foreground mb-3">Best Price Available</p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-accent">₹{cheapestOffer.price.toLocaleString()}</span>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{cheapestOffer.mrp.toLocaleString()}
                  </span>
                  <span className="text-lg font-bold text-green-600">{discount}% OFF</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Available on {mockProduct.merchantOffers.map((o) => o.name).join(", ")}
                </p>
              </div>

              {/* Attributes */}
              <div>
                <h3 className="font-semibold mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(mockProduct.attributes).map(([key, value]) => (
                    <div key={key} className="bg-secondary p-3 rounded">
                      <p className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</p>
                      <p className="font-semibold text-foreground">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-colors ${
                    isWishlisted
                      ? "border-red-500 text-red-500 bg-red-50"
                      : "border-border text-foreground hover:border-primary"
                  }`}
                >
                  <Heart className="w-5 h-5 mx-auto" />
                </button>
                <button className="flex-1 py-3 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors font-semibold">
                  <Share2 className="w-5 h-5 mx-auto" />
                </button>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Buy from Trusted Merchants</h3>
                <div className="space-y-3">
                  {mockProduct.merchantOffers.map((offer) => (
                    <MerchantOfferButton
                      key={offer.id}
                      productId={mockProduct.id}
                      merchant={offer.merchant}
                      merchantName={offer.name}
                      price={offer.price}
                      mrp={offer.mrp}
                      affiliateUrl={offer.affiliate_url}
                      availability={offer.availability}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{mockProduct.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
