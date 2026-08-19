import {
  DocumentItemsTable,
  DocumentLayout,
  DocumentRow,
  PrintActions,
} from '@/components/documents/DocumentLayout'
import { useDemo } from '@/context/DemoContext'
import { formatCurrency } from '@/lib/format'
import { useNavigate, useParams } from 'react-router-dom'

export function PurchaseOrderPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state, getCustomerName } = useDemo()
  const po = state.purchaseOrders.find((p) => p.id === id)

  if (!po) return <p className="text-text-secondary">Purchase order not found.</p>

  const items = po.items.map((i) => ({
    name: i.productName,
    qty: i.quantity,
    price: i.unitPrice,
    amount: i.quantity * i.unitPrice,
  }))

  return (
    <div>
      <DocumentLayout title="PURCHASE ORDER">
        <DocumentRow label="PO No." value={po.id} highlight />
        <DocumentRow label="Reference Quotation" value={po.referenceQuotationId ?? '—'} />
        <DocumentRow label="Customer" value={getCustomerName(po.customerId)} />
        <DocumentRow label="Date" value={po.date} />
        <DocumentItemsTable items={items} />
        <div className="mt-4 text-right text-lg font-bold">
          Total: {formatCurrency(po.total)}
        </div>
      </DocumentLayout>
      <PrintActions onBack={() => navigate('/purchase-orders')} />
    </div>
  )
}
