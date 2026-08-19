import { WorkflowTracker } from '@/components/workflow/WorkflowTracker'
import { useDemo } from '@/context/DemoContext'
import type { DemoState, Quotation } from '@/types'
import type { WorkflowStage } from '@/components/workflow/WorkflowTracker'

export function getQuotationWorkflow(
  quotationId: string,
  state: DemoState,
): WorkflowStage[] {
  const hasPO = state.purchaseOrders.some(
    (po) => po.referenceQuotationId === quotationId,
  )
  const po = state.purchaseOrders.find((p) => p.referenceQuotationId === quotationId)
  const hasReceiving = po
    ? state.receivings.some((r) => r.purchaseOrderId === po.id)
    : false
  const hasOutslip = po
    ? state.outslips.some((o) => o.referencePoId === po.id)
    : false
  const outslip = po ? state.outslips.find((o) => o.referencePoId === po.id) : undefined
  const hasDR = outslip
    ? state.deliveryReceipts.some((d) => d.referenceOutslipId === outslip.id)
    : false
  const dr = outslip
    ? state.deliveryReceipts.find((d) => d.referenceOutslipId === outslip.id)
    : undefined
  const hasBilling = dr
    ? state.billingStatements.some((b) => b.referenceDrId === dr.id)
    : false

  return [
    { label: 'Quotation', status: 'completed' },
    { label: 'Purchase Order', status: hasPO ? 'completed' : 'future' },
    {
      label: 'Receiving',
      status: hasReceiving ? 'completed' : hasPO ? 'current' : 'future',
    },
    { label: 'Inventory', status: hasReceiving ? 'completed' : 'future' },
    {
      label: 'Outslip',
      status: hasOutslip
        ? state.outslips.find((o) => o.referencePoId === po?.id)?.status === 'released'
          ? 'completed'
          : 'current'
        : hasReceiving ? 'current' : 'future',
    },
    {
      label: 'Delivery Receipt',
      status: hasDR
        ? state.deliveryReceipts.find((d) => d.referenceOutslipId === outslip?.id)?.status ===
          'delivered'
          ? 'completed'
          : 'current'
        : 'future',
    },
    { label: 'Billing', status: hasBilling ? 'current' : 'future' },
    { label: 'SOA', status: 'future' },
  ]
}

export function QuotationWorkflow({ quotation }: { quotation: Quotation }) {
  const { state } = useDemo()
  return <WorkflowTracker stages={getQuotationWorkflow(quotation.id, state)} />
}
