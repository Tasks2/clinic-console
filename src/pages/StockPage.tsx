import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../features/stock/stockApi'

function StockPage() {
  const { data, isPending, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  if (isPending) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Failed to load products.</p>
  }

  return (
    <main>
      <h1>Stock</h1>

      <p>Total products: {data.total}</p>

      <ul>
        {data.products.map((product) => (
          <li key={product.id}>
            {product.title} — Stock: {product.stock}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default StockPage
