import { COMPANY_NAME } from '@/types'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface DocumentLayoutProps {
  title: string
  children: ReactNode
  className?: string
  footer?: ReactNode
}

export function DocumentLayout({ title, children, className, footer }: DocumentLayoutProps) {
  return (
    <div
      className={cn(
        'mx-auto bg-surface text-text-primary print-document',
        'w-full max-w-[210mm] min-h-[297mm] border border-border p-8 shadow-sm',
        'print:border-0 print:shadow-none print:p-0',
        className,
      )}
    >
      <div className="text-center">
        <p className="text-sm font-semibold">{COMPANY_NAME}</p>
        <div className="mt-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded border border-dashed border-border bg-page text-xs text-text-secondary">
            [ COMPANY LOGO ]
          </div>
        </div>
        <h1 className="mt-6 text-xl font-bold tracking-wide text-maroon">{title}</h1>
        <div className="mx-auto mt-2 h-0.5 w-24 bg-maroon" />
      </div>
      <div className="mt-8">{children}</div>
      {footer && <div className="mt-8 border-t border-border pt-6">{footer}</div>}
    </div>
  )
}

export function DocumentRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex justify-between py-1 text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className={highlight ? 'font-semibold text-maroon' : 'text-text-primary'}>
        {value}
      </span>
    </div>
  )
}

export function DocumentItemsTable({
  items,
}: {
  items: Array<{
    name: string
    qty: number
    price: number
    amount: number
  }>
}) {
  return (
    <table className="mt-4 w-full text-sm">
      <thead>
        <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
          <th className="pb-2">Item</th>
          <th className="pb-2 text-right">Qty</th>
          <th className="pb-2 text-right">Price</th>
          <th className="pb-2 text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.name} className="border-b border-border">
            <td className="py-2">{item.name}</td>
            <td className="py-2 text-right">{item.qty}</td>
            <td className="py-2 text-right">₱{item.price.toLocaleString()}</td>
            <td className="py-2 text-right">₱{item.amount.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function PrintActions({
  onBack,
  onPrint,
}: {
  onBack?: () => void
  onPrint?: () => void
}) {
  return (
    <div className="mt-6 flex gap-3 no-print">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-maroon px-4 py-2 text-sm font-medium text-maroon hover:bg-maroon-light"
        >
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onPrint ?? (() => window.print())}
        className="rounded-md bg-maroon px-4 py-2 text-sm font-medium text-white hover:bg-maroon-dark"
      >
        Print
      </button>
    </div>
  )
}
