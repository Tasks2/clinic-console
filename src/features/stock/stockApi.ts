import { apiFetch } from '../../lib/api'

export interface Product {
  id: number
  title: string
  category: string
  stock: number
  price: number
  description: string
  thumbnail: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface Category {
  slug: string
  name: string
  url: string
}

export type SortField = 'title' | 'price' | 'stock'

export interface StockQueryParams {
  search: string
  category: string
  sort: SortField
  order: 'asc' | 'desc'
  page: number
}

export interface UpdateStockPayload {
  stock: number
}

const PAGE_SIZE = 10

export async function getProducts(
  { search, category, sort, order, page }: StockQueryParams,
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  let products: Product[]

  if (category) {
    const response = await apiFetch<ProductsResponse>(
      `/products/category/${encodeURIComponent(category)}?limit=0`,
      { signal },
    )

    products = response.products

    if (search) {
      products = products.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase()),
      )
    }
  } else if (search) {
    const response = await apiFetch<ProductsResponse>(
      `/products/search?q=${encodeURIComponent(search)}&limit=0`,
      { signal },
    )

    products = response.products
  } else {
    const response = await apiFetch<ProductsResponse>('/products?limit=0', {
      signal,
    })

    products = response.products
  }

  return sortProductsAndPaginate(products, sort, order, page)
}

function sortProducts(
  products: Product[],
  sort: SortField,
  order: 'asc' | 'desc',
): Product[] {
  return [...products].sort((a, b) => {
    const first = a[sort]
    const second = b[sort]

    if (typeof first === 'number' && typeof second === 'number') {
      return order === 'asc' ? first - second : second - first
    }

    return order === 'asc'
      ? String(first).localeCompare(String(second))
      : String(second).localeCompare(String(first))
  })
}

function sortProductsAndPaginate(
  products: Product[],
  sort: SortField,
  order: 'asc' | 'desc',
  page: number,
): ProductsResponse {
  const sorted = sortProducts(products, sort, order)

  const safePage = Math.max(1, page)
  const start = (safePage - 1) * PAGE_SIZE

  const paginatedProducts = sorted.slice(start, start + PAGE_SIZE)

  return {
    products: paginatedProducts,
    total: sorted.length,
    skip: start,
    limit: PAGE_SIZE,
  }
}

export function getProduct(id: string, signal?: AbortSignal) {
  return apiFetch<Product>(`/products/${encodeURIComponent(id)}`, { signal })
}

export async function getCategories(): Promise<string[]> {
  const categories = await apiFetch<Category[]>('/products/categories')

  return categories.map((category) => category.slug)
}

export function updateProductStock(id: number, payload: UpdateStockPayload) {
  return apiFetch<Product>(`/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export { PAGE_SIZE }
