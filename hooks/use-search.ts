import useSWR from "swr"

interface SearchParams {
  q: string
  page?: number
  per_page?: number
  sort?: string
  min_price?: number
  max_price?: number
  brand?: string[]
  merchant?: string[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useSearch(params: SearchParams) {
  const queryString = new URLSearchParams()
  queryString.set("q", params.q)
  if (params.page) queryString.set("page", params.page.toString())
  if (params.per_page) queryString.set("per_page", params.per_page.toString())
  if (params.sort) queryString.set("sort", params.sort)
  if (params.min_price) queryString.set("min_price", params.min_price.toString())
  if (params.max_price) queryString.set("max_price", params.max_price.toString())
  if (params.brand) params.brand.forEach((b) => queryString.append("brand", b))
  if (params.merchant) params.merchant.forEach((m) => queryString.append("merchant", m))

  const { data, error, isLoading } = useSWR(`/api/search?${queryString.toString()}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  return {
    results: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
  }
}

export function useRecommendations(productId: string, type: "related" | "trending" | "also_viewed" = "related") {
  const { data, error, isLoading } = useSWR(
    `/api/recommendations?product_id=${productId}&type=${type}&limit=8`,
    fetcher,
    { revalidateOnFocus: false },
  )

  return {
    products: data?.data || [],
    isLoading,
    error,
  }
}

export function useFacets(category?: string, query?: string) {
  const queryString = new URLSearchParams()
  if (category) queryString.set("category", category)
  if (query) queryString.set("q", query)

  const { data, error, isLoading } = useSWR(`/api/facets?${queryString.toString()}`, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    brands: data?.brands || [],
    priceRange: data?.price_range || { min_price: 0, max_price: 100000 },
    merchants: data?.merchants || [],
    isLoading,
    error,
  }
}
