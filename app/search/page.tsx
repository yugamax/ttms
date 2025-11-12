"use client"

import { Header } from "@/components/header"
import { CategoryNav } from "@/components/category-nav"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { useSearch, useFacets } from "@/hooks/use-search"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState("popular")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const { results, pagination, isLoading } = useSearch({
    q: query,
    page,
    per_page: 24,
    sort: sortBy,
    min_price: priceRange.min,
    max_price: priceRange.max,
    brand: selectedBrands,
  })

  const { brands, priceRange: facetPriceRange } = useFacets(undefined, query)

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <CategoryNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Searching...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CategoryNav />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Search Results for "{query}"</h1>
            <p className="text-muted-foreground">{pagination?.total} products found</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden"} lg:block`}>
              <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
                <h2 className="font-bold text-lg mb-6">Filters</h2>

                {/* Price Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-sm mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number.parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-border rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number.parseInt(e.target.value) || 100000 })}
                      className="w-full px-3 py-2 border border-border rounded text-sm"
                    />
                  </div>
                </div>

                {/* Brand Filter */}
                {brands.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-sm mb-3">Brand</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {brands.slice(0, 10).map((brand) => (
                        <label key={brand.name} className="flex items-center gap-3 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBrands([...selectedBrands, brand.name])
                              } else {
                                setSelectedBrands(selectedBrands.filter((b) => b !== brand.name))
                              }
                            }}
                            className="w-4 h-4 rounded"
                          />
                          <span>{brand.name}</span>
                          <span className="text-xs text-muted-foreground">({brand.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden px-4 py-2 border border-border rounded text-sm font-medium"
                >
                  Filters
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value)
                    setPage(1)
                  }}
                  className="px-4 py-2 border border-border rounded bg-card text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {results.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {results.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={product.merchant_offers[0]?.price || 0}
                        mrp={product.merchant_offers[0]?.mrp || 0}
                        image={product.images[0] || "/placeholder.svg"}
                        rating={product.rating}
                        ratingCount={product.rating_count}
                        merchants={product.merchant_offers.map((o: any) => ({
                          name: o.merchant,
                          badge: o.merchant.charAt(0).toUpperCase() + o.merchant.slice(1),
                        }))}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.total_pages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-border rounded hover:bg-secondary disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-4 py-2 rounded ${
                            page === p
                              ? "bg-primary text-primary-foreground"
                              : "border border-border hover:bg-secondary"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage(Math.min(pagination.total_pages, page + 1))}
                        disabled={page === pagination.total_pages}
                        className="px-4 py-2 border border-border rounded hover:bg-secondary disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No products found matching your search.</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
