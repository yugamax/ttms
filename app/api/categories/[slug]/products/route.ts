import { getSql } from "@/lib/db"
import type { Product, MerchantOffer } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await Promise.resolve(params)
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const perPage = Number.parseInt(searchParams.get("per_page") || "12")
    const sortBy = searchParams.get("sort") || "popular"
    const minPrice = searchParams.get("min_price") ? Number.parseInt(searchParams.get("min_price")!) : 0
    const maxPrice = searchParams.get("max_price") ? Number.parseInt(searchParams.get("max_price")!) : 999999

    const sql = getSql()
    const offset = (page - 1) * perPage

    // Convert slug to category name
    const categoryName = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    // Build sort clause
    let orderClause = "rating DESC, rating_count DESC"
    if (sortBy === "price-low") {
      orderClause = `(SELECT MIN(price) FROM merchant_offers WHERE product_id = products.id) ASC`
    } else if (sortBy === "price-high") {
      orderClause = `(SELECT MAX(price) FROM merchant_offers WHERE product_id = products.id) DESC`
    } else if (sortBy === "newest") {
      orderClause = "created_at DESC"
    }

    // Get total count
    const countResult = await sql(
      `
        SELECT COUNT(*) as total FROM products
        WHERE $1 = ANY(categories)
        AND EXISTS (
          SELECT 1 FROM merchant_offers 
          WHERE product_id = products.id 
          AND price >= $2 AND price <= $3
        )
      `,
      [categoryName, minPrice, maxPrice],
    )
    const total = countResult[0].total

    // Get products
    const products = await sql<Product>(
      `
        SELECT p.* FROM products p
        WHERE $1 = ANY(p.categories)
        AND EXISTS (
          SELECT 1 FROM merchant_offers 
          WHERE product_id = p.id 
          AND price >= $2 AND price <= $3
        )
        ORDER BY ${orderClause}
        LIMIT $4 OFFSET $5
      `,
      [categoryName, minPrice, maxPrice, perPage, offset],
    )

    // Get merchant offers
    const productsWithOffers = await Promise.all(
      products.map(async (product) => {
        const offers = await sql<MerchantOffer>(
          `SELECT * FROM merchant_offers WHERE product_id = $1 ORDER BY price ASC`,
          [product.id],
        )
        return { ...product, merchant_offers: offers }
      }),
    )

    return Response.json({
      data: productsWithOffers,
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
      category: categoryName,
    })
  } catch (error) {
    console.error("Category products error:", error)
    return Response.json({ error: "Failed to fetch category products" }, { status: 500 })
  }
}
