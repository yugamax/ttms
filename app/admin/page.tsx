"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Package, ShoppingCart, Users } from "lucide-react"

interface DashboardStats {
  total_products: number
  clicks_7d: number
  unique_products_clicked: number
  active_days: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [topMerchants, setTopMerchants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/analytics/dashboard")
        const data = await response.json()
        setStats(data.stats)
        setTopProducts(data.top_products)
        setTopMerchants(data.top_merchants)
      } catch (error) {
        console.error("Error fetching dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Page title */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back to your affiliate dashboard</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Total Products</h3>
            <Package className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats?.total_products || 0}</p>
          <p className="text-xs text-muted-foreground mt-2">Active in catalog</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Clicks (7 days)</h3>
            <ShoppingCart className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats?.clicks_7d || 0}</p>
          <p className="text-xs text-muted-foreground mt-2">Affiliate clicks</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Products Clicked</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats?.unique_products_clicked || 0}</p>
          <p className="text-xs text-muted-foreground mt-2">Unique products</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Active Days</h3>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats?.active_days || 0}</p>
          <p className="text-xs text-muted-foreground mt-2">Last 7 days</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Merchants */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Merchants (7 days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topMerchants}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="merchant" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="clicks" fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Products (7 days)</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {topProducts.slice(0, 8).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-secondary rounded">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{product.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-yellow-600">★ {product.rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({product.rating_count})</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-accent">{product.clicks}</p>
                  <p className="text-xs text-muted-foreground">clicks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
