import { getSql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const searchQuery = searchParams.get("q")

    const sql = getSql()

    // Get brands
    const brands = await sql<{ brand: string; count: number }>(
      `
        SELECT DISTINCT brand, COUNT(*) as count
        FROM products
        WHERE brand IS NOT NULL
        ${category ? "AND $1 = ANY(categories)" : ""}
        GROUP BY brand
        ORDER BY count DESC
        LIMIT 20
      `,
      category ? [category] : [],
    )

    // Get price ranges
    const priceStats = await sql<{ min_price: number; max_price: number }>(
      `
        SELECT 
          FLOOR(MIN(mo.price) / 1000) * 1000 as min_price,
          CEIL(MAX(mo.price) / 1000) * 1000 as max_price
        FROM merchant_offers mo
        JOIN products p ON mo.product_id = p.id
        ${category ? "WHERE $1 = ANY(p.categories)" : ""}
      `,
      category ? [category] : [],
    )

    // Get merchants
    const merchants = await sql<{ merchant: string; count: number }>(
      `
        SELECT merchant, COUNT(*) as count
        FROM merchant_offers
        GROUP BY merchant
        ORDER BY count DESC
      `,
    )

    return Response.json({
      brands: brands.map((b) => ({ name: b.brand, count: b.count })),
      price_range: priceStats[0] || { min_price: 0, max_price: 100000 },
      merchants: merchants.map((m) => ({ name: m.merchant, count: m.count })),
    })
  } catch (error) {
    console.error("Facets error:", error)
    return Response.json({ error: "Failed to fetch facets" }, { status: 500 })
  }
}
