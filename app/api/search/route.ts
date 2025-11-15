import { getSql } from "@/lib/db"
import type { Product, MerchantOffer } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const perPage = Number.parseInt(searchParams.get("per_page") || "24")
    const sortBy = searchParams.get("sort") || "relevance"

    // Parse filters
    const minPrice = searchParams.get("min_price") ? Number.parseInt(searchParams.get("min_price")!) : 0
    const maxPrice = searchParams.get("max_price") ? Number.parseInt(searchParams.get("max_price")!) : 999999
    const brands = searchParams.getAll("brand")
    const merchants = searchParams.getAll("merchant") || ["amazon", "flipkart"]
    const minRating = Number.parseFloat(searchParams.get("min_rating") || "0")

    const sql = getSql()
    const offset = (page - 1) * perPage

    // Build search query with full-text search
    const searchVector = `to_tsvector('english', title || ' ' || description || ' ' || brand || ' ' || array_to_string(tags, ' '))`
    const searchQuery = `plainto_tsquery('english', $1)`

    const whereConditions = [
      `(${searchVector} @@ ${searchQuery} OR title ILIKE $1 OR description ILIKE $1)`,
      "rating >= $2",
    ]

    const params: any[] = [`%${q}%`, minRating]

    // Add brand filter
    if (brands.length > 0) {
      whereConditions.push(`brand = ANY($${params.length + 1})`)
      params.push(brands)
    }

    // Add price filter
    whereConditions.push(`EXISTS (
      SELECT 1 FROM merchant_offers 
      WHERE product_id = products.id 
      AND price >= $${params.length + 1} 
      AND price <= $${params.length + 2}
      AND merchant = ANY($${params.length + 3})
    )`)
    params.push(minPrice, maxPrice, merchants)

    const whereClause = whereConditions.join(" AND ")

    // Build sort clause
    let orderClause = "rating DESC, rating_count DESC, updated_at DESC"
    if (sortBy === "price-low") {
      orderClause = `(SELECT MIN(price) FROM merchant_offers WHERE product_id = products.id) ASC`
    } else if (sortBy === "price-high") {
      orderClause = `(SELECT MAX(price) FROM merchant_offers WHERE product_id = products.id) DESC`
    } else if (sortBy === "newest") {
      orderClause = "created_at DESC"
    }

    // Get total count
    const countResult = await sql(`SELECT COUNT(*) as total FROM products WHERE ${whereClause}`, params)
    const total = countResult[0].total

    // Get products with pagination
    const products = await sql<Product>(
      `
        SELECT p.* FROM products p
        WHERE ${whereClause}
        ORDER BY ${orderClause}
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `,
      [...params, perPage, offset],
    )

    // Get merchant offers for each product
    const productsWithOffers = await Promise.all(
      products.map(async (product) => {
        const offers = await sql<MerchantOffer>(
          `SELECT * FROM merchant_offers WHERE product_id = $1 ORDER BY price ASC`,
          [product.id],
        )
        return { ...product, merchant_offers: offers }
      }),
    )

    // Log search query for analytics
    await sql(`INSERT INTO search_queries (query, results_count) VALUES ($1, $2)`, [q, total])

    return Response.json({
      data: productsWithOffers,
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
      query: q,
    })
  } catch (error) {
    console.error("Search error:", error)
    return Response.json({ error: "Search failed" }, { status: 500 })
  }
}
