import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState, TableFilters } from '@/components/ui/table-filters'
import { useDemo } from '@/context/DemoContext'
import { formatCurrency } from '@/lib/format'
import { getStatusDisplay } from '@/lib/status'
import { useMemo, useState } from 'react'

export function ProductsPage() {
  const { state } = useDemo()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewProductId, setViewProductId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = state.products
    const q = search.toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter((p) => p.status === statusFilter)
    }
    return list
  }, [state.products, search, statusFilter])

  const viewProduct = viewProductId
    ? state.products.find((p) => p.id === viewProductId)
    : null
  const movements = viewProduct
    ? state.stockMovements.filter((m) => m.productId === viewProduct.id)
    : []

  return (
    <div>
      <PageHeader title="Products" description="Manage product catalog, pricing, and stock levels." />
      <TableFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search products..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'In Stock', label: 'In Stock' },
          { value: 'Low Stock', label: 'Low Stock' },
          { value: 'Out of Stock', label: 'Out of Stock' },
        ]}
      />
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={8}><EmptyState /></TableCell>
            </TableRow>
          ) : (
            filtered.map((p) => {
              const st = getStatusDisplay(p.status)
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.sku}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.unit}</TableCell>
                  <TableCell>{formatCurrency(p.price)}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setViewProductId(p.id)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <Modal
        open={!!viewProduct}
        onClose={() => setViewProductId(null)}
        title={viewProduct?.name ?? 'Product'}
        size="lg"
      >
        {viewProduct && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-text-secondary">SKU:</span> {viewProduct.sku}</div>
              <div><span className="text-text-secondary">Stock:</span> {viewProduct.stock}</div>
              <div><span className="text-text-secondary">Price:</span> {formatCurrency(viewProduct.price)}</div>
              <div><span className="text-text-secondary">Reorder Level:</span> {viewProduct.reorderLevel}</div>
            </div>
            <h3 className="font-semibold text-text-primary">Stock Movement History</h3>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-text-secondary">
                      No stock movements recorded.
                    </TableCell>
                  </TableRow>
                ) : (
                  movements.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.date}</TableCell>
                      <TableCell>{m.reference}</TableCell>
                      <TableCell>
                        <span className={m.type === 'Receiving' ? 'text-[#15803D] font-medium' : 'text-[#DC2626] font-medium'}>
                          {m.type === 'Receiving' ? 'STOCK IN' : 'STOCK OUT'}
                        </span>
                      </TableCell>
                      <TableCell className={m.change > 0 ? 'text-[#15803D]' : 'text-[#DC2626]'}>
                        {m.change > 0 ? `+${m.change}` : m.change}
                      </TableCell>
                      <TableCell>{m.balance}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Modal>
    </div>
  )
}
