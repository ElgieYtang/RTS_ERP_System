import { navigation } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SidebarNavItem } from './SidebarNavItem'

function InventoryGroup({
  open,
  onToggle,
}: {
  open: boolean
  onToggle: () => void
}) {
  const group = navigation.find((s) => s.heading === 'TRANSACTIONS')?.groups?.[0]
  if (!group) return null

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
          'text-white/85 hover:bg-maroon-dark hover:text-white',
        )}
      >
        {group.icon && <group.icon className="h-4 w-4 shrink-0" />}
        <span className="flex-1">{group.label}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 opacity-70" />
        ) : (
          <ChevronDown className="h-4 w-4 opacity-70" />
        )}
      </button>

      {open && (
        <div className="mt-0.5 space-y-0.5">
          {group.children.map((child) => (
            <SidebarNavItem
              key={child.path}
              to={child.path}
              label={child.label}
              indent
              end={child.path === '/inventory'}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const location = useLocation()
  const inventoryPaths = ['/inventory', '/inventory/receiving', '/inventory/outslips']
  const isInventoryActive = inventoryPaths.some((p) => location.pathname.startsWith(p))
  const [inventoryOpen, setInventoryOpen] = useState(isInventoryActive)

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[250px] flex-col bg-maroon">
      <div className="px-5 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-xs font-bold text-white">
            RC
          </div>
          <div>
            <div className="text-sm font-bold tracking-wide text-white">RESPONSIVCODE</div>
            <div className="text-xs text-white/70">ERP</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {navigation.map((section, sectionIndex) => (
          <div key={sectionIndex} className={cn(sectionIndex > 0 && 'mt-4')}>
            {section.heading && (
              <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/55">
                {section.heading}
              </div>
            )}

            <div className="space-y-0.5">
              {section.heading === 'TRANSACTIONS' ? (
                <>
                  {section.items.slice(0, 2).map((item) => (
                    <SidebarNavItem
                      key={item.path}
                      to={item.path}
                      label={item.label}
                      icon={item.icon}
                    />
                  ))}
                  <InventoryGroup
                    open={inventoryOpen}
                    onToggle={() => setInventoryOpen(!inventoryOpen)}
                  />
                  {section.items.slice(2).map((item) => (
                    <SidebarNavItem
                      key={item.path}
                      to={item.path}
                      label={item.label}
                      icon={item.icon}
                    />
                  ))}
                </>
              ) : (
                section.items.map((item) => (
                  <SidebarNavItem
                    key={item.path}
                    to={item.path}
                    label={item.label}
                    icon={item.icon}
                    end={item.path === '/'}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
