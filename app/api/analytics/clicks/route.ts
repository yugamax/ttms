import { getSql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "7" // days
    const merchant = searchParams.get("merchant")

    const sql = getSql()

    // Get total clicks
    let whereClause = `created_at > NOW() - INTERVAL '${timeframe} days'`
    const params: any[] = []

    if (merchant) {
      whereClause += ` AND merchant = $1`
      params.push(merchant)
    }

    const totalClicks = await sql(`SELECT COUNT(*) as total FROM click_logs WHERE ${whereClause}`, params)

    // Get clicks by merchant
    const clicksByMerchant = await sql(
      `SELECT merchant, COUNT(*) as count FROM click_logs 
       WHERE ${whereClause}
       GROUP BY merchant
       ORDER BY count DESC`,
      params,
    )

    // Get clicks by product
    const topProducts = await sql(
      `SELECT p.id, p.title, COUNT(cl.id) as click_count
       FROM products p
       LEFT JOIN click_logs cl ON p.id = cl.product_id
       WHERE cl.created_at > NOW() - INTERVAL '${timeframe} days'
       ${merchant ? "AND cl.merchant = $1" : ""}
       GROUP BY p.id, p.title
       ORDER BY click_count DESC
       LIMIT 10`,
      merchant ? [merchant] : [],
    )

    // Get CTR per merchant
    const ctrStats = await sql(
      `SELECT 
         merchant,
         COUNT(*) as total_clicks,
         COUNT(DISTINCT product_id) as unique_products
       FROM click_logs
       WHERE ${whereClause}
       GROUP BY merchant`,
      params,
    )

    // Get clicks over time (last 7 days)
    const clicksOverTime = await sql(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM click_logs
       WHERE ${whereClause}
       GROUP BY DATE(created_at)
       ORDER BY date DESC
       LIMIT 7`,
      params,
    )

    return Response.json({
      summary: {
        total_clicks: totalClicks[0]?.total || 0,
        timeframe: `${timeframe} days`,
      },
      by_merchant: clicksByMerchant,
      top_products: topProducts,
      ctr_stats: ctrStats,
      clicks_over_time: clicksOverTime,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return Response.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
