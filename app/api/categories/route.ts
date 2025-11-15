import { getSql } from "@/lib/db"
import type { Category } from "@/lib/db"

export async function GET() {
  try {
    const sql = getSql()

    const categories = await sql<Category>(`SELECT * FROM categories ORDER BY name ASC`)

    return Response.json(categories)
  } catch (error) {
    console.error("Categories fetch error:", error)
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
