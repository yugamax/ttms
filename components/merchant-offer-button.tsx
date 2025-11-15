"use client"

import type React from "react"

import { trackAffiliateClick } from "@/lib/click-tracker"
import { ExternalLink, Loader2 } from "lucide-react"
import { useState } from "react"

interface MerchantOfferButtonProps {
  productId: string
  merchant: string
  merchantName: string
  price: number
  mrp: number
  affiliateUrl: string
  availability: string
}

export function MerchantOfferButton({
  productId,
  merchant,
  merchantName,
  price,
  mrp,
  affiliateUrl,
  availability,
}: MerchantOfferButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await trackAffiliateClick(productId, merchant, affiliateUrl)

    setIsLoading(false)
  }

  const discount = Math.round(((mrp - price) / mrp) * 100)

  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary hover:shadow-md transition-all">
      <div>
        <p className="font-semibold text-foreground">{merchantName}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-lg font-bold text-primary">₹{price.toLocaleString()}</span>
          {mrp > price && (
            <>
              <span className="text-sm text-muted-foreground line-through">₹{mrp.toLocaleString()}</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">{discount}% OFF</span>
            </>
          )}
          {availability === "in_stock" && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">In Stock</span>
          )}
        </div>
      </div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Opening...
          </>
        ) : (
          <>
            View Deal
            <ExternalLink className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  )
}
