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

export function getProducts() {
  return apiFetch<ProductsResponse>('/products?limit=20')
}

export function getProduct(id: string) {
  return apiFetch<Product>(`/products/${id}`)
}
