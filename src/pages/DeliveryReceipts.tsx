import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
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
import { useNavigate } from 'react-router-dom'

export function DeliveryReceiptsPage() {
  const { state, getCustomerName, markDeliveryDelivered } = useDemo()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewId, setViewId] = useState<string | null>(null)
  const [deliverId, setDeliverId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = state.deliveryReceipts
    const q = search.toLowerCase()
    if (q) {
      list = list.filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          getCustomerName(d.customerId).toLowerCase().includes(q),
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter((d) => d.status === statusFilter)
    }
    return list
  }, [state.deliveryReceipts, search, statusFilter, getCustomerName])

  const viewDr = viewId ? state.deliveryReceipts.find((d) => d.id === viewId) : null

  return (
    <div>
      <PageHeader title="Delivery Receipts" description="Track and confirm customer deliveries." />
      <TableFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'out_for_delivery', label: 'Out for Delivery' },
          { value: 'delivered', label: 'Delivered' },
        ]}
      />
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>DR No.</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Driver</TableHead>
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
            filtered.map((d) => {
              const st = getStatusDisplay(d.status)
              return (
                <TableRow key={d.id}>
                  <TableCell><TableLink onClick={() => setViewId(d.id)}>{d.id}</TableLink></TableCell>
                  <TableCell>{getCustomerName(d.customerId)}</TableCell>
                  <TableCell>{d.referenceOutslipId}</TableCell>
                  <TableCell>{d.date}</TableCell>
                  <TableCell>{d.driver}</TableCell>
                  <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                  <TableCell>
                    <TableActions
                      onView={() => setViewId(d.id)}
                      menuItems={[
                        { label: 'Preview', onClick: () => navigate(`/delivery-receipts/${d.id}/preview`) },
                        { label: 'Print', onClick: () => { navigate(`/delivery-receipts/${d.id}/preview`); setTimeout(() => window.print(), 300) } },
                        ...(d.status === 'out_for_delivery'
                          ? [{ label: 'Mark as Delivered', onClick: () => setDeliverId(d.id) }]
                          : []),
                      ]}
                    />
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <Modal open={!!viewDr} onClose={() => setViewId(null)} title="Delivery Receipt Details" size="md">
        {viewDr && (
          <div className="space-y-2 text-sm">
            <p><strong>{viewDr.id}</strong></p>
            <p>Customer: {getCustomerName(viewDr.customerId)}</p>
            <p>Address: {viewDr.deliveryAddress}</p>
            <p>Driver: {viewDr.driver} | Vehicle: {viewDr.vehicle}</p>
            <p>Reference: {viewDr.referenceOutslipId}</p>
            {viewDr.status === 'out_for_delivery' && (
              <Button onClick={() => setDeliverId(viewDr.id)}>Mark as Delivered</Button>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deliverId}
        onClose={() => setDeliverId(null)}
        title="Mark as Delivered"
        message="Mark this delivery as completed?"
        confirmLabel="Confirm"
        onConfirm={() => {
          if (deliverId) markDeliveryDelivered(deliverId)
        }}
      />
    </div>
  )
}
