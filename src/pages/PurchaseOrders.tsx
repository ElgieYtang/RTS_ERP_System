import { StatusTabs } from '@/components/layout/Breadcrumbs'
import { PageHeader } from '@/components/layout/PageHeader'
import { TransactionWorkflow } from '@/components/workflow/TransactionWorkflow'
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
import { ResponsiveTable } from '@/components/ui/responsive-table'
import { useDemo } from '@/context/DemoContext'
import { formatCurrency } from '@/lib/format'
import { getStatusDisplay } from '@/lib/status'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function PurchaseOrdersPage() {
  const { state, getCustomerName, showToast } = useDemo()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
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

  const openDetail = (id: string) => {
    if (isMobile) navigate(`/purchase-order/${id}`)
    else setViewId(id)
  }

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
      <PageHeader
        title="Purchase Order"
        description="Manage purchase orders linked to approved quotations."
        breadcrumbs={['Transaction', 'Purchase Order']}
      />
      <StatusTabs
        active={statusFilter}
        onChange={setStatusFilter}
        tabs={[
          { key: 'pending', label: 'Pending', count: state.purchaseOrders.filter((p) => p.status === 'pending').length },
          { key: 'approved', label: 'Approved', count: state.purchaseOrders.filter((p) => p.status === 'approved').length },
          { key: 'fully_received', label: 'Completed', count: state.purchaseOrders.filter((p) => p.status === 'fully_received').length },
          { key: 'all', label: 'All', count: state.purchaseOrders.length },
        ]}
      />
      <TableFilters
        search={search}
        onSearchChange={setSearch}
      />
      <ResponsiveTable
        emptyMessage="No purchase orders found."
        mobileItems={filtered.map((po) => {
          const st = getStatusDisplay(po.status)
          return {
            id: po.id,
            title: po.id,
            subtitle: getCustomerName(po.customerId),
            badge: { label: st.label, variant: st.variant },
            fields: [
              { label: 'Date', value: po.date },
              { label: 'Amount', value: formatCurrency(po.total) },
            ],
            onClick: () => openDetail(po.id),
          }
        })}
        desktop={
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
                  <TableCell><TableLink onClick={() => openDetail(po.id)}>{po.id}</TableLink></TableCell>
                  <TableCell>{po.referenceQuotationId ?? '—'}</TableCell>
                  <TableCell>{getCustomerName(po.customerId)}</TableCell>
                  <TableCell>{po.date}</TableCell>
                  <TableCell>{formatCurrency(po.total)}</TableCell>
                  <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                  <TableCell>
                    <TableActions
                      onView={() => openDetail(po.id)}
                      menuItems={[
                        { label: 'Preview', onClick: () => navigate(`/purchase-order/${po.id}/preview`) },
                        { label: 'Print', onClick: () => { navigate(`/purchase-order/${po.id}/preview`); setTimeout(() => window.print(), 300) } },
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
        }
      />

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

      <div className="mt-6">
        <TransactionWorkflow quotationId="QTN-00001" />
      </div>
    </div>
  )
}
