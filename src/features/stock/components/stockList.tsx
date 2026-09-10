import { Link } from 'react-router-dom'
import type { Product } from '../stockApi'

interface StockListProps {
  products: Product[]
}

function getStockStatus(stock: number) {
  if (stock === 0) {
    return 'Out of stock'
  }

  if (stock <= 10) {
    return 'Low stock'
  }

  return 'In stock'
}

export function StockList({ products }: StockListProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-162.5 text-left text-sm">
        <caption className="sr-only">
          Current clinic stock
        </caption>
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b last:border-0">
              <td className="px-4 py-3 font-medium">{product.title}</td>

              <td className="px-4 py-3">{product.category}</td>

              <td className="px-4 py-3">{product.stock}</td>

              <td className="px-4 py-3">
                {getStockStatus(product.stock)}
              </td>

              <td className="px-4 py-3">
                <Link
                  to={`/stock/${product.id}`}
                  className="font-medium underline  focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}