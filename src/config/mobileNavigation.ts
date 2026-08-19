import { FileText, Home, Package, ShoppingCart, Truck, type LucideIcon } from 'lucide-react'

export interface MobileDrawerItem {
  label: string
  path: string
  icon: LucideIcon
  end?: boolean
}

/** Mobile drawer — Dashboard + transactions (no Setup, no Settings). */
export const mobileDrawerItems: MobileDrawerItem[] = [
  { label: 'Dashboard', path: '/', icon: Home, end: true },
  { label: 'Quotations', path: '/quotations', icon: FileText },
  { label: 'Purchase Orders', path: '/purchase-order', icon: ShoppingCart },
  { label: 'Outslips', path: '/outslip', icon: Package },
  { label: 'Delivery Receipts', path: '/delivery-receipt', icon: Truck },
]
