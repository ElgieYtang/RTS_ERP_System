import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface SidebarNavItemProps {
  to: string
  label: string
  icon?: LucideIcon
  indent?: boolean
  end?: boolean
}

export function SidebarNavItem({
  to,
  label,
  icon: Icon,
  indent = false,
  end = false,
}: SidebarNavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
          indent && 'ml-4',
          isActive
            ? 'mx-2 bg-maroon-light text-maroon font-semibold'
            : 'text-white/90 hover:bg-sidebar-hover hover:text-white',
        )
      }
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span>{label}</span>
    </NavLink>
  )
}
