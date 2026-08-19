import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { AccomplishmentPage } from '@/pages/Accomplishment'
import { BillingPage } from '@/pages/Billing'
import { DashboardPage } from '@/pages/Dashboard'
import { DeliveryReceiptsPage } from '@/pages/DeliveryReceipts'
import { InventoryOverviewPage } from '@/pages/InventoryOverview'
import { LoginPage } from '@/pages/Login'
import { OutslipsPage } from '@/pages/Outslips'
import { PurchaseOrdersPage } from '@/pages/PurchaseOrders'
import { QuotationDetailPage } from '@/pages/details/QuotationDetailPage'
import { PurchaseOrderDetailPage } from '@/pages/details/PurchaseOrderDetailPage'
import { OutslipDetailPage } from '@/pages/details/OutslipDetailPage'
import { DeliveryReceiptDetailPage } from '@/pages/details/DeliveryReceiptDetailPage'
import { QuotationsPage } from '@/pages/Quotations'
import { ReceivingPage } from '@/pages/Receiving'
import { SOAPage } from '@/pages/SOA'
import { AccomplishmentPreviewPage } from '@/pages/previews/AccomplishmentPreview'
import { DeliveryReceiptPreviewPage } from '@/pages/previews/DeliveryReceiptPreview'
import { PurchaseOrderPreviewPage } from '@/pages/previews/PurchaseOrderPreview'
import { QuotationPreviewPage } from '@/pages/previews/QuotationPreview'
import { SOAPreviewPage } from '@/pages/previews/SOAPreview'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import {
  BranchSetupPage,
  BrandSetupPage,
  CategorySetupPage,
  CompanySetupPage,
  CustomerSetupPage,
  ItemSetupPage,
  ModelSetupPage,
  PositionSetupPage,
  ProjectSetupPage,
  SupplierSetupPage,
  UnitMeasureSetupPage,
  UserSetupPage,
} from '@/pages/setup/SetupPages'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="quotations" element={<QuotationsPage />} />
            <Route path="quotations/:id" element={<QuotationDetailPage />} />
            <Route path="quotations/:id/preview" element={<QuotationPreviewPage />} />
            <Route path="purchase-order" element={<PurchaseOrdersPage />} />
            <Route path="purchase-order/:id" element={<PurchaseOrderDetailPage />} />
            <Route path="purchase-order/:id/preview" element={<PurchaseOrderPreviewPage />} />
            <Route path="outslip" element={<OutslipsPage />} />
            <Route path="outslip/:id" element={<OutslipDetailPage />} />
            <Route path="delivery-receipt" element={<DeliveryReceiptsPage />} />
            <Route path="delivery-receipt/:id" element={<DeliveryReceiptDetailPage />} />
            <Route path="delivery-receipt/:id/preview" element={<DeliveryReceiptPreviewPage />} />

            <Route path="setup/user-setup" element={<UserSetupPage />} />
            <Route path="setup/company-setup" element={<CompanySetupPage />} />
            <Route path="setup/branch-setup" element={<BranchSetupPage />} />
            <Route path="setup/project-setup" element={<ProjectSetupPage />} />
            <Route path="setup/position-setup" element={<PositionSetupPage />} />
            <Route path="setup/category" element={<CategorySetupPage />} />
            <Route path="setup/brand" element={<BrandSetupPage />} />
            <Route path="setup/model" element={<ModelSetupPage />} />
            <Route path="setup/unit-measure" element={<UnitMeasureSetupPage />} />
            <Route path="setup/item" element={<ItemSetupPage />} />
            <Route path="setup/supplier" element={<SupplierSetupPage />} />
            <Route path="setup/customer" element={<CustomerSetupPage />} />

            <Route path="settings" element={
              <PlaceholderPage title="Settings" description="Configure system preferences and user settings." />
            } />

            <Route path="purchase-orders" element={<Navigate to="/purchase-order" replace />} />
            <Route path="purchase-orders/:id/preview" element={<Navigate to="/purchase-order" replace />} />
            <Route path="delivery-receipts" element={<Navigate to="/delivery-receipt" replace />} />
            <Route path="delivery-receipts/:id/preview" element={<Navigate to="/delivery-receipt" replace />} />
            <Route path="inventory/outslips" element={<Navigate to="/outslip" replace />} />
            <Route path="inventory" element={<InventoryOverviewPage />} />
            <Route path="inventory/receiving" element={<ReceivingPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="soa" element={<SOAPage />} />
            <Route path="soa/preview" element={<SOAPreviewPage />} />
            <Route path="reports/accomplishment" element={<AccomplishmentPage />} />
            <Route path="reports/accomplishment/preview" element={<AccomplishmentPreviewPage />} />
            <Route path="customers" element={<Navigate to="/setup/customer" replace />} />
            <Route path="suppliers" element={<Navigate to="/setup/supplier" replace />} />
            <Route path="products" element={<Navigate to="/setup/item" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
