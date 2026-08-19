import { cn } from '@/lib/utils'

export function Breadcrumbs({ items }: { items: string[] }) {
  return (
    <nav className="mb-1 text-xs text-text-secondary">
      {items.join(' / ')}
    </nav>
  )
}

export function StatusTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: Array<{ key: string; label: string; count?: number }>
  active: string
  onChange: (key: string) => void
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            active === tab.key
              ? 'bg-maroon text-white'
              : 'bg-surface border border-border text-text-secondary hover:border-maroon hover:text-maroon',
          )}
        >
          {tab.label}
          {tab.count !== undefined && ` ${tab.count}`}
        </button>
      ))}
    </div>
  )
}
