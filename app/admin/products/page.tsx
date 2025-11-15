"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Search } from "lucide-react"

const mockProducts = [
  {
    id: "1",
    sku: "ELEC-001",
    title: "Sony WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    category: "Electronics",
    rating: 4.6,
    status: "Active",
  },
  {
    id: "2",
    sku: "ELEC-002",
    title: "Apple MacBook Air M3 13-inch",
    brand: "Apple",
    category: "Electronics",
    rating: 4.7,
    status: "Active",
  },
  {
    id: "3",
    sku: "FASHION-001",
    title: "PUMA Men's Athletic Running Shoes",
    brand: "PUMA",
    category: "Fashion",
    rating: 4.2,
    status: "Active",
  },
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState(mockProducts)

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Products</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 w-fit">
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by title or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-background border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Product Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Brand</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-border hover:bg-secondary transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-mono">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">{product.title}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{product.brand}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{product.category}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-yellow-600 font-semibold">★ {product.rating}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-secondary rounded transition-colors text-primary">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded transition-colors text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}
