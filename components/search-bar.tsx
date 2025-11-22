"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { searchProducts } from "@/lib/api-service"
import { useRouter } from "next/navigation"

interface SearchProduct {
  id: string
  name?: string
  title?: string
  price: number
  image: string
  source?: string
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchProduct[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 2) {
      setLoading(true)
      try {
        const products = await searchProducts(value)
        setResults(products as SearchProduct[])
        setIsOpen(true)
      } catch (error) {
        console.error("[v0] Search error:", error)
      } finally {
        setLoading(false)
      }
    } else {
      setResults([])
      setIsOpen(false)
    }
  }

  const sourceBadgeColor: Record<string, string> = {
    amazon: "bg-yellow-500 text-black",
    flipkart: "bg-blue-600 text-white",
    myntra: "bg-pink-600 text-white",
  }

  return (
    <div className="relative flex-1 w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
        <Input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={handleSearch}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          className="pl-10 pr-8 w-full"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setResults([])
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg shadow-xl mt-2 max-h-80 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 text-center text-foreground/70">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-border">
              {results.slice(0, 8).map((product, idx) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setIsOpen(false)
                    setQuery("")
                  }}
                  className="w-full p-3 hover:bg-muted transition text-left flex gap-3 items-center group"
                  style={{ animation: `slideInFromTop 0.3s ease-out ${idx * 50}ms both` }}
                >
                  <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg?height=50&width=50"}
                      alt={product.title || product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition">
                      {product.title || product.name}
                    </p>
                    <div className="flex items-center gap-2 justify-between">
                      <p className="text-xs text-primary font-bold">₹{product.price.toLocaleString()}</p>
                      {product.source && (
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            sourceBadgeColor[product.source] || "bg-gray-500 text-white"
                          }`}
                        >
                          {product.source}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-foreground/70 text-sm">No products found</div>
          )}
        </div>
      )}
    </div>
  )
}
