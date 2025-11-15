import { neon } from "@neondatabase/serverless"

// Create singleton SQL client
let sql: ReturnType<typeof neon> | null = null

export function getSql() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required")
    }
    sql = neon(process.env.DATABASE_URL)
  }
  return sql
}

// Type definitions for database operations
export type Product = {
  id: string
  sku: string
  title: string
  description: string
  brand: string
  categories: string[]
  tags: string[]
  images: string[]
  attributes: Record<string, any>
  rating: number
  rating_count: number
  created_at: string
  updated_at: string
}

export type MerchantOffer = {
  id: string
  product_id: string
  merchant: string
  merchant_sku: string
  price: number
  mrp: number
  affiliate_url: string
  currency: string
  availability: string
  last_checked: string
  created_at: string
  updated_at: string
}

export type ClickLog = {
  id: string
  product_id: string
  merchant: string
  user_agent: string | null
  referrer: string | null
  affiliate_url: string
  created_at: string
}

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  icon_url: string | null
  created_at: string
  updated_at: string
}
