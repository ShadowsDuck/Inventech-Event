'use client'

import { useState, useId } from 'react'
import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

// กำหนด Props ให้รับ columns และ data เข้ามา
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const id = useId()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination
    }
  })

  return (
    <div className='space-y-4 md:w-full'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className='hover:bg-transparent'>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} style={{ width: `${header.getSize()}px` }} className='h-11'>
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              'flex h-full cursor-pointer items-center justify-between gap-2 select-none'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={e => {
                            if (header.column.getCanSort() && (e.key === 'Enter' || e.key === ' ')) {
                              e.preventDefault()
                              header.column.getToggleSortingHandler()?.(e)
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <ChevronUpIcon className='shrink-0 opacity-60' size={16} aria-hidden='true' />,
                            desc: <ChevronDownIcon className='shrink-0 opacity-60' size={16} aria-hidden='true' />
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Control Section */}
      <div className='flex items-center justify-between gap-8'>
        <div className='flex items-center gap-3'>
          <Label htmlFor={id} className='max-sm:sr-only'>Rows per page</Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={value => table.setPageSize(Number(value))}
          >
            <SelectTrigger id={id} className='w-fit whitespace-nowrap'>
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50].map(pageSize => (
                <SelectItem key={pageSize} value={pageSize.toString()}>{pageSize}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='text-muted-foreground flex grow justify-end text-sm whitespace-nowrap'>
          <p className='text-muted-foreground text-sm whitespace-nowrap'>
            <span className='text-foreground'>
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{' '}
            of <span className='text-foreground'>{table.getRowCount().toString()}</span>
          </p>
        </div>

        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button size='icon' variant='outline' onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
                  <ChevronFirstIcon aria-hidden='true' />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button size='icon' variant='outline' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                  <ChevronLeftIcon aria-hidden='true' />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button size='icon' variant='outline' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  <ChevronRightIcon aria-hidden='true' />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button size='icon' variant='outline' onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
                  <ChevronLastIcon aria-hidden='true' />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}