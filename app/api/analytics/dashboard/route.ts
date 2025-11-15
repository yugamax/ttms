import { getSql } from "@/lib/db"

export async function GET() {
  try {
    const sql = getSql()

    // Total stats
    const stats = await sql(
      `SELECT
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM click_logs WHERE created_at > NOW() - INTERVAL '7 days') as clicks_7d,
        (SELECT COUNT(DISTINCT product_id) FROM click_logs WHERE created_at > NOW() - INTERVAL '7 days') as unique_products_clicked,
        (SELECT COUNT(DISTINCT DATE(created_at)) FROM click_logs WHERE created_at > NOW() - INTERVAL '7 days') as active_days
      `,
    )

    // Top merchants by clicks
    const topMerchants = await sql(
      `SELECT merchant, COUNT(*) as clicks, COUNT(DISTINCT product_id) as products
       FROM click_logs
       WHERE created_at > NOW() - INTERVAL '7 days'
       GROUP BY merchant
       ORDER BY clicks DESC`,
    )

    // Top products
    const topProducts = await sql(
      `SELECT p.id, p.title, p.rating, p.rating_count, COUNT(cl.id) as clicks
       FROM products p
       LEFT JOIN click_logs cl ON p.id = cl.product_id
       WHERE cl.created_at > NOW() - INTERVAL '7 days'
       GROUP BY p.id, p.title, p.rating, p.rating_count
       ORDER BY clicks DESC
       LIMIT 10`,
    )

    // Popular search queries
    const topSearches = await sql(
      `SELECT query, COUNT(*) as count, SUM(results_count) as total_results
       FROM search_queries
       WHERE created_at > NOW() - INTERVAL '7 days'
       GROUP BY query
       ORDER BY count DESC
       LIMIT 10`,
    )

    return Response.json({
      stats: stats[0],
      top_merchants: topMerchants,
      top_products: topProducts,
      top_searches: topSearches,
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    return Response.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
