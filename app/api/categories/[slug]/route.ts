import { getSql } from "@/lib/db"
import type { Category } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await Promise.resolve(params)
    const sql = getSql()

    const category = await sql<Category>(`SELECT * FROM categories WHERE slug = $1`, [slug])

    if (category.length === 0) {
      return Response.json({ error: "Category not found" }, { status: 404 })
    }

    return Response.json(category[0])
  } catch (error) {
    console.error("Category fetch error:", error)
    return Response.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}
