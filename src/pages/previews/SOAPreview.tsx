import {
  DocumentLayout,
  PrintActions,
} from '@/components/documents/DocumentLayout'
import { useDemo } from '@/context/DemoContext'
import { formatCurrency } from '@/lib/format'
import { useNavigate } from 'react-router-dom'

export function SOAPreviewPage() {
  const navigate = useNavigate()
  const { state } = useDemo()
  const customerId = 'cust-abc'
  const customer = state.customers.find((c) => c.id === customerId)
  const bills = state.billingStatements.filter((b) => b.customerId === customerId)
  const payments = state.soaPayments.filter((p) => p.customerId === customerId)
  const totalCharges = bills.reduce((s, b) => s + b.amount, 0)
  const totalPayments = payments.reduce((s, p) => s + p.amount, 0)
  const outstanding = totalCharges - totalPayments

  return (
    <div>
      <DocumentLayout title="STATEMENT OF ACCOUNT">
        <div className="space-y-1 text-sm">
          <p><span className="text-text-secondary">Customer:</span> {customer?.name}</p>
          <p><span className="text-text-secondary">Period:</span> August 1–19, 2026</p>
        </div>
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-text-secondary">
              <th className="pb-2">Date</th>
              <th className="pb-2">Reference</th>
              <th className="pb-2">Description</th>
              <th className="pb-2 text-right">Debit</th>
              <th className="pb-2 text-right">Credit</th>
              <th className="pb-2 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={b.id} className="border-b border-border">
                <td className="py-2">{b.billingDate}</td>
                <td>{b.id}</td>
                <td>Laptop Computer Purchase</td>
                <td className="text-right">{formatCurrency(b.amount)}</td>
                <td className="text-right">—</td>
                <td className="text-right">{formatCurrency(b.amount)}</td>
              </tr>
            ))}
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="py-2">{p.date}</td>
                <td>{p.reference}</td>
                <td>{p.description}</td>
                <td className="text-right">—</td>
                <td className="text-right">{formatCurrency(p.amount)}</td>
                <td className="text-right">{formatCurrency(totalCharges - p.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between"><span>Total Charges:</span><span>{formatCurrency(totalCharges)}</span></div>
          <div className="flex justify-between"><span>Total Payments:</span><span>{formatCurrency(totalPayments)}</span></div>
          <div className="flex justify-between font-bold text-maroon">
            <span>Outstanding Balance:</span><span>{formatCurrency(outstanding)}</span>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-8 text-sm">
          <div>
            <p className="text-text-secondary">Prepared By</p>
            <p className="mt-8 border-t border-border pt-2">Admin User</p>
          </div>
          <div>
            <p className="text-text-secondary">Authorized Signature</p>
            <p className="mt-8 border-t border-border pt-2">&nbsp;</p>
          </div>
        </div>
      </DocumentLayout>
      <PrintActions onBack={() => navigate('/soa')} />
    </div>
  )
}
