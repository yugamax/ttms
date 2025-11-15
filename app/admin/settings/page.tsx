"use client"

import { useState } from "react"
import { Save, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const [showAmazonKey, setShowAmazonKey] = useState(false)
  const [showFlipkartKey, setShowFlipkartKey] = useState(false)
  const [settings, setSettings] = useState({
    amazon_tag: "yourafftag-20",
    amazon_api_key: "AKIA2L...",
    flipkart_id: "your_flipkart_id",
    flipkart_api_key: "fk_api...",
    store_name: "ShopHub",
    store_email: "admin@shophub.com",
  })

  const handleChange = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value })
  }

  const handleSave = () => {
    console.log("Saving settings:", settings)
    alert("Settings saved successfully!")
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
        <p className="text-muted-foreground">Configure your affiliate and store settings</p>
      </div>

      {/* Affiliate Configuration */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Affiliate Configuration</h3>

          {/* Amazon */}
          <div className="space-y-4 pb-6 border-b border-border">
            <h4 className="font-semibold text-foreground">Amazon Associates</h4>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Affiliate Tag</label>
              <input
                type="text"
                value={settings.amazon_tag}
                onChange={(e) => handleChange("amazon_tag", e.target.value)}
                className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your-tag-20"
              />
              <p className="text-xs text-muted-foreground mt-1">Your Amazon Associates affiliate tag</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">API Key</label>
              <div className="relative">
                <input
                  type={showAmazonKey ? "text" : "password"}
                  value={settings.amazon_api_key}
                  onChange={(e) => handleChange("amazon_api_key", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                  placeholder="AKIA..."
                />
                <button
                  onClick={() => setShowAmazonKey(!showAmazonKey)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showAmazonKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Flipkart */}
          <div className="space-y-4 pt-6">
            <h4 className="font-semibold text-foreground">Flipkart Affiliate</h4>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Affiliate ID</label>
              <input
                type="text"
                value={settings.flipkart_id}
                onChange={(e) => handleChange("flipkart_id", e.target.value)}
                className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your_flipkart_id"
              />
              <p className="text-xs text-muted-foreground mt-1">Your Flipkart affiliate ID</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">API Key</label>
              <div className="relative">
                <input
                  type={showFlipkartKey ? "text" : "password"}
                  value={settings.flipkart_api_key}
                  onChange={(e) => handleChange("flipkart_api_key", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                  placeholder="fk_api..."
                />
                <button
                  onClick={() => setShowFlipkartKey(!showFlipkartKey)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showFlipkartKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Configuration */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Store Settings</h3>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Store Name</label>
          <input
            type="text"
            value={settings.store_name}
            onChange={(e) => handleChange("store_name", e.target.value)}
            className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Store Email</label>
          <input
            type="email"
            value={settings.store_email}
            onChange={(e) => handleChange("store_email", e.target.value)}
            className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        Save Settings
      </button>
    </div>
  )
}
