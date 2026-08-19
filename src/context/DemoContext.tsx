import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { initialDemoState } from '@/data/initialData'
import type {
  BillingStatement,
  DemoState,
  Product,
  Quotation,
} from '@/types'

type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
}

interface DemoContextValue {
  state: DemoState
  getCustomerName: (id: string) => string
  getSupplierName: (id: string) => string
  getProduct: (id: string) => Product | undefined
  updateQuotation: (id: string, data: Partial<Quotation>) => void
  cancelQuotation: (id: string) => void
  convertQuotationToPO: (quotationId: string) => string | null
  updatePurchaseOrder: (id: string, data: Partial<DemoState['purchaseOrders'][0]>) => void
  confirmReceiving: (id: string) => void
  approveOutslip: (id: string) => void
  forDispatchOutslip: (id: string) => void
  releaseOutslip: (id: string) => void
  createDeliveryFromOutslip: (outslipId: string) => string | null
  markDeliveryOutForDelivery: (id: string) => void
  markDeliveryDelivered: (id: string) => void
  recordPayment: (billingId: string, amount: number, date: string, reference: string) => void
  generateSOA: () => void
  toasts: ToastMessage[]
  showToast: (type: ToastType, message: string) => void
  removeToast: (id: string) => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

function updateProductStock(
  products: Product[],
  productId: string,
  delta: number,
): Product[] {
  return products.map((p) => {
    if (p.id !== productId) return p
    const stock = p.stock + delta
    let status: Product['status'] = 'In Stock'
    if (stock === 0) status = 'Out of Stock'
    else if (stock <= p.reorderLevel) status = 'Low Stock'
    return { ...p, stock, status }
  })
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialDemoState)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = `toast-${Date.now()}`
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const getCustomerName = useCallback(
    (id: string) => state.customers.find((c) => c.id === id)?.name ?? id,
    [state.customers],
  )

  const getSupplierName = useCallback(
    (id: string) => state.suppliers.find((s) => s.id === id)?.name ?? id,
    [state.suppliers],
  )

  const getProduct = useCallback(
    (id: string) => state.products.find((p) => p.id === id),
    [state.products],
  )

  const updateQuotation = useCallback((id: string, data: Partial<Quotation>) => {
    setState((prev) => ({
      ...prev,
      quotations: prev.quotations.map((q) =>
        q.id === id ? { ...q, ...data } : q,
      ),
    }))
  }, [])

  const cancelQuotation = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      quotations: prev.quotations.map((q) =>
        q.id === id ? { ...q, status: 'cancelled' } : q,
      ),
    }))
  }, [])

  const convertQuotationToPO = useCallback((quotationId: string): string | null => {
    const qtn = state.quotations.find((q) => q.id === quotationId)
    if (!qtn || qtn.status !== 'approved') return null
    const existing = state.purchaseOrders.find((po) => po.referenceQuotationId === quotationId)
    if (existing) return existing.id

    const newId = 'PO-00004'
    const newPO = {
      id: newId,
      referenceQuotationId: quotationId,
      customerId: qtn.customerId,
      date: 'August 19, 2026',
      items: qtn.items,
      total: qtn.total,
      status: 'approved' as const,
    }
    setState((prev) => ({
      ...prev,
      purchaseOrders: [...prev.purchaseOrders, newPO],
      workflowStage: 'purchase_order',
    }))
    showToast('success', 'Purchase Order created successfully.')
    return newId
  }, [state.quotations, state.purchaseOrders, showToast])

  const updatePurchaseOrder = useCallback(
    (id: string, data: Partial<DemoState['purchaseOrders'][0]>) => {
      setState((prev) => ({
        ...prev,
        purchaseOrders: prev.purchaseOrders.map((po) =>
          po.id === id ? { ...po, ...data } : po,
        ),
      }))
    },
    [],
  )

  const confirmReceiving = useCallback((id: string) => {
    setState((prev) => {
      const rec = prev.receivings.find((r) => r.id === id)
      if (!rec) return prev
      if (rec.status === 'completed') {
        return prev
      }

      let products = [...prev.products]
      const movements = [...prev.stockMovements]

      rec.items.forEach((item) => {
        const toReceive = item.remaining > 0 ? item.remaining : item.ordered - item.received
        if (toReceive <= 0) return
        const product = products.find((p) => p.id === item.productId)
        if (!product) return
        products = updateProductStock(products, item.productId, toReceive)
        movements.unshift({
          id: `sm-${Date.now()}-${item.productId}`,
          productId: item.productId,
          date: 'August 19, 2026',
          reference: rec.id,
          type: 'Receiving',
          change: toReceive,
          balance: product.stock + toReceive,
        })
      })

      const receivings = prev.receivings.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'completed' as const,
              items: r.items.map((i) => ({
                ...i,
                received: i.ordered,
                remaining: 0,
              })),
            }
          : r,
      )

      return { ...prev, products, stockMovements: movements, receivings, workflowStage: 'receiving' }
    })
    showToast('success', 'Receiving completed successfully. Inventory has been updated.')
  }, [showToast])

  const approveOutslip = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      outslips: prev.outslips.map((o) =>
        o.id === id && o.status === 'pending' ? { ...o, status: 'approved' as const } : o,
      ),
    }))
    showToast('success', 'Outslip approved successfully.')
  }, [showToast])

  const forDispatchOutslip = useCallback((id: string) => {
    setState((prev) => {
      const os = prev.outslips.find((o) => o.id === id)
      if (!os || os.status !== 'approved') return prev

      let products = [...prev.products]
      const movements = [...prev.stockMovements]
      os.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (!product) return
        products = updateProductStock(products, item.productId, -item.quantity)
        movements.unshift({
          id: `sm-os-${Date.now()}-${item.productId}`,
          productId: item.productId,
          date: 'August 19, 2026',
          reference: os.id,
          type: 'Outslip',
          change: -item.quantity,
          balance: product.stock - item.quantity,
        })
      })

      return {
        ...prev,
        products,
        stockMovements: movements,
        outslips: prev.outslips.map((o) =>
          o.id === id ? { ...o, status: 'for_dispatch' as const } : o,
        ),
        workflowStage: 'outslip',
      }
    })
    showToast('success', 'Outslip marked for dispatch. Inventory has been updated.')
  }, [showToast])

  const releaseOutslip = useCallback((id: string) => {
    forDispatchOutslip(id)
  }, [forDispatchOutslip])

  const createDeliveryFromOutslip = useCallback((outslipId: string): string | null => {
    const os = state.outslips.find((o) => o.id === outslipId)
    if (!os || os.status !== 'for_dispatch') return null
    const existing = state.deliveryReceipts.find((d) => d.referenceOutslipId === outslipId)
    if (existing) return existing.id

    const customer = state.customers.find((c) => c.id === os.customerId)
    const num = state.deliveryReceipts.length + 1
    const drId = `DR-${String(num).padStart(5, '0')}`

    setState((prev) => ({
      ...prev,
      deliveryReceipts: [
        ...prev.deliveryReceipts,
        {
          id: drId,
          customerId: os.customerId,
          referenceOutslipId: os.id,
          date: 'August 19, 2026',
          deliveryAddress: customer?.address ?? 'Cebu City, Cebu',
          driver: 'Pedro Santos',
          vehicle: 'ABC-1234',
          status: 'active' as const,
        },
      ],
      workflowStage: 'delivery',
    }))
    showToast('success', 'Delivery Receipt created successfully.')
    return drId
  }, [state.outslips, state.deliveryReceipts, state.customers, showToast])

  const markDeliveryOutForDelivery = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      deliveryReceipts: prev.deliveryReceipts.map((dr) =>
        dr.id === id && dr.status === 'active' ? { ...dr, status: 'out_for_delivery' as const } : dr,
      ),
    }))
    showToast('success', 'Delivery marked as out for delivery.')
  }, [showToast])

  const markDeliveryDelivered = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      deliveryReceipts: prev.deliveryReceipts.map((dr) =>
        dr.id === id ? { ...dr, status: 'delivered' } : dr,
      ),
      workflowStage: 'delivery',
    }))
    showToast('success', 'Delivery marked as completed.')
  }, [showToast])

  const recordPayment = useCallback(
    (billingId: string, amount: number, date: string, reference: string) => {
      setState((prev) => {
        const bill = prev.billingStatements.find((b) => b.id === billingId)
        if (!bill) return prev

        const paidAmount = (bill.paidAmount ?? 0) + amount
        let paymentStatus: BillingStatement['paymentStatus'] = 'unpaid'
        if (paidAmount >= bill.amount) paymentStatus = 'paid'
        else if (paidAmount > 0) paymentStatus = 'partially_paid'

        const billingStatements = prev.billingStatements.map((b) =>
          b.id === billingId ? { ...b, paidAmount, paymentStatus } : b,
        )

        const soaPayments = [
          ...prev.soaPayments,
          {
            id: reference || `PAY-${Date.now()}`,
            customerId: bill.customerId,
            date,
            reference: reference || `PAY-${Date.now()}`,
            amount,
            description: 'Payment',
          },
        ]

        return { ...prev, billingStatements, soaPayments, workflowStage: 'billing' }
      })
      showToast('success', 'Payment recorded successfully.')
    },
    [showToast],
  )

  const generateSOA = useCallback(() => {
    setState((prev) => ({ ...prev, workflowStage: 'soa' }))
    showToast('success', 'SOA generated successfully.')
  }, [showToast])

  const value = useMemo(
    () => ({
      state,
      getCustomerName,
      getSupplierName,
      getProduct,
      updateQuotation,
      cancelQuotation,
      convertQuotationToPO,
      updatePurchaseOrder,
      confirmReceiving,
      approveOutslip,
      forDispatchOutslip,
      releaseOutslip,
      createDeliveryFromOutslip,
      markDeliveryOutForDelivery,
      markDeliveryDelivered,
      recordPayment,
      generateSOA,
      toasts,
      showToast,
      removeToast,
    }),
    [
      state,
      getCustomerName,
      getSupplierName,
      getProduct,
      updateQuotation,
      cancelQuotation,
      convertQuotationToPO,
      updatePurchaseOrder,
      confirmReceiving,
      approveOutslip,
      forDispatchOutslip,
      releaseOutslip,
      createDeliveryFromOutslip,
      markDeliveryOutForDelivery,
      markDeliveryDelivered,
      recordPayment,
      generateSOA,
      toasts,
      showToast,
      removeToast,
    ],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
