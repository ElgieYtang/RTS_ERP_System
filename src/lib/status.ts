import type { BadgeVariant } from '@/components/ui/badge'

const statusMap: Record<string, { variant: BadgeVariant; label: string }> = {
  draft: { variant: 'draft', label: 'Draft' },
  pending: { variant: 'pending', label: 'Pending' },
  approved: { variant: 'approved', label: 'Approved' },
  rejected: { variant: 'rejected', label: 'Rejected' },
  cancelled: { variant: 'rejected', label: 'Cancelled' },
  completed: { variant: 'approved', label: 'Completed' },
  partial: { variant: 'pending', label: 'Partially Received' },
  fully_received: { variant: 'approved', label: 'Fully Received' },
  released: { variant: 'approved', label: 'Released' },
  delivered: { variant: 'approved', label: 'Delivered' },
  out_for_delivery: { variant: 'pending', label: 'Out for Delivery' },
  unpaid: { variant: 'pending', label: 'Unpaid' },
  partially_paid: { variant: 'pending', label: 'Partially Paid' },
  paid: { variant: 'approved', label: 'Paid' },
  'In Stock': { variant: 'approved', label: 'In Stock' },
  'Low Stock': { variant: 'pending', label: 'Low Stock' },
  'Out of Stock': { variant: 'rejected', label: 'Out of Stock' },
}

export function getStatusDisplay(status: string) {
  return statusMap[status] ?? { variant: 'default' as BadgeVariant, label: status }
}
