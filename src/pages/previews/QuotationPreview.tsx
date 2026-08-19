import {
  DocumentItemsTable,
  DocumentLayout,
  DocumentRow,
  PrintActions,
} from '@/components/documents/DocumentLayout'
import { useDemo } from '@/context/DemoContext'
import { formatCurrency } from '@/lib/format'
import { useNavigate, useParams } from 'react-router-dom'

export function QuotationPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state } = useDemo()
  const qtn = state.quotations.find((q) => q.id === id)

  if (!qtn) {
    return <p className="text-text-secondary">Quotation not found.</p>
  }

  const customer = state.customers.find((c) => c.id === qtn.customerId)
  const items = qtn.items.map((i) => ({
    name: i.productName,
    qty: i.quantity,
    price: i.unitPrice,
    amount: i.quantity * i.unitPrice,
  }))

  return (
    <div>
      <DocumentLayout
        title="QUOTATION"
        footer={
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="text-text-secondary">Prepared By</p>
              <p className="mt-4 border-t border-border pt-2">{qtn.preparedBy ?? 'Admin User'}</p>
            </div>
            <div>
              <p className="text-text-secondary">Approved By</p>
              <p className="mt-4 border-t border-border pt-2">{qtn.approvedBy ?? '—'}</p>
            </div>
          </div>
        }
      >
        <DocumentRow label="Quotation No." value={qtn.id} highlight />
        <DocumentRow label="Date" value={qtn.date} />
        <DocumentRow label="Valid Until" value={qtn.validUntil ?? '—'} />
        <div className="mt-4 rounded border border-border p-3 text-sm">
          <p className="font-medium">{customer?.name}</p>
          <p className="text-text-secondary">{customer?.contactPerson}</p>
          <p className="text-text-secondary">{customer?.address}</p>
          <p className="text-text-secondary">{customer?.phone}</p>
        </div>
        <DocumentItemsTable items={items} />
        <div className="mt-4 flex justify-end text-sm">
          <div className="space-y-1 text-right">
            <p>Subtotal: {formatCurrency(qtn.total)}</p>
            <p className="text-lg font-bold">Grand Total: {formatCurrency(qtn.total)}</p>
          </div>
        </div>
        {qtn.terms && (
          <div className="mt-6 text-sm">
            <p className="font-medium text-maroon">Terms and Conditions</p>
            <p className="mt-1 text-text-secondary">{qtn.terms}</p>
          </div>
        )}
      </DocumentLayout>
      <PrintActions onBack={() => navigate('/quotations')} />
    </div>
  )
}
