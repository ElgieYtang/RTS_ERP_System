import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getStatusDisplay } from '@/lib/status'

interface Column {
  key: string
  label: string
}

interface SetupListPageProps {
  title: string
  description: string
  breadcrumbs: string[]
  actionLabel?: string
  columns: Column[]
  rows: Record<string, string>[]
  statusKey?: string
}

export function SetupListPage({
  title,
  description,
  breadcrumbs,
  actionLabel = '+ Add',
  columns,
  rows,
  statusKey = 'status',
}: SetupListPageProps) {
  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        action={<Button>{actionLabel}</Button>}
      />
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.key === statusKey && row[col.key] ? (
                    <Badge variant={getStatusDisplay(row[col.key]).variant}>
                      {row[col.key]}
                    </Badge>
                  ) : (
                    row[col.key]
                  )}
                </TableCell>
              ))}
              <TableCell>
                <Button variant="ghost" size="sm">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
