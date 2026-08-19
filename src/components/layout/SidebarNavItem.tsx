import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface SidebarNavItemProps {
  to: string
  label: string
  icon?: LucideIcon
  indent?: boolean
  end?: boolean
  onNavigate?: () => void
}

export function SidebarNavItem({
  to,
  label,
  icon: Icon,
  indent = false,
  end = false,
  onNavigate,
}: SidebarNavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
          indent && !Icon && 'ml-2',
          isActive
            ? 'bg-sidebar-active text-white shadow-sm'
            : 'text-white/90 hover:bg-sidebar-hover hover:text-white',
        )
      }
    >
      {Icon ? (
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
            'bg-white/10',
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
        </span>
      ) : (
        <span className="h-2 w-2 shrink-0 rounded-full bg-white/50" />
      )}
      <span>{label}</span>
    </NavLink>
  )
}
