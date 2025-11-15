-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  brand VARCHAR(255),
  categories TEXT[] NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  images TEXT[] NOT NULL,
  attributes JSONB,
  rating DECIMAL(3,2),
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create merchant_offers table
CREATE TABLE IF NOT EXISTS merchant_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  merchant VARCHAR(100) NOT NULL,
  merchant_sku VARCHAR(255),
  price DECIMAL(12,2) NOT NULL,
  mrp DECIMAL(12,2),
  affiliate_url TEXT NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  availability VARCHAR(50) DEFAULT 'in_stock',
  last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create click_logs table for affiliate tracking
CREATE TABLE IF NOT EXISTS click_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  merchant VARCHAR(100) NOT NULL,
  user_agent TEXT,
  referrer VARCHAR(255),
  affiliate_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- Create search_queries table for analytics
CREATE TABLE IF NOT EXISTS search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query VARCHAR(255) NOT NULL,
  results_count INTEGER,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_categories ON products USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_merchant_offers_product_id ON merchant_offers(product_id);
CREATE INDEX IF NOT EXISTS idx_merchant_offers_merchant ON merchant_offers(merchant);
CREATE INDEX IF NOT EXISTS idx_click_logs_product_id ON click_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_click_logs_merchant ON click_logs(merchant);
CREATE INDEX IF NOT EXISTS idx_click_logs_created_at ON click_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_search_queries_created_at ON search_queries(created_at);
