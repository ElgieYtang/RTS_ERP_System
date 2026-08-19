import { ToastContainer } from '@/components/ui/toast'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

const mobileTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/quotations': 'Quotations',
  '/purchase-order': 'Purchase Orders',
  '/outslip': 'Outslip',
  '/delivery-receipt': 'Delivery Receipt',
  '/settings': 'Settings',
}

function getMobileTitle(pathname: string) {
  if (mobileTitles[pathname]) return mobileTitles[pathname]
  if (pathname.startsWith('/quotations/')) return 'Quotation'
  if (pathname.startsWith('/purchase-order/')) return 'Purchase Order'
  if (pathname.startsWith('/outslip/')) return 'Outslip'
  if (pathname.startsWith('/delivery-receipt/')) return 'Delivery Receipt'
  return 'ResponsivCode ERP'
}

export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const location = useLocation()
  const isDetailRoute = /\/(quotations|purchase-order|outslip|delivery-receipt)\/[^/]+$/.test(location.pathname)
    && !location.pathname.endsWith('/preview')

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-page">
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />
      <div className="flex min-h-screen flex-col md:ml-[250px]">
        {!isDetailRoute && (
          <Header
            onMenuClick={() => setMobileNavOpen(true)}
            title={getMobileTitle(location.pathname)}
          />
        )}
        <main className={cnMain(isDetailRoute)}>
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

function cnMain(isDetailRoute: boolean) {
  if (isDetailRoute) {
    return 'flex-1 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-6'
  }
  return 'flex-1 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-6 md:pb-6'
}
