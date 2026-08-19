import {
  DocumentLayout,
  DocumentRow,
  PrintActions,
} from '@/components/documents/DocumentLayout'
import { useDemo } from '@/context/DemoContext'
import { getStatusDisplay } from '@/lib/status'
import { useNavigate, useParams } from 'react-router-dom'

export function DeliveryReceiptPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state, getCustomerName } = useDemo()
  const dr = state.deliveryReceipts.find((d) => d.id === id)

  if (!dr) return <p className="text-text-secondary">Delivery receipt not found.</p>

  const outslip = state.outslips.find((o) => o.id === dr.referenceOutslipId)

  return (
    <div>
      <DocumentLayout title="DELIVERY RECEIPT">
        <DocumentRow label="DR No." value={dr.id} highlight />
        <DocumentRow label="Date" value={dr.date} />
        <DocumentRow label="Customer" value={getCustomerName(dr.customerId)} />
        <DocumentRow label="Delivery Address" value={dr.deliveryAddress} />
        <DocumentRow label="Driver" value={dr.driver} />
        <DocumentRow label="Vehicle" value={dr.vehicle} />
        <DocumentRow label="Reference Outslip" value={dr.referenceOutslipId} />
        <DocumentRow label="Status" value={getStatusDisplay(dr.status).label} />
        {outslip && (
          <div className="mt-4 text-sm">
            <p className="font-medium text-maroon">Items Delivered</p>
            <ul className="mt-2 list-disc pl-5">
              {outslip.items.map((i) => (
                <li key={i.productId}>{i.productName} × {i.quantity}</li>
              ))}
            </ul>
          </div>
        )}
      </DocumentLayout>
      <PrintActions onBack={() => navigate('/delivery-receipt')} />
    </div>
  )
}
