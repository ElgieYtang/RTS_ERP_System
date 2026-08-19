import {
  Award,
  FileText,
  Home,
  Package,
  ShoppingCart,
  Truck,
  type LucideIcon,
} from 'lucide-react'

export type MobileDrawerSection = 'main' | 'transactions'

export interface MobileDrawerItem {
  label: string
  path: string
  icon: LucideIcon
  end?: boolean
  section: MobileDrawerSection
}

export const mobileDrawerSectionLabels: Record<Exclude<MobileDrawerSection, 'main'>, string> = {
  transactions: 'Transactions',
}

/** Mobile drawer — Dashboard + transactions (no Setup, no Settings). */
export const mobileDrawerItems: MobileDrawerItem[] = [
  { label: 'Dashboard', path: '/', icon: Home, end: true, section: 'main' },
  { label: 'Quotations', path: '/quotations', icon: FileText, section: 'transactions' },
  { label: 'Purchase Orders', path: '/purchase-order', icon: ShoppingCart, section: 'transactions' },
  { label: 'Outslips', path: '/outslip', icon: Package, section: 'transactions' },
  { label: 'Delivery Receipts', path: '/delivery-receipt', icon: Truck, section: 'transactions' },
  { label: 'Accomplishments', path: '/reports/accomplishment', icon: Award, section: 'transactions' },
]
