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

const STATUS_ORDER = ['pending', 'approved', 'for_dispatch', 'released']

export function OutslipsPage() {
  const {
    state,
    getCustomerName,
    approveOutslip,
    forDispatchOutslip,
    createDeliveryFromOutslip,
  } = useDemo()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [search, setSearch] = useState('')
  const [statusTab, setStatusTab] = useState('pending')
  const [viewId, setViewId] = useState<string | null>(null)
  const [dispatchId, setDispatchId] = useState<string | null>(null)

  const counts = useMemo(() => ({
    pending: state.outslips.filter((o) => o.status === 'pending').length,
    approved: state.outslips.filter((o) => o.status === 'approved').length,
    for_dispatch: state.outslips.filter((o) => o.status === 'for_dispatch' || o.status === 'released').length,
    all: state.outslips.length,
  }), [state.outslips])

  const filtered = useMemo(() => {
    let list = [...state.outslips]
    const q = search.toLowerCase()
    if (q) {
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          getCustomerName(o.customerId).toLowerCase().includes(q),
      )
    }
    if (statusTab !== 'all') {
      if (statusTab === 'for_dispatch') {
        list = list.filter((o) => o.status === 'for_dispatch' || o.status === 'released')
      } else {
        list = list.filter((o) => o.status === statusTab)
      }
    }
    list.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))
    return list
  }, [state.outslips, search, statusTab, getCustomerName])

  const viewOs = viewId ? state.outslips.find((o) => o.id === viewId) : null

  const openDetail = (id: string) => {
    if (isMobile) navigate(`/outslip/${id}`)
    else setViewId(id)
  }

  const handleCreateDR = (osId: string) => {
    const drId = createDeliveryFromOutslip(osId)
    if (drId) navigate('/delivery-receipt')
  }

  return (
    <div>
      <PageHeader
        title="Outslip"
        description="Manage outgoing items linked to purchase orders."
        breadcrumbs={['Transaction', 'Outslip']}
      />
      <StatusTabs
        active={statusTab}
        onChange={setStatusTab}
        tabs={[
          { key: 'pending', label: 'Pending', count: counts.pending },
          { key: 'approved', label: 'Approved', count: counts.approved },
          { key: 'for_dispatch', label: 'For Dispatch', count: counts.for_dispatch },
          { key: 'all', label: 'All', count: counts.all },
        ]}
      />
      <TableFilters search={search} onSearchChange={setSearch} searchPlaceholder="Search outslips..." />
      <ResponsiveTable
        emptyMessage="No outslips found."
        mobileItems={filtered.map((o) => {
          const st = getStatusDisplay(o.status === 'released' ? 'for_dispatch' : o.status)
          const itemCount = o.items.reduce((s, i) => s + i.quantity, 0)
          return {
            id: o.id,
            title: o.id,
            subtitle: getCustomerName(o.customerId),
            badge: { label: st.label, variant: st.variant },
            fields: [
              { label: 'Date', value: o.date },
              { label: 'Items', value: `${itemCount} units` },
            ],
            onClick: () => openDetail(o.id),
          }
        })}
        desktop={
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Outslip No.</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
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
            filtered.map((o) => {
              const st = getStatusDisplay(o.status === 'released' ? 'for_dispatch' : o.status)
              const itemCount = o.items.reduce((s, i) => s + i.quantity, 0)
              return (
                <TableRow key={o.id}>
                  <TableCell><TableLink onClick={() => openDetail(o.id)}>{o.id}</TableLink></TableCell>
                  <TableCell>{o.referencePoId ?? '—'}</TableCell>
                  <TableCell>{getCustomerName(o.customerId)}</TableCell>
                  <TableCell>{o.date}</TableCell>
                  <TableCell>{itemCount} items</TableCell>
                  <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                  <TableCell>
                    <TableActions
                      onView={() => openDetail(o.id)}
                      menuItems={[
                        { label: 'Preview', onClick: () => window.print() },
                        { label: 'Print', onClick: () => window.print() },
                        ...(o.status === 'pending'
                          ? [{ label: 'Approve', onClick: () => approveOutslip(o.id) }]
                          : []),
                        ...(o.status === 'approved'
                          ? [{ label: 'For Dispatch', onClick: () => setDispatchId(o.id) }]
                          : []),
                        ...(o.status === 'for_dispatch' || o.status === 'released'
                          ? [{ label: 'Create Delivery Receipt', onClick: () => handleCreateDR(o.id) }]
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

      <Modal open={!!viewOs} onClose={() => setViewId(null)} title="Outslip Details" size="md">
        {viewOs && (
          <div className="space-y-3 text-sm">
            <p><strong>{viewOs.id}</strong> — {getCustomerName(viewOs.customerId)}</p>
            <p>Reference: {viewOs.referencePoId ?? '—'}</p>
            <ul className="list-disc pl-5">
              {viewOs.items.map((i) => (
                <li key={i.productId}>{i.productName} × {i.quantity}</li>
              ))}
            </ul>
            {viewOs.status === 'approved' && (
              <Button onClick={() => setDispatchId(viewOs.id)}>For Dispatch</Button>
            )}
            {(viewOs.status === 'for_dispatch' || viewOs.status === 'released') && (
              <Button onClick={() => handleCreateDR(viewOs.id)}>Create Delivery Receipt</Button>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!dispatchId}
        onClose={() => setDispatchId(null)}
        title="For Dispatch"
        message="Mark this outslip ready for dispatch? Inventory will be updated."
        confirmLabel="Confirm"
        onConfirm={() => {
          if (dispatchId) forDispatchOutslip(dispatchId)
        }}
      />
    </div>
  )
}
