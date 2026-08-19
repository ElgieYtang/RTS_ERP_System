import { StatusTabs } from '@/components/layout/Breadcrumbs'
import { PageHeader } from '@/components/layout/PageHeader'
import { TransactionWorkflow } from '@/components/workflow/TransactionWorkflow'
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
import { ResponsiveTable } from '@/components/ui/responsive-table'
import { useDemo } from '@/context/DemoContext'
import { getStatusDisplay } from '@/lib/status'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function DeliveryReceiptsPage() {
  const {
    state,
    getCustomerName,
    markDeliveryOutForDelivery,
    markDeliveryDelivered,
  } = useDemo()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [search, setSearch] = useState('')
  const [statusTab, setStatusTab] = useState('active')
  const [viewId, setViewId] = useState<string | null>(null)
  const [deliverId, setDeliverId] = useState<string | null>(null)

  const counts = useMemo(() => ({
    active: state.deliveryReceipts.filter((d) => d.status === 'active').length,
    out_for_delivery: state.deliveryReceipts.filter((d) => d.status === 'out_for_delivery').length,
    delivered: state.deliveryReceipts.filter((d) => d.status === 'delivered').length,
    all: state.deliveryReceipts.length,
  }), [state.deliveryReceipts])

  const filtered = useMemo(() => {
    let list = [...state.deliveryReceipts]
    const q = search.toLowerCase()
    if (q) {
      list = list.filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          getCustomerName(d.customerId).toLowerCase().includes(q),
      )
    }
    if (statusTab !== 'all') {
      list = list.filter((d) => d.status === statusTab)
    }
    const order = ['active', 'out_for_delivery', 'delivered']
    list.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status))
    return list
  }, [state.deliveryReceipts, search, statusTab, getCustomerName])

  const viewDr = viewId ? state.deliveryReceipts.find((d) => d.id === viewId) : null

  const openDetail = (id: string) => {
    if (isMobile) navigate(`/delivery-receipt/${id}`)
    else setViewId(id)
  }

  return (
    <div>
      <PageHeader
        title="Delivery Receipt"
        description="Track and confirm customer deliveries."
        breadcrumbs={['Transaction', 'Delivery Receipt']}
      />
      <StatusTabs
        active={statusTab}
        onChange={setStatusTab}
        tabs={[
          { key: 'active', label: 'Active', count: counts.active },
          { key: 'out_for_delivery', label: 'Out for Delivery', count: counts.out_for_delivery },
          { key: 'delivered', label: 'Delivered', count: counts.delivered },
          { key: 'all', label: 'All', count: counts.all },
        ]}
      />
      <TableFilters search={search} onSearchChange={setSearch} searchPlaceholder="Search delivery receipts..." />
      <ResponsiveTable
        emptyMessage="No delivery receipts found."
        mobileItems={filtered.map((d) => {
          const st = getStatusDisplay(d.status)
          return {
            id: d.id,
            title: d.id,
            subtitle: getCustomerName(d.customerId),
            badge: { label: st.label, variant: st.variant },
            fields: [
              { label: 'Date', value: d.date },
              { label: 'Driver', value: d.driver },
            ],
            onClick: () => openDetail(d.id),
          }
        })}
        desktop={
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>DR No.</TableHead>
            <TableHead>Reference Outslip</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={8}><EmptyState /></TableCell>
            </TableRow>
          ) : (
            filtered.map((d) => {
              const st = getStatusDisplay(d.status)
              return (
                <TableRow key={d.id}>
                  <TableCell><TableLink onClick={() => openDetail(d.id)}>{d.id}</TableLink></TableCell>
                  <TableCell>{d.referenceOutslipId}</TableCell>
                  <TableCell>{getCustomerName(d.customerId)}</TableCell>
                  <TableCell>{d.date}</TableCell>
                  <TableCell>{d.driver}</TableCell>
                  <TableCell>{d.vehicle}</TableCell>
                  <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                  <TableCell>
                    <TableActions
                      onView={() => openDetail(d.id)}
                      menuItems={[
                        { label: 'Preview', onClick: () => navigate(`/delivery-receipt/${d.id}/preview`) },
                        { label: 'Print', onClick: () => { navigate(`/delivery-receipt/${d.id}/preview`); setTimeout(() => window.print(), 300) } },
                        ...(d.status === 'active'
                          ? [{ label: 'Out for Delivery', onClick: () => markDeliveryOutForDelivery(d.id) }]
                          : []),
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
        }
      />

      <div className="mt-6">
        <TransactionWorkflow quotationId="QTN-00001" />
      </div>

      <Modal open={!!viewDr} onClose={() => setViewId(null)} title="Delivery Receipt Details" size="md">
        {viewDr && (
          <div className="space-y-2 text-sm">
            <p><strong>{viewDr.id}</strong></p>
            <p>Customer: {getCustomerName(viewDr.customerId)}</p>
            <p>Reference Outslip: {viewDr.referenceOutslipId}</p>
            <p>Address: {viewDr.deliveryAddress}</p>
            <p>Driver: {viewDr.driver} | Vehicle: {viewDr.vehicle}</p>
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
