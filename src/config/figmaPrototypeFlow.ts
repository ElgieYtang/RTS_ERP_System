/**
 * Step-by-step prototype navigation map for Figma.
 * Each entry: source screen → clickable element → destination screen
 */
export const FIGMA_PROTOTYPE_FLOW = {
  // ── Dashboard entry points ──────────────────────────────────────
  dashboard: {
    hamburgerMenu: 'navigationDrawer',
    quickQuotations: 'quotationsList',
    quickPurchaseOrders: 'purchaseOrdersList',
    quickOutslips: 'outslipsList',
    quickDelivery: 'deliveryList',
    recentQTN00001: 'quotationDetail',
    recentPO00001: 'purchaseOrderDetail',
    recentOS00001: 'outslipDetail',
  },

  // ── Drawer (tap overlay to close → dashboard) ───────────────────
  navigationDrawer: {
    overlayClose: 'dashboard',
    menuDashboard: 'dashboard',
    menuQuotations: 'quotationsList',
    menuPurchaseOrders: 'purchaseOrdersList',
    menuOutslips: 'outslipsList',
    menuDeliveryReceipts: 'deliveryList',
    menuAccomplishments: 'accomplishmentsList',
  },

  // ── Quotations flow ───────────────────────────────────────────
  quotationsList: {
    back: 'dashboard',
    cardQTN00002: 'quotationDetail', // pending example
    cardViewButton: 'quotationDetail',
    fabNewQuotation: 'quotationDetail', // future: create form
  },
  quotationDetail: {
    back: 'quotationsList',
    preview: 'quotationPreview',
    createPO: 'purchaseOrderDetail',
    approve: 'quotationDetail', // same screen, status change
  },
  quotationPreview: {
    back: 'quotationDetail',
    print: 'quotationPreview',
  },

  // ── Purchase Orders flow ──────────────────────────────────────
  purchaseOrdersList: {
    back: 'dashboard',
    cardPO00001: 'purchaseOrderDetail',
  },
  purchaseOrderDetail: {
    back: 'purchaseOrdersList',
    receiveItems: 'purchaseOrdersList',
  },

  // ── Outslips flow ─────────────────────────────────────────────
  outslipsList: {
    back: 'dashboard',
    cardOS00001: 'outslipDetail',
  },
  outslipDetail: {
    back: 'outslipsList',
    approve: 'outslipDetail',
    createDR: 'deliveryDetail',
  },

  // ── Delivery Receipts flow ────────────────────────────────────
  deliveryList: {
    back: 'dashboard',
    cardDR00001: 'deliveryDetail',
  },
  deliveryDetail: {
    back: 'deliveryList',
    markOutForDelivery: 'deliveryDetail',
    markDelivered: 'deliveryDetail',
    print: 'deliveryPreview',
  },
  deliveryPreview: {
    back: 'deliveryDetail',
  },
} as const

/** Screen frame names in Figma (prefix with number for ordering). */
export const FIGMA_SCREEN_NAMES = [
  '01 / Dashboard',
  '02 / Navigation Drawer',
  '03 / Quotations List',
  '04 / Quotation Detail',
  '05 / Quotation Preview',
  '06 / Purchase Orders List',
  '07 / Purchase Order Detail',
  '08 / Outslips List',
  '09 / Outslip Detail',
  '10 / Delivery Receipts List',
  '11 / Delivery Receipt Detail',
  '12 / Delivery Receipt Preview',
] as const

/** Logo asset path in repo — upload to Figma via upload_assets. */
export const FIGMA_LOGO_PATH = 'public/logo.png'

/**
 * Status badge styling — perfect pill/oval.
 * cornerRadius must equal frame height / 2 (e.g. height 22 → radius 11).
 */
export const statusBadgeStyle = {
  paddingX: 12,
  paddingY: 5,
  fontSize: 11,
  minHeight: 22,
  colors: {
    pending: { bg: '#FEF3C7', text: '#B45309' },
    approved: { bg: '#DCFCE7', text: '#15803D' },
    rejected: { bg: '#FEE2E2', text: '#DC2626' },
    forDispatch: { bg: '#F4E6E8', text: '#7A1F2B' },
    active: { bg: '#F4E6E8', text: '#7A1F2B' },
    outForDelivery: { bg: '#DBEAFE', text: '#1D4ED8' },
    delivered: { bg: '#DCFCE7', text: '#15803D' },
  },
} as const
