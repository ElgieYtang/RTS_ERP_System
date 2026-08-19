import {
  DocumentLayout,
  PrintActions,
} from '@/components/documents/DocumentLayout'
import { useDemo } from '@/context/DemoContext'
import { useNavigate } from 'react-router-dom'

export function AccomplishmentPreviewPage() {
  const navigate = useNavigate()
  const { state } = useDemo()
  const report = state.accomplishmentReports[0]

  if (!report) return null

  const rows = [
    ['Total Quotations', report.totalQuotations],
    ['Approved Quotations', report.approvedQuotations],
    ['Purchase Orders', report.purchaseOrders],
    ['Receiving Transactions', report.receivingTransactions],
    ['Outslips', report.outslips],
    ['Delivery Receipts', report.deliveryReceipts],
    ['Billing Statements', report.billingStatements],
    ['Completed Deliveries', report.completedDeliveries],
  ]

  return (
    <div>
      <DocumentLayout title="ACCOMPLISHMENT REPORT">
        <p className="text-sm">
          <span className="text-text-secondary">Reporting Period:</span>{' '}
          {report.periodStart} – {report.periodEnd}
        </p>
        <table className="mt-6 w-full text-sm">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-b border-border">
                <td className="py-2 text-text-secondary">{label}</td>
                <td className="py-2 text-right font-medium">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 text-sm">
          <p className="font-medium text-maroon">Remarks</p>
          <p className="mt-1 text-text-secondary">{report.remarks}</p>
        </div>
      </DocumentLayout>
      <PrintActions onBack={() => navigate('/reports/accomplishment')} />
    </div>
  )
}
