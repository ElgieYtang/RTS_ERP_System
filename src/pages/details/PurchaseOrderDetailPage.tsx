import { MobileDetailField, MobileDetailShell, MobileStickyActions } from '@/components/layout/MobileDetailShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TransactionWorkflow } from '@/components/workflow/TransactionWorkflow'
import { useDemo } from '@/context/DemoContext'
import { formatCurrency } from '@/lib/format'
import { getStatusDisplay } from '@/lib/status'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

export function PurchaseOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { state, getCustomerName, showToast } = useDemo()
  const navigate = useNavigate()

  const po = state.purchaseOrders.find((p) => p.id === id)
  if (!po) return <Navigate to="/purchase-order" replace />

  const st = getStatusDisplay(po.status)

  const receiveItems = () => {
    if (po.status === 'fully_received') {
      showToast('info', 'All items have been received.')
      return
    }
    navigate(`/inventory/receiving?po=${po.id}`)
  }

  return (
    <>
      <MobileDetailShell
        title={po.id}
        backTo="/purchase-order"
        actions={
          <MobileStickyActions>
            <Button className="w-full" onClick={receiveItems}>
              Receive Items
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate(`/purchase-order/${po.id}/preview`)}
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
          <MobileDetailField label="Customer" value={getCustomerName(po.customerId)} />
          <MobileDetailField label="Reference QTN" value={po.referenceQuotationId ?? '—'} />
          <MobileDetailField label="Date" value={po.date} />
          <MobileDetailField label="Total" value={formatCurrency(po.total)} />
        </div>

        <h2 className="mb-2 text-sm font-semibold text-text-primary">Line Items</h2>
        <div className="space-y-2">
          {po.items.map((item) => (
            <div key={item.productId} className="rounded-lg border border-border bg-surface p-3 text-sm">
              <p className="font-medium">{item.productName}</p>
              <p className="mt-1 text-text-secondary">
                {item.quantity} × {formatCurrency(item.unitPrice)}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mb-2 mt-6 text-sm font-semibold text-text-primary">Workflow</h2>
        <TransactionWorkflow quotationId={po.referenceQuotationId} />
      </MobileDetailShell>

      <div className="hidden md:block">
        <Navigate to="/purchase-order" replace />
      </div>
    </>
  )
}
