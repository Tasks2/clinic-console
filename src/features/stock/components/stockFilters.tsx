interface StockFiltersProps {
  search: string
  category: string
  sort: string
  order: 'asc' | 'desc'
  categories: string[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSortChange: (sort: string, order: 'asc' | 'desc') => void
}

export function StockFilters({
  search,
  category,
  sort,
  order,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: StockFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div>
        <label
          htmlFor="stock-search"
          className="mb-1 block text-sm font-medium"
        >
          Search
        </label>

        <input
          id="stock-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search stock..."
          className="w-full rounded-md border px-3 py-2  focus:outline-none focus:ring-2 focus:ring-offset-2"
        />
      </div>

      <div>
        <label
          htmlFor="stock-category"
          className="mb-1 block text-sm font-medium"
        >
          Category
        </label>

        <select
          id="stock-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="w-full rounded-md border px-3 py-2"
        >
          <option value="">All categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="stock-sort"
          className="mb-1 block text-sm font-medium"
        >
          Sort
        </label>

        <select
          id="stock-sort"
          value={`${sort}:${order}`}
          onChange={(event) => {
            const [newSort, newOrder] = event.target.value.split(':') as [
              string,
              'asc' | 'desc',
            ]

            onSortChange(newSort, newOrder)
          }}
          className="w-full rounded-md border px-3 py-2"
        >
          <option value="title:asc">Name: A–Z</option>
          <option value="title:desc">Name: Z–A</option>
          <option value="stock:asc">Stock: Low–High</option>
          <option value="stock:desc">Stock: High–Low</option>
          <option value="price:asc">Price: Low–High</option>
          <option value="price:desc">Price: High–Low</option>
        </select>
      </div>
    </div>
  )
}