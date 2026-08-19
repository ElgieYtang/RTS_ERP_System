import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MoreHorizontal } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

interface ActionMenuItem {
  label: string
  onClick: () => void
  destructive?: boolean
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  className?: string
}

export function ActionMenu({ items, className }: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="px-2"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded-md border border-border bg-surface py-1 shadow-lg">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onClick()
                setOpen(false)
              }}
              className={cn(
                'block w-full px-3 py-2 text-left text-sm hover:bg-maroon-light',
                item.destructive ? 'text-[#DC2626]' : 'text-text-primary',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function TableActions({
  onView,
  menuItems,
}: {
  onView?: () => void
  menuItems: ActionMenuItem[]
}) {
  return (
    <div className="flex items-center gap-1 no-print">
      {onView && (
        <Button variant="ghost" size="sm" onClick={onView}>View</Button>
      )}
      <ActionMenu items={menuItems} />
    </div>
  )
}

export function LoadingButton({
  loading,
  children,
  onClick,
  variant = 'primary',
}: {
  loading?: boolean
  children: ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
}) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? 'Loading...' : children}
    </Button>
  )
}
