import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

interface TableFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  statusFilter?: string
  onStatusChange?: (value: string) => void
  statusOptions?: Array<{ value: string; label: string }>
  className?: string
}

export function TableFilters({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  statusFilter,
  onStatusChange,
  statusOptions,
  className,
}: TableFiltersProps) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-center gap-3 no-print', className)}>
      <div className="relative min-w-[200px] flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
      </div>
      {statusOptions && onStatusChange && (
        <select
          value={statusFilter ?? 'all'}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-9 rounded-md border border-border-input bg-surface px-3 text-sm text-text-primary focus:border-maroon focus:outline-none focus:ring-2 focus:ring-maroon-light"
        >
          <option value="all">All Status</option>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}
    </div>
  )
}

export function EmptyState({ message }: { message?: string }) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm font-medium text-text-primary">
        {message ?? 'No transactions found.'}
      </p>
      <p className="mt-1 text-sm text-text-secondary">
        Try adjusting your search or filters.
      </p>
    </div>
  )
}
