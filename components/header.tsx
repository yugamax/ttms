"use client"

import type React from "react"

import { ShoppingCart, Heart, User, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">SH</span>
            </div>
            <span className="hidden sm:inline font-bold text-lg text-primary">ShopHub</span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8 max-w-md">
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-r-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/wishlist" className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Wishlist">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="p-2 hover:bg-secondary rounded-lg transition-colors relative" title="Cart">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
            <Link href="/account" className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Account">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="px-3 py-2 rounded-lg bg-primary text-primary-foreground">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </header>
  )
}
