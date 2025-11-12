"use client"

export async function trackAffiliateClick(productId: string, merchant: string, affiliateUrl: string) {
  try {
    const response = await fetch("/api/click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        merchant,
        affiliate_url: affiliateUrl,
      }),
    })

    const data = await response.json()

    if (data.redirectUrl) {
      // Open in new tab after tracking
      window.open(data.redirectUrl, "_blank")
    }

    return data
  } catch (error) {
    console.error("Error tracking click:", error)
    // Fallback: open affiliate link directly if tracking fails
    window.open(affiliateUrl, "_blank")
  }
}
