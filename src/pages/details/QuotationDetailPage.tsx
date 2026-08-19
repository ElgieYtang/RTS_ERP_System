import { MobileDetailField, MobileDetailShell, MobileStickyActions } from '@/components/layout/MobileDetailShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { QuotationWorkflow } from '@/components/workflow/quotationWorkflow'
import { useDemo } from '@/context/DemoContext'
import { formatCurrency } from '@/lib/format'
import { getStatusDisplay } from '@/lib/status'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

export function QuotationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { state, getCustomerName, convertQuotationToPO, showToast } = useDemo()
  const navigate = useNavigate()

  const quotation = state.quotations.find((q) => q.id === id)
  if (!quotation) return <Navigate to="/quotations" replace />

  const st = getStatusDisplay(quotation.status)

  const handleConvertPO = () => {
    const poId = convertQuotationToPO(quotation.id)
    if (poId) {
      showToast('info', `Created ${poId}`)
      navigate(`/purchase-order/${poId}`)
    }
  }

  return (
    <>
      <MobileDetailShell
        title={quotation.id}
        backTo="/quotations"
        actions={
          <MobileStickyActions>
            {quotation.status === 'approved' && (
              <Button className="w-full" onClick={handleConvertPO}>
                Create Purchase Order
              </Button>
            )}
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate(`/quotations/${quotation.id}/preview`)}
            >
              Preview / Print
            </Button>
          </MobileStickyActions>
        }
      >
        <div className="mb-4 flex items-center gap-2">
          <Badge variant={st.variant}>{st.label}</Badge>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <MobileDetailField label="Customer" value={getCustomerName(quotation.customerId)} />
          <MobileDetailField label="Date" value={quotation.date} />
          <MobileDetailField label="Valid Until" value={quotation.validUntil ?? '—'} />
          <MobileDetailField label="Total" value={formatCurrency(quotation.total)} />
        </div>

        <h2 className="mb-2 text-sm font-semibold text-text-primary">Line Items</h2>
        <div className="space-y-2">
          {quotation.items.map((item) => (
            <div key={item.productId} className="rounded-lg border border-border bg-surface p-3 text-sm">
              <p className="font-medium text-text-primary">{item.productName}</p>
              <p className="mt-1 text-text-secondary">
                {item.quantity} × {formatCurrency(item.unitPrice)} ={' '}
                {formatCurrency(item.quantity * item.unitPrice)}
              </p>
            </div>
          ))}
        </div>

        {quotation.terms && (
          <p className="mt-4 text-sm text-text-secondary">
            <span className="font-medium text-text-primary">Terms: </span>
            {quotation.terms}
          </p>
        )}

        <h2 className="mb-2 mt-6 text-sm font-semibold text-text-primary">Workflow</h2>
        <QuotationWorkflow quotation={quotation} />
      </MobileDetailShell>

      <div className="hidden md:block">
        <Navigate to="/quotations" replace />
      </div>
    </>
  )
}
