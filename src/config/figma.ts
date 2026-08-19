/**
 * Figma mobile app prototype — ResponsivCode ERP (transactions only).
 * Spec: drawer navigation, no bottom tab bar, 12 screens.
 */
export const FIGMA_FILE_KEY = 'RBGqMoEJ2KFD2NTrxpr8OK'

export const FIGMA_PROTOTYPE_URL =
  'https://www.figma.com/design/RBGqMoEJ2KFD2NTrxpr8OK/Untitled'

export const FIGMA_MOBILE_FRAMES = {
  dashboard: '18:2',
  navigationDrawer: '18:77',
  quotationsList: '03 / Quotations List',
  quotationDetail: '04 / Quotation Detail',
  quotationPreview: '05 / Quotation Preview',
  purchaseOrdersList: '06 / Purchase Orders List',
  purchaseOrderDetail: '07 / Purchase Order Detail',
  outslipsList: '08 / Outslips List',
  outslipDetail: '09 / Outslip Detail',
  deliveryList: '10 / Delivery Receipts List',
  deliveryDetail: '11 / Delivery Receipt Detail',
  deliveryPreview: '12 / Delivery Receipt Preview',
} as const

export const mobileDesignTokens = {
  maroon: '#7A1F2B',
  maroonDark: '#5C1720',
  maroonLight: '#F4E6E8',
  white: '#FFFFFF',
  page: '#F7F7F7',
  textPrimary: '#242424',
  textSecondary: '#6B7280',
  border: '#E2E2E2',
  phoneWidth: 390,
  phoneHeight: 844,
} as const

/** Drawer menu — Dashboard, transactions, and Settings. */
export const mobileDrawerItems = [
  'Dashboard',
  'Quotations',
  'Purchase Orders',
  'Outslips',
  'Delivery Receipts',
  'Settings',
] as const
