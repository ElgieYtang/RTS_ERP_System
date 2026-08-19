import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { useDemo } from '@/context/DemoContext'
import { formatCurrency } from '@/lib/format'
import { getStatusDisplay } from '@/lib/status'
import { useMemo, useState } from 'react'

export function BillingPage() {
  const { state, getCustomerName, recordPayment } = useDemo()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    date: 'August 19, 2026',
    reference: '',
    remarks: '',
  })

  const filtered = useMemo(() => {
    let list = state.billingStatements
    const q = search.toLowerCase()
    if (q) {
      list = list.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          getCustomerName(b.customerId).toLowerCase().includes(q),
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter((b) => b.paymentStatus === statusFilter)
    }
    return list
  }, [state.billingStatements, search, statusFilter, getCustomerName])

  const paymentBill = paymentId
    ? state.billingStatements.find((b) => b.id === paymentId)
    : null

  const savePayment = () => {
    if (!paymentId || !paymentForm.amount) return
    recordPayment(
      paymentId,
      Number(paymentForm.amount),
      paymentForm.date,
      paymentForm.reference || `PAY-${Date.now()}`,
    )
    setPaymentId(null)
    setPaymentForm({ amount: '', date: 'August 19, 2026', reference: '', remarks: '' })
  }

  return (
    <div>
      <PageHeader title="Billing" description="Generate and manage billing records." />
      <TableFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={[
          { value: 'unpaid', label: 'Unpaid' },
          { value: 'partially_paid', label: 'Partially Paid' },
          { value: 'paid', label: 'Paid' },
        ]}
      />
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>BS No.</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Billing Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={7}><EmptyState /></TableCell>
            </TableRow>
          ) : (
            filtered.map((b) => {
              const st = getStatusDisplay(b.paymentStatus)
              const balance = b.amount - (b.paidAmount ?? 0)
              return (
                <TableRow key={b.id}>
                  <TableCell><TableLink>{b.id}</TableLink></TableCell>
                  <TableCell>{getCustomerName(b.customerId)}</TableCell>
                  <TableCell>{b.referenceDrId ?? '—'}</TableCell>
                  <TableCell>{b.billingDate}</TableCell>
                  <TableCell>
                    {formatCurrency(b.amount)}
                    {b.paymentStatus === 'partially_paid' && (
                      <span className="text-xs text-text-secondary"> (Bal: {formatCurrency(balance)})</span>
                    )}
                  </TableCell>
                  <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                  <TableCell>
                    <TableActions
                      menuItems={[
                        ...(b.paymentStatus !== 'paid'
                          ? [{ label: 'Record Payment', onClick: () => setPaymentId(b.id) }]
                          : []),
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

      <Modal open={!!paymentBill} onClose={() => setPaymentId(null)} title="Record Payment" size="md">
        {paymentBill && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              {paymentBill.id} — Balance: {formatCurrency(paymentBill.amount - (paymentBill.paidAmount ?? 0))}
            </p>
            <FormField label="Amount">
              <Input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              />
            </FormField>
            <FormField label="Payment Date">
              <Input
                value={paymentForm.date}
                onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
              />
            </FormField>
            <FormField label="Reference">
              <Input
                value={paymentForm.reference}
                onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
              />
            </FormField>
            <FormField label="Remarks">
              <Input
                value={paymentForm.remarks}
                onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
              />
            </FormField>
            <Button onClick={savePayment}>Save Payment</Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
