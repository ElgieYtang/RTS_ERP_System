import { Badge } from '@/components/ui/badge'
import { MobileCardList } from '@/components/ui/mobile-card-list'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { ResponsiveTable } from '@/components/ui/responsive-table'
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
import { Check, FileText, Package, ShoppingCart, Truck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const workflowStages = [
  { label: 'Quotation', path: '/quotations' },
  { label: 'Purchase Order', path: '/purchase-order' },
  { label: 'Outslip', path: '/outslip' },
  { label: 'Delivery Receipt', path: '/delivery-receipt' },
]

const quickTransactions = [
  { label: 'Quotations', path: '/quotations', icon: FileText, countKey: 'pendingQuotations' as const },
  { label: 'Purchase Orders', path: '/purchase-order', icon: ShoppingCart, countKey: 'pendingPO' as const },
  { label: 'Outslips', path: '/outslip', icon: Package, countKey: 'pendingOutslips' as const },
  { label: 'Delivery', path: '/delivery-receipt', icon: Truck, countKey: 'activeDeliveries' as const },
]

export function DashboardPage() {
  const { state } = useDemo()
  const navigate = useNavigate()

  const pendingQuotations = state.quotations.filter((q) => q.status === 'pending').length
  const pendingOutslips = state.outslips.filter((o) => o.status === 'pending').length
  const pendingPO = state.purchaseOrders.filter((p) => p.status === 'pending').length
  const activeDeliveries = state.deliveryReceipts.filter(
    (d) => d.status === 'out_for_delivery' || d.status === 'active',
  ).length

  const counts = {
    pendingQuotations,
    pendingOutslips,
    pendingPO,
    activeDeliveries,
  }

  const recentRows = [
    {
      id: 'QTN-00001',
      type: 'Quotation',
      customer: 'ABC Corporation',
      amount: formatCurrency(400000),
      status: 'approved',
      path: '/quotations/QTN-00001',
    },
    {
      id: 'PO-00001',
      type: 'Purchase Order',
      customer: 'ABC Corporation',
      amount: formatCurrency(400000),
      status: 'fully_received',
      path: '/purchase-order/PO-00001',
    },
    {
      id: 'OS-00001',
      type: 'Outslip',
      customer: 'ABC Corporation',
      amount: '—',
      status: 'for_dispatch',
      path: '/outslip/OS-00001',
    },
    {
      id: 'DR-00001',
      type: 'Delivery Receipt',
      customer: 'ABC Corporation',
      amount: '—',
      status: 'active',
      path: '/delivery-receipt/DR-00001',
    },
  ]

  const currentStage = state.workflowStage
  const stageKeys = ['quotation', 'purchase_order', 'outslip', 'delivery'] as const

  const getStageStatus = (index: number) => {
    const currentIdx = stageKeys.indexOf(
      currentStage === 'receiving' || currentStage === 'inventory'
        ? 'outslip'
        : currentStage === 'billing' || currentStage === 'soa' || currentStage === 'accomplishment'
          ? 'delivery'
          : (currentStage as (typeof stageKeys)[number]),
    )
    if (index < currentIdx) return 'completed'
    if (index === currentIdx) return 'current'
    return 'future'
  }

  return (
    <div>
      {/* Mobile dashboard */}
      <div className="md:hidden">
        <div className="mb-5">
          <p className="text-sm text-text-secondary">
            Here&apos;s an overview of today&apos;s transactions.
          </p>
        </div>

        <div className="-mx-4 mb-6 flex gap-3 overflow-x-auto px-4 pb-1">
          <div className="min-w-[160px] flex-1 rounded-xl border border-border bg-surface p-4">
            <p className="text-xs text-text-secondary">Pending Quotations</p>
            <p className="mt-2 text-3xl font-bold text-maroon">{pendingQuotations}</p>
            <p className="mt-1 text-xs text-text-secondary">Needs attention</p>
          </div>
          <div className="min-w-[160px] flex-1 rounded-xl border border-border bg-surface p-4">
            <p className="text-xs text-text-secondary">Pending Outslips</p>
            <p className="mt-2 text-3xl font-bold text-maroon">{pendingOutslips}</p>
            <p className="mt-1 text-xs text-text-secondary">Awaiting approval</p>
          </div>
        </div>

        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
          Quick Transactions
        </p>
        <div className="-mx-4 mb-6 flex gap-3 overflow-x-auto px-4 pb-1">
          {quickTransactions.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              className="flex min-w-[120px] flex-col rounded-xl border border-border bg-surface p-3 text-left active:bg-maroon-light"
            >
              <item.icon className="h-5 w-5 text-maroon" />
              <p className="mt-2 text-sm font-medium text-text-primary">{item.label}</p>
              <p className="mt-0.5 text-xs text-text-secondary">
                {counts[item.countKey]} Pending
              </p>
            </button>
          ))}
        </div>

        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
          Recent Transactions
        </p>
        <MobileCardList
          variant="transaction"
          items={recentRows.map((tx) => {
            const st = getStatusDisplay(tx.status)
            return {
              id: tx.id,
              title: tx.id,
              subtitle: tx.customer,
              meta: tx.type,
              amount: tx.amount,
              badge: { label: st.label, variant: st.variant },
              onClick: () => navigate(tx.path),
            }
          })}
        />
      </div>

      {/* Desktop dashboard */}
      <div className="hidden md:block">
        <PageHeader
          title="Dashboard"
          description="Overview of current transactions and workflow status."
        />

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Pending Quotations', value: String(pendingQuotations), icon: FileText },
            { label: 'Purchase Orders', value: String(state.purchaseOrders.length), icon: ShoppingCart },
            { label: 'Pending Outslips', value: String(pendingOutslips), icon: Truck },
            { label: 'Active Deliveries', value: String(activeDeliveries), icon: Truck },
          ].map((stat) => (
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
              {workflowStages.map((stage, index) => {
                const status = getStageStatus(index)
                return (
                  <button
                    key={stage.label}
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

        <h2 className="mb-3 text-base font-semibold text-text-primary">Recent Transactions</h2>
        <ResponsiveTable
          mobileItems={recentRows.map((tx) => {
            const st = getStatusDisplay(tx.status)
            return {
              id: tx.id,
              title: tx.id,
              subtitle: tx.customer,
              badge: { label: st.label, variant: st.variant },
              fields: [
                { label: 'Type', value: tx.type },
                { label: 'Amount', value: tx.amount },
              ],
              onClick: () => navigate(tx.path),
            }
          })}
          desktop={
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
          }
        />
      </div>
    </div>
  )
}
