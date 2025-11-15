"use client"

import { Header } from "@/components/header"
import { CategoryNav } from "@/components/category-nav"
import { ProductCard } from "@/components/product-card"
import { Footer } from "@/components/footer"
import { useState } from "react"

// Mock category products
const categoryProducts = [
  {
    id: "1",
    title: "Sony WH-1000XM5 Wireless Headphones",
    price: 24999,
    mrp: 29999,
    image: "/wireless-headphones.png",
    rating: 4.6,
    ratingCount: 3421,
    merchants: [
      { name: "amazon", badge: "Amazon" },
      { name: "flipkart", badge: "Flipkart" },
    ],
  },
  {
    id: "2",
    title: "Apple MacBook Air M3 13-inch",
    price: 99999,
    mrp: 109999,
    image: "/macbook-air.jpg",
    rating: 4.7,
    ratingCount: 2154,
    merchants: [
      { name: "amazon", badge: "Amazon" },
      { name: "flipkart", badge: "Flipkart" },
    ],
  },
  {
    id: "3",
    title: "Samsung Galaxy S24 Ultra",
    price: 84999,
    mrp: 99999,
    image: "/galaxy-s24.jpg",
    rating: 4.5,
    ratingCount: 4521,
    merchants: [
      { name: "amazon", badge: "Amazon" },
      { name: "flipkart", badge: "Flipkart" },
    ],
  },
  {
    id: "4",
    title: "Dyson V15 Detect Cordless Vacuum",
    price: 54999,
    mrp: 64999,
    image: "/dyson-vacuum.jpg",
    rating: 4.4,
    ratingCount: 892,
    merchants: [
      { name: "amazon", badge: "Amazon" },
      { name: "flipkart", badge: "Flipkart" },
    ],
  },
]

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("popular")

  const categoryNames: Record<string, string> = {
    electronics: "Electronics",
    fashion: "Fashion",
    beauty: "Beauty",
    "home-appliances": "Home Appliances",
    sports: "Sports",
    books: "Books",
  }

  const categoryName = categoryNames[params.slug] || "Products"

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CategoryNav />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">{categoryName}</h1>
            <p className="text-muted-foreground">Browse our collection of {categoryName.toLowerCase()}</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden"} lg:block`}>
              <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
                <h2 className="font-bold text-lg mb-6 flex items-center justify-between lg:flex-col lg:items-start">
                  Filters
                  <button onClick={() => setShowFilters(false)} className="lg:hidden text-muted-foreground">
                    ✕
                  </button>
                </h2>

                {/* Price Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-sm mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>Under ₹5,000</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>₹5,000 - ₹10,000</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>₹10,000 - ₹50,000</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>Above ₹50,000</span>
                    </label>
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-sm mb-3">Brand</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>Sony</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>Apple</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>Samsung</span>
                    </label>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-sm mb-3">Customer Rating</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>4★ & above</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>3★ & above</span>
                    </label>
                  </div>
                </div>

                {/* Merchant Filter */}
                <div>
                  <h3 className="font-semibold text-sm mb-3">Merchant</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                      <span>Amazon</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                      <span>Flipkart</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">Showing {categoryProducts.length} products</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden px-4 py-2 border border-border rounded text-sm font-medium"
                  >
                    Filters
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-border rounded bg-card text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rating</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>

              {/* Products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-12">
                <button className="px-4 py-2 border border-border rounded hover:bg-secondary transition-colors">
                  Previous
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded">1</button>
                <button className="px-4 py-2 border border-border rounded hover:bg-secondary transition-colors">
                  2
                </button>
                <button className="px-4 py-2 border border-border rounded hover:bg-secondary transition-colors">
                  3
                </button>
                <button className="px-4 py-2 border border-border rounded hover:bg-secondary transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
