import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FormField, Input } from '@/components/ui/input'
import { SetupListPage } from '@/pages/setup/SetupListPage'
import { useDemo } from '@/context/DemoContext'

export function UserSetupPage() {
  const { state } = useDemo()
  return (
    <SetupListPage
      title="User Setup"
      description="Manage system users and access roles."
      breadcrumbs={['Setup', 'User Setup']}
      actionLabel="+ Add User"
      columns={[
        { key: 'id', label: 'User ID' },
        { key: 'name', label: 'Name' },
        { key: 'username', label: 'Username' },
        { key: 'position', label: 'Position' },
        { key: 'branch', label: 'Branch' },
        { key: 'status', label: 'Status' },
      ]}
      rows={state.setupUsers.map((u) => ({
        id: u.id,
        name: u.name,
        username: u.username,
        position: u.position,
        branch: u.branch,
        status: u.status,
      }))}
    />
  )
}

export function BranchSetupPage() {
  const { state } = useDemo()
  return (
    <SetupListPage
      title="Branch Setup"
      description="Manage company branches."
      breadcrumbs={['Setup', 'Branch Setup']}
      actionLabel="+ Add Branch"
      columns={[
        { key: 'code', label: 'Branch Code' },
        { key: 'name', label: 'Branch Name' },
        { key: 'address', label: 'Address' },
        { key: 'contact', label: 'Contact' },
        { key: 'status', label: 'Status' },
      ]}
      rows={state.setupBranches.map((b) => ({
        code: b.code,
        name: b.name,
        address: b.address,
        contact: b.contact,
        status: b.status,
      }))}
    />
  )
}

export function ProjectSetupPage() {
  const { state } = useDemo()
  return (
    <SetupListPage
      title="Project Setup"
      description="Manage customer projects."
      breadcrumbs={['Setup', 'Project Setup']}
      actionLabel="+ Add Project"
      columns={[
        { key: 'code', label: 'Project Code' },
        { key: 'name', label: 'Project Name' },
        { key: 'customer', label: 'Customer' },
        { key: 'branch', label: 'Branch' },
        { key: 'startDate', label: 'Start Date' },
        { key: 'endDate', label: 'End Date' },
        { key: 'status', label: 'Status' },
      ]}
      rows={state.setupProjects.map((p) => ({
        code: p.code,
        name: p.name,
        customer: p.customer,
        branch: p.branch,
        startDate: p.startDate,
        endDate: p.endDate,
        status: p.status,
      }))}
    />
  )
}

export function PositionSetupPage() {
  const { state } = useDemo()
  return (
    <SetupListPage
      title="Position Setup"
      description="Manage employee positions."
      breadcrumbs={['Setup', 'Position Setup']}
      columns={[
        { key: 'name', label: 'Position' },
        { key: 'description', label: 'Description' },
        { key: 'status', label: 'Status' },
      ]}
      rows={state.setupPositions.map((p) => ({
        name: p.name,
        description: p.description,
        status: p.status,
      }))}
    />
  )
}

export function CategorySetupPage() {
  const { state } = useDemo()
  return (
    <SetupListPage
      title="Category"
      description="Manage product categories."
      breadcrumbs={['Setup', 'Category']}
      columns={[
        { key: 'code', label: 'Category Code' },
        { key: 'name', label: 'Category Name' },
        { key: 'description', label: 'Description' },
        { key: 'status', label: 'Status' },
      ]}
      rows={state.setupCategories.map((c) => ({
        code: c.code,
        name: c.name,
        description: c.description,
        status: c.status,
      }))}
    />
  )
}

export function BrandSetupPage() {
  const { state } = useDemo()
  return (
    <SetupListPage
      title="Brand"
      description="Manage product brands."
      breadcrumbs={['Setup', 'Brand']}
      columns={[
        { key: 'code', label: 'Brand Code' },
        { key: 'name', label: 'Brand Name' },
        { key: 'status', label: 'Status' },
      ]}
      rows={state.setupBrands.map((b) => ({
        code: b.code,
        name: b.name,
        status: b.status,
      }))}
    />
  )
}

export function ModelSetupPage() {
  const { state } = useDemo()
  return (
    <SetupListPage
      title="Model"
      description="Manage product models linked to brands."
      breadcrumbs={['Setup', 'Model']}
      columns={[
        { key: 'brand', label: 'Brand' },
        { key: 'name', label: 'Model Name' },
        { key: 'description', label: 'Description' },
        { key: 'status', label: 'Status' },
      ]}
      rows={state.setupModels.map((m) => ({
        brand: m.brand,
        name: m.name,
        description: m.description,
        status: m.status,
      }))}
    />
  )
}

export function UnitMeasureSetupPage() {
  const { state } = useDemo()
  return (
    <SetupListPage
      title="Unit Measure"
      description="Manage units of measure."
      breadcrumbs={['Setup', 'Unit Measure']}
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Unit Name' },
        { key: 'description', label: 'Description' },
        { key: 'status', label: 'Status' },
      ]}
      rows={state.setupUnits.map((u) => ({
        code: u.code,
        name: u.name,
        description: u.description,
        status: u.status,
      }))}
    />
  )
}

export function ItemSetupPage() {
  const { state } = useDemo()
  return (
    <SetupListPage
      title="Item"
      description="Manage items — category, brand, model, and unit measure."
      breadcrumbs={['Setup', 'Item']}
      actionLabel="+ Add Item"
      columns={[
        { key: 'code', label: 'Item Code' },
        { key: 'name', label: 'Item Name' },
        { key: 'category', label: 'Category' },
        { key: 'brand', label: 'Brand' },
        { key: 'model', label: 'Model' },
        { key: 'unit', label: 'Unit' },
        { key: 'status', label: 'Status' },
      ]}
      rows={state.setupItems.map((i) => ({
        code: i.code,
        name: i.name,
        category: i.category,
        brand: i.brand,
        model: i.model,
        unit: i.unit,
        status: i.status,
      }))}
    />
  )
}

export function CompanySetupPage() {
  const { state, showToast } = useDemo()
  const c = state.companyInfo
  return (
    <div>
      <PageHeader
        title="Company Setup"
        description="Manage company information."
        breadcrumbs={['Setup', 'Company Setup']}
        action={<Button onClick={() => showToast('success', 'Company information saved.')}>Save Changes</Button>}
      />
      <Card>
        <CardContent className="space-y-4 pt-4">
          <FormField label="Company Name"><Input value={c.name} readOnly /></FormField>
          <FormField label="Company Address"><Input value={c.address} readOnly /></FormField>
          <FormField label="Contact Number"><Input value={c.phone} readOnly /></FormField>
          <FormField label="Email"><Input value={c.email} readOnly /></FormField>
          <FormField label="Tax / Registration"><Input value={c.taxInfo} readOnly /></FormField>
          <div className="flex h-16 w-40 items-center justify-center rounded border border-dashed border-border text-xs text-text-secondary">
            [ COMPANY LOGO ]
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function SupplierSetupPage() {
  const { state } = useDemo()
  const codes = ['SUP-001', 'SUP-002', 'SUP-003']
  return (
    <SetupListPage
      title="Supplier"
      description="Manage supplier master records."
      breadcrumbs={['Setup', 'Supplier']}
      actionLabel="+ Add Supplier"
      columns={[
        { key: 'code', label: 'Supplier Code' },
        { key: 'name', label: 'Supplier Name' },
        { key: 'contact', label: 'Contact Person' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status' },
      ]}
      rows={state.suppliers.map((s, i) => ({
        code: codes[i] ?? `SUP-${i + 1}`,
        name: s.name,
        contact: s.contactPerson,
        phone: s.phone,
        email: s.email,
        status: 'Active',
      }))}
    />
  )
}

export function CustomerSetupPage() {
  const { state } = useDemo()
  const codes = ['CUS-001', 'CUS-002', 'CUS-003', 'CUS-004']
  return (
    <SetupListPage
      title="Customer"
      description="Manage customer master records."
      breadcrumbs={['Setup', 'Customer']}
      actionLabel="+ Add Customer"
      columns={[
        { key: 'code', label: 'Customer Code' },
        { key: 'name', label: 'Customer Name' },
        { key: 'contact', label: 'Contact Person' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'address', label: 'Address' },
        { key: 'status', label: 'Status' },
      ]}
      rows={state.customers.map((c, i) => ({
        code: codes[i] ?? `CUS-${i + 1}`,
        name: c.name,
        contact: c.contactPerson,
        phone: c.phone,
        email: c.email,
        address: c.address,
        status: 'Active',
      }))}
    />
  )
}
