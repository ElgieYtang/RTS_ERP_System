import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface MobileDrawerNavItemProps {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  onNavigate?: () => void
}

export function MobileDrawerNavItem({
  to,
  label,
  icon: Icon,
  end = false,
  onNavigate,
}: MobileDrawerNavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
          isActive
            ? 'bg-maroon-light text-maroon'
            : 'text-text-primary hover:bg-page',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-maroon" />
          )}
          <span
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
              isActive ? 'bg-maroon/10 text-maroon' : 'bg-page text-text-secondary',
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  )
}
