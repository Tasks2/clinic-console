import { useEffect, useMemo, useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'

import {
  getCategories,
  getProducts,
  PAGE_SIZE,
} from '../features/stock/stockApi'
import { StockFilters } from '../features/stock/components/stockFilters'
import { StockList } from '../features/stock/components/stockList'

export default function StockPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') ?? ''
  const category = searchParams.get('category') ?? ''
  const sort = searchParams.get('sort') ?? 'title'
  const order = (searchParams.get('order') ?? 'asc') as 'asc' | 'desc'
  const page = Number(searchParams.get('page') ?? '1')

  const [searchInput, setSearchInput] = useState(search)

  const filters = useMemo(
    () => ({
      search,
      category,
      sort,
      order,
      page,
    }),
    [search, category, sort, order, page],
  )

  const productsQuery = useQuery({
    queryKey: ['stock', filters],
    queryFn: ({ signal }) => getProducts(filters, signal),
    placeholderData: keepPreviousData,
  })

  const categoriesQuery = useQuery({
    queryKey: ['stock-categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60,
  })

  const totalPages = productsQuery.data
    ? Math.ceil(productsQuery.data.total / PAGE_SIZE)
    : 0

 const products = productsQuery.data?.products ?? []
    
  useEffect(() => {
    setSearchInput(search)
  }, [search])

  useEffect(() => {
  const timeout = setTimeout(() => {
    const trimmedSearch = searchInput.trim()

    if (trimmedSearch === search) {
      return
    }

    const nextParams = new URLSearchParams(searchParams)

    if (trimmedSearch) {
      nextParams.set('search', trimmedSearch)
    } else {
      nextParams.delete('search')
    }

    nextParams.set('page', '1')

    setSearchParams(nextParams)
  }, 400)

  return () => clearTimeout(timeout)
}, [searchInput, search, searchParams, setSearchParams])

 useEffect(() => {
  if (
    productsQuery.data &&
    page > 1 &&
    productsQuery.data.total === 0
  ) {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', '1')
    setSearchParams(nextParams)
  }
}, [
  productsQuery.data,
  page,
  searchParams,
  setSearchParams,
])

  

  function updateFilters(updates: Record<string, string>) {
    const nextParams = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value)
      } else {
        nextParams.delete(key)
      }
    })

    nextParams.set('page', '1')

    setSearchParams(nextParams)
  }

  function handleSearchChange(value: string) {
    setSearchInput(value)
  }

  function handleCategoryChange(value: string) {
    updateFilters({
      category: value,
    })
  }

  function handleSortChange(
    newSort: string,
    newOrder: 'asc' | 'desc',
  ) {
    updateFilters({
      sort: newSort,
      order: newOrder,
    })
  }

  function handlePreviousPage() {
    if (page <= 1) {
      return
    }

    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', String(page - 1))
    setSearchParams(nextParams)
  }

  function handleNextPage() {
    if (page >= totalPages) {
      return
    }

    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', String(page + 1))
    setSearchParams(nextParams)
  }

  const isLoading =
    productsQuery.isLoading || categoriesQuery.isLoading

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Clinic Stock</h1>
        <p>Loading stock...</p>
      </main>
    )
  }

  if (productsQuery.isError) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Clinic Stock</h1>

        <div role="alert" className="rounded-md border p-4">
          <p>Unable to load stock.</p>

          <button
            type="button"
            onClick={() => productsQuery.refetch()}
            className="mt-3 rounded-md border px-4 py-2"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Clinic Stock</h1>
        <p className="mt-1 text-sm text-gray-600">
          Search and manage clinic stock.
        </p>
      </div>

      <StockFilters
        search={searchInput}
        category={category}
        sort={sort}
        order={order}
        categories={categoriesQuery.data ?? []}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
      />

      {products.length === 0 ? (
        <div className="rounded-md border p-6 text-center">
          <p>No stock items found.</p>
        </div>
      ) : (
        <StockList products={products} />
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePreviousPage}
          disabled={page <= 1}
          className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm">
          Page {page} of {Math.max(totalPages, 1)}
        </span>

        <button
          type="button"
          onClick={handleNextPage}
          disabled={page >= totalPages}
          className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  )
}