import { PageHeader } from '@/components/layout/PageHeader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState, TableFilters } from '@/components/ui/table-filters'
import { useDemo } from '@/context/DemoContext'
import { useMemo, useState } from 'react'

export function SuppliersPage() {
  const { state } = useDemo()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return state.suppliers
    return state.suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q),
    )
  }, [state.suppliers, search])

  return (
    <div>
      <PageHeader title="Suppliers" description="Manage supplier master data." />
      <TableFilters search={search} onSearchChange={setSearch} searchPlaceholder="Search suppliers..." />
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Supplier</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4}><EmptyState /></TableCell>
            </TableRow>
          ) : (
            filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.contactPerson}</TableCell>
                <TableCell>{s.phone}</TableCell>
                <TableCell>{s.email}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
