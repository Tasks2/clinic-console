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

export interface StockQueryParams {
  search: string
  category: string
  sort: string
  order: 'asc' | 'desc'
  page: number
}

const PAGE_SIZE = 10

export async function getProducts({
  search,
  category,
  sort,
  order,
  page,
}: StockQueryParams, signal?: AbortSignal) {
  let products: Product[]

  if (category) {
    const response = await apiFetch<ProductsResponse>(
      `/products/category/${encodeURIComponent(category)}`,
      { signal }
    )

    products = response.products

    if (search) {
      products = products.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase()),
      )
    }
  } else if (search) {
    const response = await apiFetch<ProductsResponse>(
      `/products/search?q=${encodeURIComponent(search)}`,
    )

    products = response.products
  } else {
    const response = await apiFetch<ProductsResponse>('/products')

    products = response.products
  }

  return sortProductsAndPaginate(
    products,
    sort,
    order,
    page,
  )
}

function sortProducts(
  products: Product[],
  sort: string,
  order: 'asc' | 'desc',
) {
  return [...products].sort((a, b) => {
    const first = a[sort as keyof Product]
    const second = b[sort as keyof Product]

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
  sort: string,
  order: 'asc' | 'desc',
  page: number,
): ProductsResponse {
  const sorted = sortProducts(products, sort, order)

  const start = (page - 1) * PAGE_SIZE
  const paginatedProducts = sorted.slice(start, start + PAGE_SIZE)

  return {
    products: paginatedProducts,
    total: sorted.length,
    skip: start,
    limit: PAGE_SIZE,
  }
}

export function getProduct(id: string) {
  return apiFetch<Product>(`/products/${id}`)
}

export async function getCategories() {
  return apiFetch<string[]>('/products/category-list')
}

export { PAGE_SIZE }

export interface UpdateStockPayload {
  stock: number
}

export function updateProductStock(
  id: number,
  payload: UpdateStockPayload,
) {
  return apiFetch<Product>(`/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}