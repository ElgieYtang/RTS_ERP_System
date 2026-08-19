import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/action-menu'
import { Card, CardContent } from '@/components/ui/card'
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
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function SOAPage() {
  const { state, getCustomerName, generateSOA } = useDemo()
  const navigate = useNavigate()
  const [customerId, setCustomerId] = useState('cust-abc')
  const [loading, setLoading] = useState(false)

  const customer = state.customers.find((c) => c.id === customerId)
  const bills = state.billingStatements.filter((b) => b.customerId === customerId)
  const payments = state.soaPayments.filter((p) => p.customerId === customerId)

  const totalCharges = bills.reduce((s, b) => s + b.amount, 0)
  const totalPayments = payments.reduce((s, p) => s + p.amount, 0)
  const outstanding = totalCharges - totalPayments

  const transactions = useMemo(() => {
    const rows: Array<{
      date: string
      ref: string
      desc: string
      debit: number
      credit: number
      balance: number
    }> = []
    let balance = 0
    bills.forEach((b) => {
      balance += b.amount
      rows.push({
        date: b.billingDate,
        ref: b.id,
        desc: `${b.referenceDrId ? 'Delivery billing' : 'Billing'} — ${getCustomerName(b.customerId)}`,
        debit: b.amount,
        credit: 0,
        balance,
      })
    })
    payments.forEach((p) => {
      balance -= p.amount
      rows.push({
        date: p.date,
        ref: p.reference,
        desc: p.description,
        debit: 0,
        credit: p.amount,
        balance,
      })
    })
    return rows.sort((a, b) => a.date.localeCompare(b.date))
  }, [bills, payments, getCustomerName])

  const handleGenerate = () => {
    setLoading(true)
    setTimeout(() => {
      generateSOA()
      setLoading(false)
    }, 400)
  }

  return (
    <div>
      <PageHeader
        title="Statement of Account"
        description="Generate and manage customer SOA documents."
        action={
          <div className="flex gap-2">
            <LoadingButton loading={loading} onClick={handleGenerate}>Generate SOA</LoadingButton>
            <Button variant="secondary" onClick={() => navigate('/soa/preview')}>Preview</Button>
            <Button variant="secondary" onClick={() => { navigate('/soa/preview'); setTimeout(() => window.print(), 300) }}>Print</Button>
          </div>
        }
      />

      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-medium">Customer:</label>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="h-9 rounded-md border border-border-input bg-surface px-3 text-sm"
        >
          {state.customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-4">
          <p className="text-sm text-text-secondary">Period: August 1–19, 2026</p>
          <p className="mt-1 font-semibold">{customer?.name}</p>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Date</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Debit</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead>Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t, i) => (
            <TableRow key={i}>
              <TableCell>{t.date}</TableCell>
              <TableCell>{t.ref}</TableCell>
              <TableCell>{t.desc}</TableCell>
              <TableCell>{t.debit ? formatCurrency(t.debit) : '—'}</TableCell>
              <TableCell>{t.credit ? formatCurrency(t.credit) : '—'}</TableCell>
              <TableCell>{formatCurrency(t.balance)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardContent className="pt-4"><p className="text-sm text-text-secondary">Total Charges</p><p className="text-xl font-semibold">{formatCurrency(totalCharges)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-text-secondary">Total Payments</p><p className="text-xl font-semibold">{formatCurrency(totalPayments)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-text-secondary">Outstanding Balance</p><p className="text-xl font-semibold text-maroon">{formatCurrency(outstanding)}</p></CardContent></Card>
      </div>
    </div>
  )
}
