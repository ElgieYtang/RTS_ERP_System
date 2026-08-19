import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { useDemo } from '@/context/DemoContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function AccomplishmentPage() {
  const { state, showToast } = useDemo()
  const navigate = useNavigate()
  const [viewOpen, setViewOpen] = useState(false)
  const report = state.accomplishmentReports[0]

  if (!report) return null

  return (
    <div>
      <PageHeader
        title="Accomplishment Reports"
        description="View workflow accomplishment and completion reports."
        action={
          <div className="flex gap-2">
            <Button onClick={() => showToast('success', 'Report saved successfully.')}>Save</Button>
            <Button variant="secondary" onClick={() => navigate('/reports/accomplishment/preview')}>Preview</Button>
            <Button variant="secondary" onClick={() => { navigate('/reports/accomplishment/preview'); setTimeout(() => window.print(), 300) }}>Print</Button>
          </div>
        }
      />

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-text-primary">{report.id}</p>
              <p className="text-sm text-text-secondary">
                Reporting Period: {report.periodStart} – {report.periodEnd}
              </p>
            </div>
            <Button variant="secondary" onClick={() => setViewOpen(true)}>View</Button>
          </div>
        </CardContent>
      </Card>

      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Accomplishment Report" size="lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Total Quotations: <strong>{report.totalQuotations}</strong></div>
          <div>Approved Quotations: <strong>{report.approvedQuotations}</strong></div>
          <div>Purchase Orders: <strong>{report.purchaseOrders}</strong></div>
          <div>Receiving Transactions: <strong>{report.receivingTransactions}</strong></div>
          <div>Outslips: <strong>{report.outslips}</strong></div>
          <div>Delivery Receipts: <strong>{report.deliveryReceipts}</strong></div>
          <div>Billing Statements: <strong>{report.billingStatements}</strong></div>
          <div>Completed Deliveries: <strong>{report.completedDeliveries}</strong></div>
        </div>
        <p className="mt-4 text-sm text-text-secondary"><strong>Remarks:</strong> {report.remarks}</p>
        <Button className="mt-4" onClick={() => navigate('/reports/accomplishment/preview')}>Preview Report</Button>
      </Modal>
    </div>
  )
}
