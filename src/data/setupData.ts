import type {
  CompanyInfo,
  SetupBranch,
  SetupBrand,
  SetupCategory,
  SetupItem,
  SetupModel,
  SetupPosition,
  SetupProject,
  SetupUnitMeasure,
  SetupUser,
} from '@/types'

export const setupUsers: SetupUser[] = [
  { id: 'USR-001', name: 'Juan Dela Cruz', username: 'juan', position: 'Sales Staff', branch: 'Cebu Main', status: 'Active' },
  { id: 'USR-002', name: 'Maria Santos', username: 'maria', position: 'Warehouse Staff', branch: 'Cebu Main', status: 'Active' },
]

export const setupBranches: SetupBranch[] = [
  { code: 'BR-001', name: 'Cebu Main Branch', address: 'Cebu City, Cebu', contact: '0917-100-0001', status: 'Active' },
  { code: 'BR-002', name: 'Mandaue Branch', address: 'Mandaue City, Cebu', contact: '0918-100-0002', status: 'Active' },
]

export const setupProjects: SetupProject[] = [
  {
    code: 'PRJ-001',
    name: 'Cebu Office Expansion',
    customer: 'ABC Corporation',
    branch: 'Cebu Main Branch',
    startDate: 'August 1, 2026',
    endDate: 'December 31, 2026',
    status: 'Active',
  },
]

export const setupPositions: SetupPosition[] = [
  { name: 'Administrator', description: 'System administrator', status: 'Active' },
  { name: 'Manager', description: 'Department manager', status: 'Active' },
  { name: 'Sales Staff', description: 'Sales and quotations', status: 'Active' },
  { name: 'Warehouse Staff', description: 'Inventory and outslip', status: 'Active' },
  { name: 'Delivery Staff', description: 'Delivery operations', status: 'Active' },
  { name: 'Accountant', description: 'Billing and accounts', status: 'Active' },
]

export const setupCategories: SetupCategory[] = [
  { code: 'CAT-001', name: 'Computer Equipment', description: 'Computers and peripherals', status: 'Active' },
  { code: 'CAT-002', name: 'Office Equipment', description: 'Office machines', status: 'Active' },
  { code: 'CAT-003', name: 'Networking Equipment', description: 'Network devices', status: 'Active' },
  { code: 'CAT-004', name: 'Office Furniture', description: 'Furniture items', status: 'Active' },
]

export const setupBrands: SetupBrand[] = [
  { code: 'BRD-001', name: 'Dell', status: 'Active' },
  { code: 'BRD-002', name: 'HP', status: 'Active' },
  { code: 'BRD-003', name: 'Lenovo', status: 'Active' },
  { code: 'BRD-004', name: 'Cisco', status: 'Active' },
  { code: 'BRD-005', name: 'Epson', status: 'Active' },
]

export const setupModels: SetupModel[] = [
  { brand: 'Dell', name: 'Latitude 5420', description: 'Business laptop', status: 'Active' },
  { brand: 'Dell', name: 'Latitude 5520', description: 'Business laptop', status: 'Active' },
  { brand: 'Dell', name: 'OptiPlex 7090', description: 'Desktop', status: 'Active' },
  { brand: 'HP', name: 'ProBook 450', description: 'Business laptop', status: 'Active' },
  { brand: 'HP', name: 'EliteBook 840', description: 'Premium laptop', status: 'Active' },
  { brand: 'HP', name: 'LaserJet Pro', description: 'Laser printer', status: 'Active' },
]

export const setupUnits: SetupUnitMeasure[] = [
  { code: 'PCS', name: 'PCS', description: 'Pieces', status: 'Active' },
  { code: 'BOX', name: 'BOX', description: 'Box', status: 'Active' },
  { code: 'SET', name: 'SET', description: 'Set', status: 'Active' },
  { code: 'UNIT', name: 'UNIT', description: 'Unit', status: 'Active' },
  { code: 'KG', name: 'KG', description: 'Kilogram', status: 'Active' },
  { code: 'METER', name: 'METER', description: 'Meter', status: 'Active' },
]

export const setupItems: SetupItem[] = [
  {
    code: 'ITM-0001',
    name: 'Laptop Computer',
    category: 'Computer Equipment',
    brand: 'Dell',
    model: 'Latitude 5420',
    unit: 'PCS',
    description: 'Business laptop',
    status: 'Active',
  },
]

export const companyInfo: CompanyInfo = {
  name: 'ResponsivCode Technology Solutions',
  address: 'Cebu City, Cebu',
  phone: '0917-000-0000',
  email: 'info@responsivcode.example',
  taxInfo: 'VAT Registered',
}
