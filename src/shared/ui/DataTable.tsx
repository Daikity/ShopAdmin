import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'

/** Минимальная таблица: layout + empty. Без 200 props. */
export function DataTable({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-surface shadow-panel">
      <table
        className={cn('w-full border-collapse text-left text-body', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

export function THead({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('bg-surface-muted', className)} {...props}>
      {children}
    </thead>
  )
}

export function TBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('bg-surface', className)} {...props}>
      {children}
    </tbody>
  )
}

export function TR({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn('border-b border-border last:border-b-0', className)}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TH({
  className,
  children,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'px-3 py-2.5 text-caption font-medium text-text-secondary',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  )
}

export function TD({
  className,
  children,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-3 py-2.5 text-text-primary', className)} {...props}>
      {children}
    </td>
  )
}

export function TableEmpty({
  children,
  colSpan,
}: {
  children: ReactNode
  colSpan: number
}) {
  return (
    <TR>
      <TD colSpan={colSpan} className="py-10 text-center text-text-secondary">
        {children}
      </TD>
    </TR>
  )
}
