import { mobileDrawerItems, mobileDrawerSectionLabels } from '@/config/mobileNavigation'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { MobileDrawerNavItem } from './MobileDrawerNavItem'
import { SidebarNavItem } from './SidebarNavItem'
import { navigation } from '@/config/navigation'

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onMobileClose}
          aria-label="Close menu"
        />
      )}

      {/* Mobile drawer — white panel, ~78% width */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-[78%] max-w-[304px] flex-col bg-surface shadow-xl transition-transform duration-250 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="border-b border-border px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src="/logo.png"
                alt="ResponsivCode"
                className="h-10 w-10 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-text-primary">ResponsivCode</div>
                <div className="text-xs text-text-secondary">Transactions</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onMobileClose}
              className="shrink-0 rounded-md p-2 text-text-secondary hover:bg-page"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {mobileDrawerItems.map((item, index) => {
            const prevSection = mobileDrawerItems[index - 1]?.section
            const showHeading =
              item.section !== 'main' && item.section !== prevSection

            return (
              <div key={item.path}>
                {showHeading && item.section !== 'main' && (
                  <div className="mb-2 mt-4 px-3 text-[10px] font-semibold uppercase tracking-wider text-text-secondary first:mt-1">
                    {mobileDrawerSectionLabels[item.section]}
                  </div>
                )}
                <MobileDrawerNavItem
                  to={item.path}
                  label={item.label}
                  icon={item.icon}
                  end={item.end}
                  onNavigate={onMobileClose}
                />
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Desktop sidebar — maroon */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[250px] flex-col bg-sidebar md:flex">
        <div className="flex items-center gap-3 px-5 py-6">
          <img
            src="/logo.png"
            alt="ResponsivCode"
            className="h-10 w-10 shrink-0 object-contain bg-transparent mix-blend-lighten"
          />
          <div>
            <div className="text-sm font-bold tracking-wide text-white">RESPONSIVCODE</div>
            <div className="text-xs text-white/80">ERP System</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {navigation.map((section, sectionIndex) => (
            <div key={sectionIndex} className={cn(sectionIndex > 0 && 'mt-4')}>
              {section.heading && (
                <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                  {section.heading}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarNavItem
                    key={item.path}
                    to={item.path}
                    label={item.label}
                    icon={item.icon}
                    indent={item.indent}
                    end={item.path === '/'}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
