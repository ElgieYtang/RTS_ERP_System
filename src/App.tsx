import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardPage } from '@/pages/Dashboard'
import { DocumentPreviewPage } from '@/pages/DocumentPreview'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { QuotationsPage } from '@/pages/Quotations'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="quotations" element={<QuotationsPage />} />
          <Route
            path="purchase-orders"
            element={
              <PlaceholderPage
                title="Purchase Orders"
                description="Manage purchase orders linked to approved quotations."
              />
            }
          />
          <Route
            path="inventory"
            element={
              <PlaceholderPage
                title="Inventory Overview"
                description="View current stock levels and inventory status."
              />
            }
          />
          <Route
            path="inventory/receiving"
            element={
              <PlaceholderPage
                title="Receiving"
                description="Record incoming goods and update inventory."
              />
            }
          />
          <Route
            path="inventory/outslips"
            element={
              <PlaceholderPage
                title="Outslips"
                description="Manage outgoing inventory and outslip documents."
              />
            }
          />
          <Route
            path="delivery-receipts"
            element={
              <PlaceholderPage
                title="Delivery Receipts"
                description="Track and confirm customer deliveries."
              />
            }
          />
          <Route
            path="billing"
            element={
              <PlaceholderPage
                title="Billing"
                description="Generate and manage billing records."
              />
            }
          />
          <Route
            path="soa"
            element={
              <PlaceholderPage
                title="Statement of Account"
                description="Generate and manage customer SOA documents."
              />
            }
          />
          <Route
            path="customers"
            element={
              <PlaceholderPage
                title="Customers"
                description="Manage customer master data."
              />
            }
          />
          <Route
            path="suppliers"
            element={
              <PlaceholderPage
                title="Suppliers"
                description="Manage supplier master data."
              />
            }
          />
          <Route
            path="products"
            element={
              <PlaceholderPage
                title="Products"
                description="Manage product catalog and pricing."
              />
            }
          />
          <Route
            path="reports/accomplishment"
            element={
              <PlaceholderPage
                title="Accomplishment Reports"
                description="View workflow accomplishment and completion reports."
              />
            }
          />
          <Route
            path="settings"
            element={
              <PlaceholderPage
                title="Settings"
                description="Configure system preferences and user settings."
              />
            }
          />
          <Route path="document-preview" element={<DocumentPreviewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
