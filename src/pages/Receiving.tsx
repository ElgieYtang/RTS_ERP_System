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
import { getStatusDisplay } from '@/lib/status'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export function ReceivingPage() {
  const { state, getSupplierName, confirmReceiving, showToast } = useDemo()
  const [searchParams] = useSearchParams()
  const poFromUrl = searchParams.get('po')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewId, setViewId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = state.receivings
    const q = search.toLowerCase()
    if (q) {
      list = list.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.purchaseOrderId.toLowerCase().includes(q) ||
          getSupplierName(r.supplierId).toLowerCase().includes(q),
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter((r) => r.status === statusFilter)
    }
    return list
  }, [state.receivings, search, statusFilter, getSupplierName])

  const viewRec = viewId ? state.receivings.find((r) => r.id === viewId) : null
  const linkedPo = poFromUrl ? state.purchaseOrders.find((p) => p.id === poFromUrl) : null

  const handleConfirm = (recId: string) => {
    const rec = state.receivings.find((r) => r.id === recId)
    if (!rec) return
    if (rec.status === 'completed') {
      showToast('info', 'Receiving already completed.')
      return
    }
    if (rec.status === 'partial') {
      const remaining = rec.items.reduce((s, i) => s + i.remaining, 0)
      showToast('info', `${remaining} items remaining to be received.`)
    }
    confirmReceiving(recId)
  }

  return (
    <div>
      <PageHeader title="Receiving" description="Record incoming goods and update inventory." />
      {linkedPo && (
        <div className="mb-4 rounded-lg border border-maroon/30 bg-maroon-light p-4 text-sm">
          <strong>PO selected:</strong> {linkedPo.id} — {linkedPo.items.map((i) => i.productName).join(', ')}
          <Button size="sm" className="ml-4" onClick={() => showToast('info', 'Use Confirm Receiving on the matching record below.')}>
            New Receiving
          </Button>
        </div>
      )}
      <TableFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'completed', label: 'Completed' },
          { value: 'partial', label: 'Partially Received' },
        ]}
      />
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Receiving No.</TableHead>
            <TableHead>Purchase Order</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6}><EmptyState /></TableCell>
            </TableRow>
          ) : (
            filtered.map((r) => {
              const st = getStatusDisplay(r.status)
              return (
                <TableRow key={r.id}>
                  <TableCell><TableLink onClick={() => setViewId(r.id)}>{r.id}</TableLink></TableCell>
                  <TableCell>{r.purchaseOrderId}</TableCell>
                  <TableCell>{getSupplierName(r.supplierId)}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                  <TableCell>
                    <TableActions
                      onView={() => setViewId(r.id)}
                      menuItems={[
                        { label: 'Confirm Receiving', onClick: () => handleConfirm(r.id) },
                        { label: 'Print', onClick: () => window.print() },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <Modal open={!!viewRec} onClose={() => setViewId(null)} title="Receiving Details" size="lg">
        {viewRec && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-text-secondary">Receiving No:</span> <strong>{viewRec.id}</strong></div>
              <div><span className="text-text-secondary">PO:</span> {viewRec.purchaseOrderId}</div>
              <div><span className="text-text-secondary">Supplier:</span> {getSupplierName(viewRec.supplierId)}</div>
              <div><span className="text-text-secondary">Date:</span> {viewRec.date}</div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Item</TableHead>
                  <TableHead>Ordered</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Remaining</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewRec.items.map((i) => (
                  <TableRow key={i.productId}>
                    <TableCell>{i.productName}</TableCell>
                    <TableCell>{i.ordered}</TableCell>
                    <TableCell>{i.received}</TableCell>
                    <TableCell>{i.remaining}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {viewRec.status !== 'completed' && (
              <Button onClick={() => handleConfirm(viewRec.id)}>Confirm Receiving</Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
