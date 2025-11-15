import { getSql } from "@/lib/db"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const body = await request.json()

    const { product_id, merchant, affiliate_url } = body

    if (!product_id || !merchant || !affiliate_url) {
      return Response.json({ error: "Missing required fields: product_id, merchant, affiliate_url" }, { status: 400 })
    }

    const sql = getSql()
    const userAgent = headersList.get("user-agent") || ""
    const referrer = headersList.get("referer") || ""

    // Log the click
    await sql(
      `INSERT INTO click_logs (product_id, merchant, user_agent, referrer, affiliate_url)
       VALUES ($1, $2, $3, $4, $5)`,
      [product_id, merchant, userAgent, referrer, affiliate_url],
    )

    // Return redirect response with 302 status
    return Response.json(
      {
        success: true,
        message: "Click tracked successfully",
        redirectUrl: affiliate_url,
      },
      {
        status: 200,
        headers: {
          Location: affiliate_url,
        },
      },
    )
  } catch (error) {
    console.error("Click tracking error:", error)
    return Response.json({ error: "Failed to track click" }, { status: 500 })
  }
}
