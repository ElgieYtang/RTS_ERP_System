import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { FormField, Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { TableActions } from '@/components/ui/action-menu'
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
import { QuotationWorkflow } from '@/components/workflow/quotationWorkflow'
import { useDemo } from '@/context/DemoContext'
import { formatCurrency } from '@/lib/format'
import { getStatusDisplay } from '@/lib/status'
import type { Quotation } from '@/types'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function QuotationsPage() {
  const { state, getCustomerName, updateQuotation, cancelQuotation, convertQuotationToPO, showToast } = useDemo()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewId, setViewId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Quotation>>({})

  const filtered = useMemo(() => {
    let list = state.quotations
    const q = search.toLowerCase()
    if (q) {
      list = list.filter(
        (qt) =>
          qt.id.toLowerCase().includes(q) ||
          getCustomerName(qt.customerId).toLowerCase().includes(q),
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter((qt) => qt.status === statusFilter)
    }
    return list
  }, [state.quotations, search, statusFilter, getCustomerName])

  const viewQtn = viewId ? state.quotations.find((q) => q.id === viewId) : null
  const editQtn = editId ? state.quotations.find((q) => q.id === editId) : null

  const openEdit = (q: Quotation) => {
    setEditId(q.id)
    setEditForm({ ...q })
  }

  const saveEdit = () => {
    if (!editId) return
    updateQuotation(editId, editForm)
    showToast('success', 'Quotation updated successfully.')
    setEditId(null)
  }

  const handleConvertPO = (qtnId: string) => {
    const poId = convertQuotationToPO(qtnId)
    if (poId) {
      navigate('/purchase-orders')
      showToast('info', `Showing ${poId}`)
    }
  }

  return (
    <div>
      <PageHeader
        title="Quotations"
        description="Create and manage customer quotations."
        action={<Button><Plus className="h-4 w-4" />New Quotation</Button>}
      />
      <TableFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search quotations..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
          { value: 'draft', label: 'Draft' },
          { value: 'cancelled', label: 'Cancelled' },
        ]}
      />
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Quotation No.</TableHead>
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
              <TableCell colSpan={6}><EmptyState /></TableCell>
            </TableRow>
          ) : (
            filtered.map((q) => {
              const st = getStatusDisplay(q.status)
              return (
                <TableRow key={q.id}>
                  <TableCell><TableLink onClick={() => setViewId(q.id)}>{q.id}</TableLink></TableCell>
                  <TableCell>{getCustomerName(q.customerId)}</TableCell>
                  <TableCell>{q.date}</TableCell>
                  <TableCell>{formatCurrency(q.total)}</TableCell>
                  <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                  <TableCell>
                    <TableActions
                      onView={() => setViewId(q.id)}
                      menuItems={[
                        { label: 'Edit', onClick: () => openEdit(q) },
                        { label: 'Preview', onClick: () => navigate(`/quotations/${q.id}/preview`) },
                        { label: 'Print', onClick: () => { navigate(`/quotations/${q.id}/preview`); setTimeout(() => window.print(), 300) } },
                        ...(q.status === 'approved'
                          ? [{ label: 'Convert to PO', onClick: () => handleConvertPO(q.id) }]
                          : []),
                        ...(q.status !== 'cancelled'
                          ? [{ label: 'Cancel', onClick: () => setCancelId(q.id), destructive: true }]
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

      <Modal open={!!viewQtn} onClose={() => setViewId(null)} title="Quotation Details" size="lg">
        {viewQtn && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-text-secondary">Quotation No:</span> <strong>{viewQtn.id}</strong></div>
              <div><span className="text-text-secondary">Date:</span> {viewQtn.date}</div>
              <div><span className="text-text-secondary">Customer:</span> {getCustomerName(viewQtn.customerId)}</div>
              <div><span className="text-text-secondary">Valid Until:</span> {viewQtn.validUntil ?? '—'}</div>
              <div><span className="text-text-secondary">Status:</span> {getStatusDisplay(viewQtn.status).label}</div>
              <div><span className="text-text-secondary">Total:</span> <strong>{formatCurrency(viewQtn.total)}</strong></div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewQtn.items.map((i) => (
                  <TableRow key={i.productId}>
                    <TableCell>{i.productName}</TableCell>
                    <TableCell>{i.quantity}</TableCell>
                    <TableCell>{formatCurrency(i.unitPrice)}</TableCell>
                    <TableCell>{formatCurrency(i.quantity * i.unitPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {viewQtn.terms && (
              <p className="text-sm text-text-secondary"><strong>Terms:</strong> {viewQtn.terms}</p>
            )}
            <h3 className="font-semibold">Workflow Progress</h3>
            <QuotationWorkflow quotation={viewQtn} />
            <div className="flex gap-2 pt-2">
              {viewQtn.status === 'approved' && (
                <Button onClick={() => handleConvertPO(viewQtn.id)}>Convert to PO</Button>
              )}
              <Button variant="secondary" onClick={() => navigate(`/quotations/${viewQtn.id}/preview`)}>Preview</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!editQtn} onClose={() => setEditId(null)} title="Edit Quotation" size="lg">
        {editQtn && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Quotation No.">
                <Input value={editForm.id ?? editQtn.id} readOnly />
              </FormField>
              <FormField label="Date">
                <Input
                  value={editForm.date ?? editQtn.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                />
              </FormField>
              <FormField label="Valid Until" className="col-span-2">
                <Input
                  value={editForm.validUntil ?? editQtn.validUntil ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, validUntil: e.target.value })}
                />
              </FormField>
              <FormField label="Terms" className="col-span-2">
                <Input
                  value={editForm.terms ?? editQtn.terms ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, terms: e.target.value })}
                />
              </FormField>
            </div>
            <div className="flex gap-3">
              <Button onClick={saveEdit}>Save</Button>
              <Button variant="secondary" onClick={() => setEditId(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        title="Cancel Quotation"
        message={`Are you sure you want to cancel ${cancelId}?`}
        confirmLabel="Confirm"
        onConfirm={() => {
          if (cancelId) {
            cancelQuotation(cancelId)
            showToast('success', 'Quotation cancelled.')
          }
        }}
      />
    </div>
  )
}
