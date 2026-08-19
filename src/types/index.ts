export const COMPANY_NAME = 'ResponsivCode Technology Solutions'

export type QuotationStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled'
export type POStatus = 'pending' | 'approved' | 'fully_received' | 'completed' | 'cancelled'
export type ReceivingStatus = 'completed' | 'partial'
export type OutslipStatus = 'pending' | 'approved' | 'for_dispatch' | 'released' | 'cancelled'
export type DeliveryStatus = 'active' | 'out_for_delivery' | 'delivered'
export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid'
export type ProductStockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock'

export interface LineItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

export interface Customer {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
}

export interface Supplier {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  unit: string
  price: number
  stock: number
  reorderLevel: number
  status: ProductStockStatus
}

export interface StockMovement {
  id: string
  productId: string
  date: string
  reference: string
  type: 'Receiving' | 'Outslip'
  change: number
  balance: number
}

export interface Quotation {
  id: string
  customerId: string
  date: string
  validUntil?: string
  items: LineItem[]
  total: number
  status: QuotationStatus
  terms?: string
  preparedBy?: string
  approvedBy?: string
}

export interface PurchaseOrder {
  id: string
  referenceQuotationId?: string
  customerId: string
  date: string
  items: LineItem[]
  total: number
  status: POStatus
}

export interface ReceivingRecord {
  id: string
  purchaseOrderId: string
  supplierId: string
  date: string
  items: Array<LineItem & { ordered: number; received: number; remaining: number }>
  status: ReceivingStatus
}

export interface Outslip {
  id: string
  customerId: string
  referencePoId?: string
  date: string
  items: LineItem[]
  status: OutslipStatus
}

export interface DeliveryReceipt {
  id: string
  customerId: string
  referenceOutslipId: string
  date: string
  deliveryAddress: string
  driver: string
  vehicle: string
  status: DeliveryStatus
}

export interface BillingStatement {
  id: string
  customerId: string
  referenceDrId?: string
  billingDate: string
  dueDate: string
  amount: number
  paymentStatus: PaymentStatus
  paidAmount?: number
}

export interface SOAPayment {
  id: string
  customerId: string
  date: string
  reference: string
  amount: number
  description: string
}

export interface AccomplishmentReport {
  id: string
  periodStart: string
  periodEnd: string
  totalQuotations: number
  approvedQuotations: number
  purchaseOrders: number
  receivingTransactions: number
  outslips: number
  deliveryReceipts: number
  billingStatements: number
  completedDeliveries: number
  remarks: string
}

export interface SetupUser {
  id: string
  name: string
  username: string
  position: string
  branch: string
  status: string
}

export interface SetupBranch {
  code: string
  name: string
  address: string
  contact: string
  status: string
}

export interface SetupProject {
  code: string
  name: string
  customer: string
  branch: string
  startDate: string
  endDate: string
  status: string
}

export interface SetupPosition {
  name: string
  description: string
  status: string
}

export interface SetupCategory {
  code: string
  name: string
  description: string
  status: string
}

export interface SetupBrand {
  code: string
  name: string
  status: string
}

export interface SetupModel {
  brand: string
  name: string
  description: string
  status: string
}

export interface SetupUnitMeasure {
  code: string
  name: string
  description: string
  status: string
}

export interface SetupItem {
  code: string
  name: string
  category: string
  brand: string
  model: string
  unit: string
  description: string
  status: string
}

export interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  taxInfo: string
}

export interface DemoState {
  customers: Customer[]
  suppliers: Supplier[]
  products: Product[]
  stockMovements: StockMovement[]
  quotations: Quotation[]
  purchaseOrders: PurchaseOrder[]
  receivings: ReceivingRecord[]
  outslips: Outslip[]
  deliveryReceipts: DeliveryReceipt[]
  billingStatements: BillingStatement[]
  soaPayments: SOAPayment[]
  accomplishmentReports: AccomplishmentReport[]
  workflowStage: 'quotation' | 'purchase_order' | 'receiving' | 'inventory' | 'outslip' | 'delivery' | 'billing' | 'soa' | 'accomplishment'
  setupUsers: SetupUser[]
  setupBranches: SetupBranch[]
  setupProjects: SetupProject[]
  setupPositions: SetupPosition[]
  setupCategories: SetupCategory[]
  setupBrands: SetupBrand[]
  setupModels: SetupModel[]
  setupUnits: SetupUnitMeasure[]
  setupItems: SetupItem[]
  companyInfo: CompanyInfo
}
