import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

export type BadgeVariant =
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'draft'
  | 'current'
  | 'default'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  approved: 'bg-[#DCFCE7] text-[#15803D]',
  pending: 'bg-[#FEF3C7] text-[#B45309]',
  rejected: 'bg-[#FEE2E2] text-[#DC2626]',
  draft: 'bg-draft text-text-secondary',
  current: 'bg-maroon-light text-maroon',
  default: 'bg-draft text-text-secondary',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold leading-none',
        'min-h-[22px]',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  )
}
