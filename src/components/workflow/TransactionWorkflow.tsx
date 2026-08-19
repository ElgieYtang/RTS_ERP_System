import { useDemo } from '@/context/DemoContext'
import { getStatusDisplay } from '@/lib/status'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TransactionWorkflow({ quotationId }: { quotationId?: string }) {
  const { state, getCustomerName } = useDemo()
  const qtn = quotationId
    ? state.quotations.find((q) => q.id === quotationId)
    : state.quotations.find((q) => q.id === 'QTN-00001')

  if (!qtn) return null

  const po = state.purchaseOrders.find((p) => p.referenceQuotationId === qtn.id)
  const os = po ? state.outslips.find((o) => o.referencePoId === po.id) : undefined
  const dr = os ? state.deliveryReceipts.find((d) => d.referenceOutslipId === os.id) : undefined

  const steps = [
    {
      label: 'Quotation',
      id: qtn.id,
      statusLabel: getStatusDisplay(qtn.status).label,
      done: qtn.status === 'approved',
      current: !po && qtn.status === 'approved',
    },
    {
      label: 'Purchase Order',
      id: po?.id,
      statusLabel: po ? getStatusDisplay(po.status).label : 'Pending',
      done: !!po,
      current: po && !os,
    },
    {
      label: 'Outslip',
      id: os?.id,
      statusLabel: os ? getStatusDisplay(os.status).label : 'Pending',
      done: os && (os.status === 'approved' || os.status === 'for_dispatch'),
      current: os && os.status !== 'for_dispatch' && !!po,
    },
    {
      label: 'Delivery Receipt',
      id: dr?.id,
      statusLabel: dr ? getStatusDisplay(dr.status).label : 'Pending',
      done: dr?.status === 'delivered',
      current: dr && dr.status !== 'delivered',
    },
  ]

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">TRANSACTION WORKFLOW</h3>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full',
                  step.done && 'bg-[#DCFCE7] text-[#15803D]',
                  step.current && !step.done && 'bg-maroon text-white',
                  !step.done && !step.current && 'border-2 border-border bg-surface',
                )}
              >
                {step.done ? <Check className="h-3.5 w-3.5" /> : step.current ? (
                  <span className="h-2 w-2 rounded-full bg-white" />
                ) : null}
              </div>
              {i < steps.length - 1 && (
                <div className={cn('my-1 h-6 w-0.5', step.done ? 'bg-[#15803D]' : 'bg-border')} />
              )}
            </div>
            <div className="pb-2">
              <p className={cn('text-sm font-medium', step.current && 'text-maroon')}>
                {step.label}
              </p>
              {step.id && (
                <p className="text-xs text-text-secondary">
                  {step.id}
                  {step.statusLabel && ` — ${step.statusLabel}`}
                </p>
              )}
              {step.label === 'Quotation' && !step.id && (
                <p className="text-xs text-text-secondary">{getCustomerName(qtn.customerId)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
