import { useAuth } from '@/context/AuthContext'
import { Bell, LogOut, Menu, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  onMenuClick?: () => void
  title?: string
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initial = user?.name?.charAt(0).toUpperCase() ?? 'A'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface/95 px-4 shadow-sm backdrop-blur-md md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-maroon-light text-maroon transition-colors hover:bg-maroon hover:text-white md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 md:hidden">
          <img src="/logo.png" alt="" className="h-8 w-8 shrink-0 object-contain" aria-hidden />
          <span className="truncate text-sm font-semibold text-text-primary">ResponsivCode</span>
        </div>

        {title && (
          <h1 className="hidden truncate text-base font-semibold text-text-primary md:block">{title}</h1>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1 md:gap-2">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-maroon-light hover:text-maroon md:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-maroon-light hover:text-maroon"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-orange" />
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-maroon-light md:px-3"
          title="Sign out"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-maroon text-xs font-semibold text-white">
            {initial}
          </div>
          <span className="hidden sm:inline">{user?.name ?? 'Admin'}</span>
          <LogOut className="hidden h-4 w-4 text-text-secondary sm:block" />
        </button>
      </div>
    </header>
  )
}
