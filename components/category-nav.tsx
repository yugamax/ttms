"use client"

import Link from "next/link"
import { useState } from "react"

const categories = [
  { name: "Electronics", slug: "electronics", icon: "📱" },
  { name: "Home Appliances", slug: "home-appliances", icon: "🏠" },
  { name: "Fashion", slug: "fashion", icon: "👗" },
  { name: "Beauty", slug: "beauty", icon: "💄" },
  { name: "Sports", slug: "sports", icon: "⚽" },
  { name: "Books", slug: "books", icon: "📚" },
]

export function CategoryNav() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  return (
    <nav className="border-b border-border bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
              onMouseEnter={() => setHoveredCategory(category.slug)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
