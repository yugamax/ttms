"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function AnalyticsPage() {
  const [clicksData, setClicksData] = useState<any[]>([])
  const [merchantData, setMerchantData] = useState<any[]>([])
  const [timeframe, setTimeframe] = useState("7")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/clicks?timeframe=${timeframe}`)
        const data = await response.json()
        setClicksData(data.clicks_over_time)
        setMerchantData(data.by_merchant)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeframe])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Analytics</h2>
          <p className="text-muted-foreground">Track your affiliate performance</p>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-4 py-2 border border-border rounded bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clicks Over Time */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Clicks Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clicksData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-primary)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Clicks by Merchant */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Clicks by Merchant</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={merchantData}>
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
                <Bar dataKey="count" fill="var(--color-accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Merchant Table */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Merchant Performance</h3>
            <div className="space-y-3">
              {merchantData.map((merchant) => (
                <div key={merchant.merchant} className="flex items-center justify-between p-3 bg-secondary rounded">
                  <div>
                    <p className="font-semibold text-foreground capitalize">{merchant.merchant}</p>
                    <p className="text-xs text-muted-foreground">Unique products: {merchant.unique_products}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{merchant.count}</p>
                    <p className="text-xs text-muted-foreground">clicks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
