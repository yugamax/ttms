import { neon } from "@neondatabase/serverless"
import seedData from "./seed-data.json"

const sql = neon(process.env.DATABASE_URL!)

async function seed() {
  try {
    console.log("🌱 Starting database seed...")

    // Seed categories
    console.log("📁 Seeding categories...")
    for (const category of seedData.categories) {
      await sql(`INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`, [
        category.name,
        category.slug,
        category.description,
      ])
    }

    // Seed products and merchant offers
    console.log("📦 Seeding products and merchant offers...")
    for (const product of seedData.products) {
      // Insert product
      const result = await sql(
        `INSERT INTO products (sku, title, description, brand, categories, tags, images, attributes, rating, rating_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (sku) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
         RETURNING id`,
        [
          product.sku,
          product.title,
          product.description,
          product.brand,
          product.categories,
          product.tags,
          product.images,
          JSON.stringify(product.attributes),
          product.rating,
          product.rating_count,
        ],
      )

      const productId = result[0].id

      // Insert merchant offers
      for (const offer of product.merchant_offers) {
        await sql(
          `INSERT INTO merchant_offers (product_id, merchant, merchant_sku, price, mrp, affiliate_url, currency, availability)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            productId,
            offer.merchant,
            offer.merchant_sku,
            offer.price,
            offer.mrp,
            offer.affiliate_url,
            "INR",
            "in_stock",
          ],
        )
      }
    }

    console.log("✅ Database seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  }
}

seed()
