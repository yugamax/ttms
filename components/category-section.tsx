"use client"

import type React from "react"

import { useState } from "react"
import { Shirt, Zap, Headphones, Home, Smile } from "lucide-react"

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  color: string
}

const categories: Category[] = [
  { id: "fashion", name: "Fashion", icon: <Shirt size={24} />, color: "from-pink-500 to-rose-500" },
  { id: "electronics", name: "Electronics", icon: <Zap size={24} />, color: "from-blue-500 to-cyan-500" },
  { id: "audio", name: "Audio", icon: <Headphones size={24} />, color: "from-purple-500 to-indigo-500" },
  { id: "home", name: "Home", icon: <Home size={24} />, color: "from-green-500 to-emerald-500" },
  { id: "beauty", name: "Beauty", icon: <Smile size={24} />, color: "from-orange-500 to-red-500" },
]

export function CategorySection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <section className="py-8 px-4 border-b border-border/50">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-foreground mb-6">Shop by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                  : "bg-card hover:bg-muted border border-border text-foreground"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={selectedCategory === category.id ? "text-white" : "text-primary"}>{category.icon}</div>
                <p className="text-sm font-semibold text-center">{category.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
