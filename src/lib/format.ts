export function formatCurrency(amount: number): string {
  return `₱${amount.toLocaleString('en-PH')}`
}

export function formatDate(date: string): string {
  return date
}

export function lineTotal(item: { quantity: number; unitPrice: number }): number {
  return item.quantity * item.unitPrice
}

export function calcTotal(items: Array<{ quantity: number; unitPrice: number }>): number {
  return items.reduce((sum, i) => sum + lineTotal(i), 0)
}
