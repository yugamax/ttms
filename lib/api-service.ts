export interface AmazonProduct {
  asin: string
  title: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  url: string
}

export interface FlipkartProduct {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  discount: number
  url: string
}

export interface MyntraProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  discount: number
  url: string
}

const mockAmazonProducts: AmazonProduct[] = [
  {
    asin: "B08AMAZON001",
    title: "Premium Wireless Headphones with Noise Cancellation",
    price: 2999,
    originalPrice: 4999,
    image: "/wireless-headphones.jpg",
    rating: 4.5,
    reviews: 2341,
    url: "https://amazon.in/dp/B08AMAZON001",
  },
  {
    asin: "B08AMAZON002",
    title: "USB-C Cable Pack (3 Meters)",
    price: 399,
    originalPrice: 599,
    image: "/usb-cable.jpg",
    rating: 4.3,
    reviews: 1203,
    url: "https://amazon.in/dp/B08AMAZON002",
  },
  {
    asin: "B08AMAZON003",
    title: "Mechanical Gaming Keyboard RGB",
    price: 3499,
    originalPrice: 5999,
    image: "/gaming-keyboard.jpg",
    rating: 4.6,
    reviews: 3421,
    url: "https://amazon.in/dp/B08AMAZON003",
  },
]

const mockFlipkartProducts: FlipkartProduct[] = [
  {
    id: "FK_GAMING_MOUSE_001",
    title: "Gaming Mouse Wireless with Ergonomic Design",
    price: 1299,
    originalPrice: 2499,
    image: "/gaming-mouse.jpg",
    rating: 4.4,
    reviews: 1852,
    discount: 48,
    url: "https://flipkart.com/p/FK_GAMING_MOUSE_001",
  },
  {
    id: "FK_MONITOR_27_001",
    title: "27 inch 4K UHD Monitor with HDR",
    price: 16999,
    originalPrice: 24999,
    image: "/4k-monitor.jpg",
    rating: 4.7,
    reviews: 5234,
    discount: 32,
    url: "https://flipkart.com/p/FK_MONITOR_27_001",
  },
  {
    id: "FK_WEBCAM_001",
    title: "HD 1080p Webcam with Autofocus",
    price: 2299,
    originalPrice: 3999,
    image: "/hd-webcam.jpg",
    rating: 4.2,
    reviews: 892,
    discount: 43,
    url: "https://flipkart.com/p/FK_WEBCAM_001",
  },
]

const mockMyntraProducts: MyntraProduct[] = [
  {
    id: "MYN_TSHIRT_PACK_001",
    name: "Cotton T-Shirt Combo Pack (Pack of 3)",
    price: 599,
    originalPrice: 1499,
    image: "/cotton-t-shirt.jpg",
    rating: 4.3,
    reviews: 4123,
    discount: 60,
    url: "https://myntra.com/p/MYN_TSHIRT_PACK_001",
  },
  {
    id: "MYN_SNEAKERS_001",
    name: "Casual Unisex Running Sneakers",
    price: 1299,
    originalPrice: 2999,
    image: "/running-sneakers.jpg",
    rating: 4.5,
    reviews: 6234,
    discount: 57,
    url: "https://myntra.com/p/MYN_SNEAKERS_001",
  },
  {
    id: "MYN_JACKET_001",
    name: "Premium Winter Jacket with Insulation",
    price: 2499,
    originalPrice: 5999,
    image: "/winter-jacket.jpg",
    rating: 4.6,
    reviews: 3452,
    discount: 58,
    url: "https://myntra.com/p/MYN_JACKET_001",
  },
]

export async function fetchAmazonProducts(): Promise<AmazonProduct[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockAmazonProducts
}

export async function fetchFlipkartProducts(): Promise<FlipkartProduct[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockFlipkartProducts
}

export async function fetchMyntraProducts(): Promise<MyntraProduct[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockMyntraProducts
}

export async function fetchFlashSaleProducts() {
  const allProducts = [
    ...mockAmazonProducts.map((p) => ({
      id: `amazon-${p.asin}`,
      name: p.title,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      source: "amazon" as const,
      discount: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
      rating: p.rating,
      reviews: p.reviews,
    })),
    ...mockFlipkartProducts.map((p) => ({
      id: `flipkart-${p.id}`,
      name: p.title,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      source: "flipkart" as const,
      discount: p.discount,
      rating: p.rating,
      reviews: p.reviews,
    })),
    ...mockMyntraProducts.map((p) => ({
      id: `myntra-${p.id}`,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      source: "myntra" as const,
      discount: p.discount,
      rating: p.rating,
      reviews: p.reviews,
    })),
  ]

  return allProducts.sort(() => Math.random() - 0.5).slice(0, 3)
}

export async function searchProducts(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const allProducts = [
    ...mockAmazonProducts.map((p) => ({ ...p, source: "amazon" })),
    ...mockFlipkartProducts.map((p) => ({ ...p, source: "flipkart" })),
    ...mockMyntraProducts.map((p) => ({ ...p, source: "myntra" })),
  ]

  return allProducts
    .filter((p) => (p.title || p.name || "").toLowerCase().includes(query.toLowerCase()))
    .map((p) => ({
      id: p.asin || p.id,
      title: p.title || p.name,
      name: p.name || p.title,
      price: p.price,
      image: p.image,
      source: p.source,
    }))
}
