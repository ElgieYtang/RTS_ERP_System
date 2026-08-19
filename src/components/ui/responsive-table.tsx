import { MobileCardList, type MobileCardItem } from '@/components/ui/mobile-card-list'
import type { ReactNode } from 'react'

interface ResponsiveTableProps {
  desktop: ReactNode
  mobileItems: MobileCardItem[]
  emptyMessage?: string
}

export function ResponsiveTable({ desktop, mobileItems, emptyMessage }: ResponsiveTableProps) {
  return (
    <>
      <div className="hidden md:block">{desktop}</div>
      <MobileCardList items={mobileItems} emptyMessage={emptyMessage} />
    </>
  )
}
