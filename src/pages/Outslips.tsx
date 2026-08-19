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

export function OutslipsPage() {
  const { state, getCustomerName, releaseOutslip } = useDemo()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewId, setViewId] = useState<string | null>(null)
  const [releaseId, setReleaseId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = state.outslips
    const q = search.toLowerCase()
    if (q) {
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          getCustomerName(o.customerId).toLowerCase().includes(q),
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter((o) => o.status === statusFilter)
    }
    return list
  }, [state.outslips, search, statusFilter, getCustomerName])

  const viewOs = viewId ? state.outslips.find((o) => o.id === viewId) : null

  return (
    <div>
      <PageHeader title="Outslips" description="Manage outgoing inventory and outslip documents." />
      <TableFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'pending', label: 'Pending' },
          { value: 'released', label: 'Released' },
        ]}
      />
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Outslip No.</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Reference</TableHead>
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
            filtered.map((o) => {
              const st = getStatusDisplay(o.status)
              return (
                <TableRow key={o.id}>
                  <TableCell><TableLink onClick={() => setViewId(o.id)}>{o.id}</TableLink></TableCell>
                  <TableCell>{getCustomerName(o.customerId)}</TableCell>
                  <TableCell>{o.referencePoId ?? '—'}</TableCell>
                  <TableCell>{o.date}</TableCell>
                  <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                  <TableCell>
                    <TableActions
                      onView={() => setViewId(o.id)}
                      menuItems={[
                        { label: 'Preview', onClick: () => navigate(`/inventory/outslips/${o.id}/preview`) },
                        { label: 'Print', onClick: () => window.print() },
                        ...(o.status === 'pending'
                          ? [{ label: 'Release', onClick: () => setReleaseId(o.id) }]
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

      <Modal open={!!viewOs} onClose={() => setViewId(null)} title="Outslip Details" size="md">
        {viewOs && (
          <div className="space-y-3 text-sm">
            <p><strong>{viewOs.id}</strong> — {getCustomerName(viewOs.customerId)}</p>
            <p>Reference: {viewOs.referencePoId ?? '—'}</p>
            <p>Date: {viewOs.date}</p>
            <ul className="list-disc pl-5">
              {viewOs.items.map((i) => (
                <li key={i.productId}>{i.productName} × {i.quantity}</li>
              ))}
            </ul>
            {viewOs.status === 'pending' && (
              <Button onClick={() => setReleaseId(viewOs.id)}>Release</Button>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!releaseId}
        onClose={() => setReleaseId(null)}
        title="Release Outslip"
        message="Release this outslip?"
        confirmLabel="Confirm Release"
        onConfirm={() => {
          if (releaseId) releaseOutslip(releaseId)
        }}
      />
    </div>
  )
}
