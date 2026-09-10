export interface StockFilters {
  search: string
  category: string
  sort: string
  order: 'asc' | 'desc'
  page: number
}
