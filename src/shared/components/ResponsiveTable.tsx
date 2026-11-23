import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export interface ResponsiveTableColumn<T> {
  /** Sentence-case heading. Uppercased on desktop, used as the card label on mobile. */
  header: string;
  cell: (row: T) => ReactNode;
  /** Rendered as the card title on mobile. Defaults to the first column. */
  primary?: boolean;
  /** Keep the heading out of mobile cards when the value speaks for itself. */
  hideLabelOnMobile?: boolean;
  /** Skip this column in mobile cards (desktop table keeps it). */
  mobileHidden?: boolean;
  className?: string;
}

interface ResponsiveTableProps<T> {
  items: T[];
  columns: ResponsiveTableColumn<T>[];
  rowKey: (row: T) => string | number;
  /** Appended as an action column on desktop and an action row on mobile. */
  actions?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  isRowSelected?: (row: T) => boolean;
  /** Accessible name for the desktop table. */
  ariaLabel: string;
  /** Desktop-only minimum table width, e.g. "960px". Never applied on mobile. */
  minWidth?: string;
}

/**
 * One dataset, two presentations: a compact table on md+ and stacked, labelled
 * cards on small screens. Mobile cards never scroll sideways and keep every
 * value visible; desktop keeps the dense tabular view QA staff expect.
 */
export function ResponsiveTable<T>({
  items,
  columns,
  rowKey,
  actions,
  onRowClick,
  isRowSelected,
  ariaLabel,
  minWidth,
}: ResponsiveTableProps<T>) {
  const primary = columns.find((column) => column.primary) ?? columns[0];
  const detailColumns = columns.filter(
    (column) => column !== primary && !column.mobileHidden,
  );

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-border bg-card shadow-sm md:block">
        <table
          aria-label={ariaLabel}
          className="w-full text-left"
          style={minWidth ? { minWidth } : undefined}>
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column.header}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    column.className,
                  )}>
                  {column.header}
                </th>
              ))}
              {actions ? (
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                aria-selected={
                  isRowSelected ? isRowSelected(row) : undefined
                }
                className={cn(
                  "border-b border-border last:border-0 transition-colors",
                  onRowClick && "cursor-pointer",
                  isRowSelected?.(row) && "bg-muted/60",
                  "hover:bg-muted/40",
                )}>
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className={cn("px-4 py-3 text-sm", column.className)}>
                    {column.cell(row)}
                  </td>
                ))}
                {actions ? (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {actions(row)}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden" aria-label={ariaLabel}>
        {items.map((row) => {
          const card = (
            <>
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold break-words text-foreground">
                  {primary?.cell(row)}
                </p>
              </div>
              <dl className="divide-y divide-border">
                {detailColumns.map((column) => (
                  <div
                    key={column.header}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-2.5">
                    {column.hideLabelOnMobile ? null : (
                      <dt className="text-xs text-muted-foreground">
                        {column.header}
                      </dt>
                    )}
                    <dd
                      className={cn(
                        "min-w-0 break-words text-sm text-foreground",
                        column.hideLabelOnMobile && "w-full",
                      )}>
                      {column.cell(row)}
                    </dd>
                  </div>
                ))}
              </dl>
              {actions ? (
                <div className="flex flex-wrap items-center gap-1 border-t border-border px-2 py-2 [&_button]:min-h-11 [&_button]:min-w-11">
                  {actions(row)}
                </div>
              ) : null}
            </>
          );

          return (
            <li
              key={rowKey(row)}
              className={cn(
                "overflow-hidden rounded-xl border border-border bg-card shadow-sm",
                isRowSelected?.(row) && "border-brand-accent bg-brand-accent/5",
              )}>
              {onRowClick ? (
                <button
                  type="button"
                  onClick={() => onRowClick(row)}
                  aria-pressed={isRowSelected ? isRowSelected(row) : undefined}
                  className="block w-full text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                  {card}
                </button>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
