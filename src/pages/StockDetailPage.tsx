import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'

import { getProduct } from '../features/stock/stockApi'
import { StockCorrection } from '../features/stock/components/stockCorrection'

export default function StockDetailPage() {
  const { id } = useParams()

  const productQuery = useQuery({
    queryKey: ['stock-product', id],
    queryFn: ({ signal }) => getProduct(id!, signal),
    enabled: Boolean(id),
  })

  async function handleCopyLink() {
    await navigator.clipboard.writeText(window.location.href)
  }

  if (productQuery.isLoading) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <p>Loading product...</p>
      </main>
    )
  }

  if (productQuery.isError || !productQuery.data) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <div role="alert" className="rounded-md border p-6">
          <h1 className="text-xl font-semibold">Unable to load product</h1>

          <p className="mt-2">The stock item could not be loaded.</p>

          <Link to="/stock" className="mt-4 inline-block underline">
            Back to stock
          </Link>
        </div>
      </main>
    )
  }

  const product = productQuery.data

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <Link to="/stock" className="text-sm underline">
          ← Back to stock
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{product.title}</h1>

            <p className="mt-1 text-sm text-gray-600">{product.category}</p>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-md border px-4 py-2  focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Copy link
          </button>
        </div>
      </div>

      <section className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Product details</h2>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-600">Category</dt>
            <dd className="font-medium">{product.category}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-600">Current stock</dt>
            <dd className="font-medium">{product.stock}</dd>
          </div>

          <div>
            <dt className="text-sm text-gray-600">Price</dt>
            <dd className="font-medium">${product.price.toFixed(2)}</dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm text-gray-600">Description</dt>
            <dd className="mt-1">{product.description}</dd>
          </div>
        </dl>
      </section>

      <StockCorrection product={product} />
    </main>
  )
}
