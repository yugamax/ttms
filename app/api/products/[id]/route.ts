import { getSql } from "@/lib/db"
import type { Product, MerchantOffer } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getSql()
    const { id } = await Promise.resolve(params)

    // Get product
    const productResult = await sql<Product>(`SELECT * FROM products WHERE id = $1`, [id])

    if (productResult.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 })
    }

    const product = productResult[0]

    // Get merchant offers
    const offersResult = await sql<MerchantOffer>(
      `SELECT * FROM merchant_offers WHERE product_id = $1 ORDER BY price ASC`,
      [id],
    )

    return Response.json({
      ...product,
      merchant_offers: offersResult,
    })
  } catch (error) {
    console.error("Product fetch error:", error)
    return Response.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
