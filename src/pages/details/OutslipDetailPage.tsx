import { MobileDetailField, MobileDetailShell, MobileStickyActions } from '@/components/layout/MobileDetailShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TransactionWorkflow } from '@/components/workflow/TransactionWorkflow'
import { useDemo } from '@/context/DemoContext'
import { formatCurrency } from '@/lib/format'
import { getStatusDisplay } from '@/lib/status'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

export function OutslipDetailPage() {
  const { id } = useParams<{ id: string }>()
  const {
    state,
    getCustomerName,
    approveOutslip,
    forDispatchOutslip,
    createDeliveryFromOutslip,
  } = useDemo()
  const navigate = useNavigate()

  const outslip = state.outslips.find((o) => o.id === id)
  if (!outslip) return <Navigate to="/outslip" replace />

  const po = state.purchaseOrders.find((p) => p.id === outslip.referencePoId)
  const st = getStatusDisplay(outslip.status === 'released' ? 'for_dispatch' : outslip.status)

  const handleCreateDR = () => {
    const drId = createDeliveryFromOutslip(outslip.id)
    if (drId) navigate(`/delivery-receipt/${drId}`)
  }

  return (
    <>
      <MobileDetailShell
        title={outslip.id}
        backTo="/outslip"
        actions={
          <MobileStickyActions>
            {outslip.status === 'pending' && (
              <Button className="w-full" onClick={() => approveOutslip(outslip.id)}>
                Approve
              </Button>
            )}
            {outslip.status === 'approved' && (
              <Button className="w-full" onClick={() => forDispatchOutslip(outslip.id)}>
                Mark For Dispatch
              </Button>
            )}
            {(outslip.status === 'for_dispatch' || outslip.status === 'released') && (
              <Button className="w-full" onClick={handleCreateDR}>
                Create Delivery Receipt
              </Button>
            )}
          </MobileStickyActions>
        }
      >
        <div className="mb-4">
          <Badge variant={st.variant}>{st.label}</Badge>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <MobileDetailField label="Customer" value={getCustomerName(outslip.customerId)} />
          <MobileDetailField label="Reference PO" value={outslip.referencePoId ?? '—'} />
          <MobileDetailField label="Date" value={outslip.date} />
          <MobileDetailField
            label="Items"
            value={`${outslip.items.reduce((s, i) => s + i.quantity, 0)} units`}
          />
        </div>

        <h2 className="mb-2 text-sm font-semibold text-text-primary">Line Items</h2>
        <div className="space-y-2">
          {outslip.items.map((item) => (
            <div key={item.productId} className="rounded-lg border border-border bg-surface p-3 text-sm">
              <p className="font-medium">{item.productName}</p>
              <p className="mt-1 text-text-secondary">
                {item.quantity} × {formatCurrency(item.unitPrice)}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mb-2 mt-6 text-sm font-semibold text-text-primary">Workflow</h2>
        <TransactionWorkflow quotationId={po?.referenceQuotationId} />
      </MobileDetailShell>

      <div className="hidden md:block">
        <Navigate to="/outslip" replace />
      </div>
    </>
  )
}
