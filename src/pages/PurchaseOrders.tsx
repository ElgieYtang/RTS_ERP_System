import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableActions } from '@/components/ui/action-menu'
import { Modal } from '@/components/ui/modal'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLink,
  TableRow,
} from '@/components/ui/table'
import { EmptyState, TableFilters } from '@/components/ui/table-filters'
import { useDemo } from '@/context/DemoContext'
import { formatCurrency } from '@/lib/format'
import { getStatusDisplay } from '@/lib/status'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function PurchaseOrdersPage() {
  const { state, getCustomerName, showToast } = useDemo()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewId, setViewId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = state.purchaseOrders
    const q = search.toLowerCase()
    if (q) {
      list = list.filter(
        (po) =>
          po.id.toLowerCase().includes(q) ||
          getCustomerName(po.customerId).toLowerCase().includes(q) ||
          (po.referenceQuotationId?.toLowerCase().includes(q) ?? false),
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter((po) => po.status === statusFilter)
    }
    return list
  }, [state.purchaseOrders, search, statusFilter, getCustomerName])

  const viewPo = viewId ? state.purchaseOrders.find((p) => p.id === viewId) : null

  const receiveItems = (poId: string) => {
    const po = state.purchaseOrders.find((p) => p.id === poId)
    if (po?.status === 'fully_received') {
      showToast('info', 'All items have been received.')
      return
    }
    navigate(`/inventory/receiving?po=${poId}`)
  }

  return (
    <div>
      <PageHeader title="Purchase Orders" description="Manage purchase orders linked to approved quotations." />
      <TableFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'fully_received', label: 'Fully Received' },
        ]}
      />
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>PO No.</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={7}><EmptyState /></TableCell>
            </TableRow>
          ) : (
            filtered.map((po) => {
              const st = getStatusDisplay(po.status)
              return (
                <TableRow key={po.id}>
                  <TableCell><TableLink onClick={() => setViewId(po.id)}>{po.id}</TableLink></TableCell>
                  <TableCell>{po.referenceQuotationId ?? '—'}</TableCell>
                  <TableCell>{getCustomerName(po.customerId)}</TableCell>
                  <TableCell>{po.date}</TableCell>
                  <TableCell>{formatCurrency(po.total)}</TableCell>
                  <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                  <TableCell>
                    <TableActions
                      onView={() => setViewId(po.id)}
                      menuItems={[
                        { label: 'Preview', onClick: () => navigate(`/purchase-orders/${po.id}/preview`) },
                        { label: 'Print', onClick: () => { navigate(`/purchase-orders/${po.id}/preview`); setTimeout(() => window.print(), 300) } },
                        { label: 'Receive Items', onClick: () => receiveItems(po.id) },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <Modal open={!!viewPo} onClose={() => setViewId(null)} title="Purchase Order Details" size="lg">
        {viewPo && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-text-secondary">PO No:</span> <strong>{viewPo.id}</strong></div>
              <div><span className="text-text-secondary">Reference:</span> {viewPo.referenceQuotationId ?? '—'}</div>
              <div><span className="text-text-secondary">Customer:</span> {getCustomerName(viewPo.customerId)}</div>
              <div><span className="text-text-secondary">Date:</span> {viewPo.date}</div>
              <div><span className="text-text-secondary">Total:</span> <strong>{formatCurrency(viewPo.total)}</strong></div>
              <div><span className="text-text-secondary">Status:</span> {getStatusDisplay(viewPo.status).label}</div>
            </div>
            <ul className="list-disc pl-5">
              {viewPo.items.map((i) => (
                <li key={i.productId}>{i.productName} × {i.quantity} — {formatCurrency(i.unitPrice)} each</li>
              ))}
            </ul>
            <Button onClick={() => receiveItems(viewPo.id)}>Receive Items</Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
