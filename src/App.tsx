import { AppLayout } from '@/components/layout/AppLayout'
import { AccomplishmentPage } from '@/pages/Accomplishment'
import { BillingPage } from '@/pages/Billing'
import { CustomersPage } from '@/pages/Customers'
import { DashboardPage } from '@/pages/Dashboard'
import { DeliveryReceiptsPage } from '@/pages/DeliveryReceipts'
import { InventoryOverviewPage } from '@/pages/InventoryOverview'
import { OutslipsPage } from '@/pages/Outslips'
import { ProductsPage } from '@/pages/Products'
import { PurchaseOrdersPage } from '@/pages/PurchaseOrders'
import { QuotationsPage } from '@/pages/Quotations'
import { ReceivingPage } from '@/pages/Receiving'
import { SOAPage } from '@/pages/SOA'
import { SuppliersPage } from '@/pages/Suppliers'
import { AccomplishmentPreviewPage } from '@/pages/previews/AccomplishmentPreview'
import { DeliveryReceiptPreviewPage } from '@/pages/previews/DeliveryReceiptPreview'
import { PurchaseOrderPreviewPage } from '@/pages/previews/PurchaseOrderPreview'
import { QuotationPreviewPage } from '@/pages/previews/QuotationPreview'
import { SOAPreviewPage } from '@/pages/previews/SOAPreview'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="quotations" element={<QuotationsPage />} />
          <Route path="quotations/:id/preview" element={<QuotationPreviewPage />} />
          <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="purchase-orders/:id/preview" element={<PurchaseOrderPreviewPage />} />
          <Route path="inventory" element={<InventoryOverviewPage />} />
          <Route path="inventory/receiving" element={<ReceivingPage />} />
          <Route path="inventory/outslips" element={<OutslipsPage />} />
          <Route path="delivery-receipts" element={<DeliveryReceiptsPage />} />
          <Route path="delivery-receipts/:id/preview" element={<DeliveryReceiptPreviewPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="soa" element={<SOAPage />} />
          <Route path="soa/preview" element={<SOAPreviewPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="reports/accomplishment" element={<AccomplishmentPage />} />
          <Route path="reports/accomplishment/preview" element={<AccomplishmentPreviewPage />} />
          <Route
            path="settings"
            element={
              <PlaceholderPage
                title="Settings"
                description="Configure system preferences and user settings."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
