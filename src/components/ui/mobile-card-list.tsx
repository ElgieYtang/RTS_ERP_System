import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

export interface MobileCardField {
  label: string
  value: ReactNode
}

export interface MobileCardItem {
  id: string
  title: ReactNode
  subtitle?: ReactNode
  meta?: ReactNode
  amount?: ReactNode
  badge?: { label: string; variant?: BadgeVariant }
  fields?: MobileCardField[]
  onClick?: () => void
}

interface MobileCardListProps {
  items: MobileCardItem[]
  emptyMessage?: string
  className?: string
  variant?: 'default' | 'transaction'
}

export function MobileCardList({
  items,
  emptyMessage = 'No records found.',
  className,
  variant = 'default',
}: MobileCardListProps) {
  if (items.length === 0) {
    return (
      <div className={cn('rounded-lg border border-border bg-surface p-6 text-center text-sm text-text-secondary md:hidden', className)}>
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn('space-y-3 md:hidden', className)}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          className={cn(
            'w-full rounded-xl border border-border bg-surface p-4 text-left transition-colors',
            item.onClick && 'active:bg-maroon-light',
          )}
        >
          {variant === 'transaction' ? (
            <>
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-maroon">{item.title}</p>
                {item.badge && (
                  <Badge variant={item.badge.variant} className="max-w-[45%] truncate">
                    {item.badge.label}
                  </Badge>
                )}
              </div>
              {item.subtitle && (
                <p className="mt-1 text-sm text-text-secondary">{item.subtitle}</p>
              )}
              {(item.meta || item.amount) && (
                <div className="mt-2 flex items-end justify-between gap-3">
                  {item.meta && <p className="text-xs text-text-secondary">{item.meta}</p>}
                  {item.amount && (
                    <p className="shrink-0 text-sm font-semibold text-text-primary">{item.amount}</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-maroon">{item.title}</p>
                    {item.badge && <Badge variant={item.badge.variant}>{item.badge.label}</Badge>}
                  </div>
                  {item.subtitle && (
                    <p className="mt-1 truncate text-sm text-text-secondary">{item.subtitle}</p>
                  )}
                </div>
                {item.onClick && <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-text-secondary" />}
              </div>

              {item.fields && item.fields.length > 0 && (
                <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                  {item.fields.map((field) => (
                    <div key={field.label}>
                      <dt className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                        {field.label}
                      </dt>
                      <dd className="mt-0.5 text-sm text-text-primary">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </>
          )}
        </button>
      ))}
    </div>
  )
}
