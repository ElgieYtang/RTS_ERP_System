import {
  BarChart3,
  Box,
  Building2,
  CreditCard,
  FileText,
  Home,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon?: LucideIcon
}

export interface NavGroup {
  label: string
  icon?: LucideIcon
  children: NavItem[]
}

export interface NavSection {
  heading?: string
  items: NavItem[]
  groups?: NavGroup[]
}

export const navigation: NavSection[] = [
  {
    items: [{ label: 'Dashboard', path: '/', icon: Home }],
  },
  {
    heading: 'TRANSACTIONS',
    items: [
      { label: 'Quotations', path: '/quotations', icon: FileText },
      { label: 'Purchase Orders', path: '/purchase-orders', icon: ShoppingCart },
      { label: 'Delivery Receipts', path: '/delivery-receipts', icon: Truck },
      { label: 'Billing', path: '/billing', icon: CreditCard },
      { label: 'SOA', path: '/soa', icon: Receipt },
    ],
    groups: [
      {
        label: 'Inventory',
        icon: Package,
        children: [
          { label: 'Overview', path: '/inventory' },
          { label: 'Receiving', path: '/inventory/receiving' },
          { label: 'Outslips', path: '/inventory/outslips' },
        ],
      },
    ],
  },
  {
    heading: 'MASTER DATA',
    items: [
      { label: 'Customers', path: '/customers', icon: Users },
      { label: 'Suppliers', path: '/suppliers', icon: Building2 },
      { label: 'Products', path: '/products', icon: Box },
    ],
  },
  {
    heading: 'REPORTS',
    items: [
      { label: 'Accomplishment', path: '/reports/accomplishment', icon: BarChart3 },
    ],
  },
  {
    items: [{ label: 'Settings', path: '/settings', icon: Settings }],
  },
]
