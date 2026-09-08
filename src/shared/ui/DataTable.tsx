import type {
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react'
import { cn } from '@/shared/lib'

type DataTableProps = HTMLAttributes<HTMLTableElement> & {
  /** Включает card-stack на мобильных через data-label у TD. */
  responsiveCards?: boolean
}

/** Минимальная таблица: layout + empty + опциональный mobile card stack. */
export function DataTable({
  className,
  children,
  responsiveCards = true,
  ...props
}: DataTableProps) {
  return (
    <div
      className={cn(
        'w-full rounded-lg border border-border bg-surface shadow-panel',
        responsiveCards ? 'overflow-visible' : 'overflow-x-auto',
      )}
    >
      <table
        className={cn(
          'w-full border-collapse text-left text-body',
          responsiveCards &&
            'max-md:block max-md:[&_thead]:sr-only max-md:[&_tbody]:block max-md:[&_tr]:mb-3 max-md:[&_tr]:block max-md:[&_tr]:rounded-lg max-md:[&_tr]:border max-md:[&_tr]:border-border max-md:[&_tr]:bg-surface max-md:[&_tr]:p-3 max-md:[&_tr]:last:mb-0 max-md:[&_td]:flex max-md:[&_td]:items-start max-md:[&_td]:justify-between max-md:[&_td]:gap-3 max-md:[&_td]:border-0 max-md:[&_td]:px-0 max-md:[&_td]:py-1.5 max-md:[&_td]:before:content-[attr(data-label)] max-md:[&_td]:before:shrink-0 max-md:[&_td]:before:text-caption max-md:[&_td]:before:font-medium max-md:[&_td]:before:text-text-secondary',
          className,
        )}
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
      scope="col"
      {...props}
    >
      {children}
    </th>
  )
}

type TDProps = TdHTMLAttributes<HTMLTableCellElement> & {
  /** Подпись колонки для mobile card stack. */
  label?: string
}

export function TD({ className, children, label, ...props }: TDProps) {
  return (
    <td
      className={cn('px-3 py-2.5 text-text-primary', className)}
      data-label={label}
      {...props}
    >
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
    <TR className="max-md:border-0 max-md:p-0">
      <TD
        colSpan={colSpan}
        className="py-10 text-center text-text-secondary max-md:block max-md:w-full max-md:justify-center max-md:before:content-none"
      >
        {children}
      </TD>
    </TR>
  )
}
