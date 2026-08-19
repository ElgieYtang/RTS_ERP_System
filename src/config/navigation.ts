import {
  Award,
  Boxes,
  Briefcase,
  Building2,
  FileText,
  FolderKanban,
  Home,
  MapPin,
  Package,
  Ruler,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  UserCircle,
  Users,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon?: LucideIcon
  indent?: boolean
}

export interface NavSection {
  heading?: string
  items: NavItem[]
}

export const navigation: NavSection[] = [
  {
    items: [{ label: 'Dashboard', path: '/', icon: Home }],
  },
  {
    heading: 'TRANSACTION',
    items: [
      { label: 'Quotations', path: '/quotations', icon: FileText, indent: true },
      { label: 'Purchase Order', path: '/purchase-order', icon: ShoppingCart, indent: true },
      { label: 'Outslip', path: '/outslip', icon: Package, indent: true },
      { label: 'Delivery Receipt', path: '/delivery-receipt', icon: Truck, indent: true },
    ],
  },
  {
    heading: 'SETUP',
    items: [
      { label: 'User Setup', path: '/setup/user-setup', icon: Users, indent: true },
      { label: 'Company Setup', path: '/setup/company-setup', icon: Building2, indent: true },
      { label: 'Branch Setup', path: '/setup/branch-setup', icon: MapPin, indent: true },
      { label: 'Project Setup', path: '/setup/project-setup', icon: FolderKanban, indent: true },
      { label: 'Position Setup', path: '/setup/position-setup', icon: Briefcase, indent: true },
      { label: 'Category', path: '/setup/category', icon: Tags, indent: true },
      { label: 'Brand', path: '/setup/brand', icon: Award, indent: true },
      { label: 'Model', path: '/setup/model', icon: Boxes, indent: true },
      { label: 'Unit Measure', path: '/setup/unit-measure', icon: Ruler, indent: true },
      { label: 'Item', path: '/setup/item', icon: Package, indent: true },
      { label: 'Supplier', path: '/setup/supplier', icon: Warehouse, indent: true },
      { label: 'Customer', path: '/setup/customer', icon: UserCircle, indent: true },
    ],
  },
  {
    items: [{ label: 'Settings', path: '/settings', icon: Settings }],
  },
]
