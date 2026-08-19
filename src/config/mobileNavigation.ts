import {
  FileText,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  type LucideIcon,
} from 'lucide-react'

export type MobileDrawerSection = 'main' | 'transactions' | 'settings'

export interface MobileDrawerItem {
  label: string
  path: string
  icon: LucideIcon
  end?: boolean
  section: MobileDrawerSection
}

export const mobileDrawerSectionLabels: Record<Exclude<MobileDrawerSection, 'main'>, string> = {
  transactions: 'Transactions',
  settings: 'Settings',
}

/** Mobile drawer — Dashboard, transactions, and Settings (no Setup). */
export const mobileDrawerItems: MobileDrawerItem[] = [
  { label: 'Dashboard', path: '/', icon: Home, end: true, section: 'main' },
  { label: 'Quotations', path: '/quotations', icon: FileText, section: 'transactions' },
  { label: 'Purchase Orders', path: '/purchase-order', icon: ShoppingCart, section: 'transactions' },
  { label: 'Outslips', path: '/outslip', icon: Package, section: 'transactions' },
  { label: 'Delivery Receipts', path: '/delivery-receipt', icon: Truck, section: 'transactions' },
  { label: 'Settings', path: '/settings', icon: Settings, section: 'settings' },
]
