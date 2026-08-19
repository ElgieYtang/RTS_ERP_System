import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLink,
  TableRow,
} from '@/components/ui/table'
import { useDemo } from '@/context/DemoContext'
import { formatCurrency } from '@/lib/format'
import { getStatusDisplay } from '@/lib/status'
import { cn } from '@/lib/utils'
import { Check, CreditCard, FileText, Package, ShoppingCart, Truck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const workflowStages = [
  { key: 'quotation', label: 'Quotation', path: '/quotations' },
  { key: 'purchase_order', label: 'Purchase Order', path: '/purchase-orders' },
  { key: 'receiving', label: 'Receiving', path: '/inventory/receiving' },
  { key: 'inventory', label: 'Inventory', path: '/inventory' },
  { key: 'outslip', label: 'Outslip', path: '/inventory/outslips' },
  { key: 'delivery', label: 'Delivery Receipt', path: '/delivery-receipts' },
  { key: 'billing', label: 'Billing', path: '/billing' },
  { key: 'soa', label: 'SOA', path: '/soa' },
  { key: 'accomplishment', label: 'Accomplishment Report', path: '/reports/accomplishment' },
] as const

const recentRows = [
  { id: 'QTN-00001', type: 'Quotation', customer: 'ABC Corporation', amount: '₱400,000', status: 'approved', path: '/quotations' },
  { id: 'PO-00001', type: 'Purchase Order', customer: 'ABC Corporation', amount: '₱400,000', status: 'fully_received', path: '/purchase-orders' },
  { id: 'REC-00001', type: 'Receiving', customer: 'TechSource Philippines', amount: '—', status: 'completed', path: '/inventory/receiving' },
  { id: 'OS-00001', type: 'Outslip', customer: 'ABC Corporation', amount: '—', status: 'released', path: '/inventory/outslips' },
  { id: 'DR-00001', type: 'Delivery Receipt', customer: 'ABC Corporation', amount: '—', status: 'delivered', path: '/delivery-receipts' },
  { id: 'BS-00001', type: 'Billing', customer: 'ABC Corporation', amount: '₱400,000', status: 'unpaid', path: '/billing' },
]

const attentionItems = [
  { title: 'Quotation QTN-00002', desc: 'Cebu Business Solutions — Waiting for approval', path: '/quotations' },
  { title: 'PO-00002', desc: '2 items remaining to be received', path: '/inventory/receiving' },
  { title: 'DR-00002', desc: 'Delivery currently out for delivery', path: '/delivery-receipts' },
  { title: 'BS-00001', desc: 'Payment outstanding', path: '/billing' },
]

export function DashboardPage() {
  const { state } = useDemo()
  const navigate = useNavigate()

  const pendingQuotations = state.quotations.filter((q) => q.status === 'pending').length
  const pendingReceiving = state.receivings.filter((r) => r.status === 'partial').length
  const pendingDeliveries = state.deliveryReceipts.filter((d) => d.status === 'out_for_delivery').length
  const pendingBilling = state.billingStatements.filter(
    (b) => b.paymentStatus === 'unpaid' || b.paymentStatus === 'partially_paid',
  ).length

  const outstandingSOA = state.billingStatements.reduce((sum, b) => {
    return sum + b.amount - (b.paidAmount ?? 0)
  }, 0)

  const stats = [
    { label: 'Pending Quotations', value: String(pendingQuotations), icon: FileText },
    { label: 'Purchase Orders', value: String(state.purchaseOrders.length), icon: ShoppingCart },
    { label: 'Pending Receiving', value: String(pendingReceiving), icon: Package },
    { label: 'Pending Deliveries', value: String(pendingDeliveries), icon: Truck },
    { label: 'For Billing', value: String(pendingBilling), icon: CreditCard },
    { label: 'Outstanding SOA', value: formatCurrency(outstandingSOA), icon: FileText },
  ]

  const currentStage = state.workflowStage

  const getStageStatus = (key: string) => {
    const order = workflowStages.map((s) => s.key)
    const currentIdx = order.indexOf(currentStage)
    const idx = order.indexOf(key as typeof workflowStages[number]['key'])
    if (idx < currentIdx) return 'completed'
    if (idx === currentIdx) return 'current'
    return 'future'
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of current transactions and workflow status."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-text-primary">{stat.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-maroon-light">
                  <stat.icon className="h-5 w-5 text-maroon" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardContent className="pt-4">
          <h2 className="mb-4 text-base font-semibold text-text-primary">Demo Workflow</h2>
          <div className="flex flex-wrap gap-2">
            {workflowStages.map((stage) => {
              const status = getStageStatus(stage.key)
              return (
                <button
                  key={stage.key}
                  type="button"
                  onClick={() => navigate(stage.path)}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    status === 'completed' && 'bg-[#DCFCE7] text-[#15803D] hover:bg-[#bbf7d0]',
                    status === 'current' && 'bg-maroon text-white hover:bg-maroon-dark',
                    status === 'future' && 'bg-draft text-text-secondary hover:bg-border',
                  )}
                >
                  {status === 'completed' && <Check className="h-4 w-4" />}
                  {status === 'current' && <span className="h-2 w-2 rounded-full bg-white" />}
                  {stage.label}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-text-primary">Recent Transactions</h2>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Document No.</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRows.map((tx) => {
                const st = getStatusDisplay(tx.status)
                return (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <TableLink onClick={() => navigate(tx.path)}>{tx.id}</TableLink>
                    </TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>{tx.customer}</TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <div>
          <h2 className="mb-3 text-base font-semibold text-text-primary">Needs Attention</h2>
          <Card className="border-maroon/20">
            <CardContent className="pt-4">
              <ul className="space-y-4">
                {attentionItems.map((item) => (
                  <li key={item.title} className="text-sm">
                    <p className="font-medium text-text-primary">{item.title}</p>
                    <p className="mt-0.5 text-text-secondary">{item.desc}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 h-auto px-0 text-maroon"
                      onClick={() => navigate(item.path)}
                    >
                      View
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
