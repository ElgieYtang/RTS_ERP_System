import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDemo } from '@/context/DemoContext'
import { formatCurrency } from '@/lib/format'
import { getStatusDisplay } from '@/lib/status'
import { Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function InventoryOverviewPage() {
  const { state } = useDemo()
  const navigate = useNavigate()

  const totalStock = state.products.reduce((s, p) => s + p.stock, 0)
  const lowStock = state.products.filter((p) => p.status === 'Low Stock').length
  const outOfStock = state.products.filter((p) => p.status === 'Out of Stock').length

  return (
    <div>
      <PageHeader title="Inventory Overview" description="View current stock levels and inventory status." />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-text-secondary">Total Products</p>
            <p className="mt-2 text-3xl font-semibold">{state.products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-text-secondary">Total Stock</p>
            <p className="mt-2 text-3xl font-semibold">{totalStock}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-text-secondary">Low Stock</p>
            <p className="mt-2 text-3xl font-semibold text-[#B45309]">{lowStock}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-text-secondary">Out of Stock</p>
            <p className="mt-2 text-3xl font-semibold">{outOfStock}</p>
          </CardContent>
        </Card>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.products.map((p) => {
            const st = getStatusDisplay(p.status)
            return (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.sku}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{formatCurrency(p.price)}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>
                    View Movement
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <div className="mt-4 flex gap-3">
        <Button variant="secondary" onClick={() => navigate('/inventory/receiving')}>
          <Package className="h-4 w-4" /> Receiving
        </Button>
        <Button variant="secondary" onClick={() => navigate('/inventory/outslips')}>Outslips</Button>
      </div>
    </div>
  )
}
