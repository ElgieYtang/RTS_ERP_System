import { MobileDetailField, MobileDetailShell, MobileStickyActions } from '@/components/layout/MobileDetailShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TransactionWorkflow } from '@/components/workflow/TransactionWorkflow'
import { useDemo } from '@/context/DemoContext'
import { getStatusDisplay } from '@/lib/status'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

export function DeliveryReceiptDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { state, getCustomerName, markDeliveryOutForDelivery, markDeliveryDelivered } = useDemo()
  const navigate = useNavigate()

  const dr = state.deliveryReceipts.find((d) => d.id === id)
  if (!dr) return <Navigate to="/delivery-receipt" replace />

  const st = getStatusDisplay(dr.status)
  const outslip = state.outslips.find((o) => o.id === dr.referenceOutslipId)
  const po = outslip ? state.purchaseOrders.find((p) => p.id === outslip.referencePoId) : undefined

  return (
    <>
      <MobileDetailShell
        title={dr.id}
        backTo="/delivery-receipt"
        actions={
          <MobileStickyActions>
            {dr.status === 'active' && (
              <Button className="w-full" onClick={() => markDeliveryOutForDelivery(dr.id)}>
                Mark Out for Delivery
              </Button>
            )}
            {dr.status === 'out_for_delivery' && (
              <Button className="w-full" onClick={() => markDeliveryDelivered(dr.id)}>
                Mark Delivered
              </Button>
            )}
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate(`/delivery-receipt/${dr.id}/preview`)}
            >
              Preview / Print
            </Button>
          </MobileStickyActions>
        }
      >
        <div className="mb-4">
          <Badge variant={st.variant}>{st.label}</Badge>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <MobileDetailField label="Customer" value={getCustomerName(dr.customerId)} />
          <MobileDetailField label="Reference OS" value={dr.referenceOutslipId} />
          <MobileDetailField label="Delivery Date" value={dr.date} />
          <MobileDetailField label="Address" value={dr.deliveryAddress} />
          <MobileDetailField label="Driver" value={dr.driver} />
          <MobileDetailField label="Vehicle" value={dr.vehicle} />
        </div>

        <h2 className="mb-2 mt-4 text-sm font-semibold text-text-primary">Workflow</h2>
        <TransactionWorkflow quotationId={po?.referenceQuotationId} />
      </MobileDetailShell>

      <div className="hidden md:block">
        <Navigate to="/delivery-receipt" replace />
      </div>
    </>
  )
}
