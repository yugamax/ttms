import { getSql } from "@/lib/db"
import type { Product, MerchantOffer } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "related"
    const productId = searchParams.get("product_id")
    const limit = Number.parseInt(searchParams.get("limit") || "8")

    if (!productId) {
      return Response.json({ error: "product_id is required" }, { status: 400 })
    }

    const sql = getSql()

    // Get the current product
    const currentProduct = await sql<Product>(`SELECT * FROM products WHERE id = $1`, [productId])

    if (currentProduct.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 })
    }

    const product = currentProduct[0]
    let recommendedProducts: Product[] = []

    if (type === "related") {
      // Find products with same category or tags
      recommendedProducts = await sql<Product>(
        `
          SELECT DISTINCT p.* FROM products p
          WHERE p.id != $1
          AND (
            p.categories && $2::text[] 
            OR p.tags && $3::text[]
            OR p.brand = $4
          )
          ORDER BY p.rating DESC, p.rating_count DESC
          LIMIT $5
        `,
        [productId, product.categories, product.tags, product.brand, limit],
      )
    } else if (type === "trending") {
      // Get trending products based on recent clicks (last 7 days)
      const trendingQuery = `
        SELECT p.*, COUNT(cl.id) as click_count
        FROM products p
        LEFT JOIN click_logs cl ON p.id = cl.product_id
        WHERE cl.created_at > NOW() - INTERVAL '7 days'
        GROUP BY p.id
        ORDER BY click_count DESC, p.rating DESC
        LIMIT $1
      `
      recommendedProducts = await sql<Product>(trendingQuery, [limit])
    } else if (type === "also_viewed") {
      // Find products frequently viewed together
      recommendedProducts = await sql<Product>(
        `
          SELECT DISTINCT p.* FROM products p
          WHERE p.id IN (
            SELECT DISTINCT cl2.product_id
            FROM click_logs cl1
            JOIN click_logs cl2 ON cl1.user_agent = cl2.user_agent 
              AND cl1.created_at > NOW() - INTERVAL '1 day'
              AND cl2.created_at > NOW() - INTERVAL '1 day'
            WHERE cl1.product_id = $1
            AND cl2.product_id != $1
          )
          ORDER BY p.rating DESC, p.rating_count DESC
          LIMIT $2
        `,
        [productId, limit],
      )
    }

    // Get merchant offers for recommended products
    const withOffers = await Promise.all(
      recommendedProducts.map(async (prod) => {
        const offers = await sql<MerchantOffer>(
          `SELECT * FROM merchant_offers WHERE product_id = $1 ORDER BY price ASC LIMIT 2`,
          [prod.id],
        )
        return { ...prod, merchant_offers: offers }
      }),
    )

    return Response.json({
      type,
      data: withOffers,
    })
  } catch (error) {
    console.error("Recommendations error:", error)
    return Response.json({ error: "Failed to get recommendations" }, { status: 500 })
  }
}
