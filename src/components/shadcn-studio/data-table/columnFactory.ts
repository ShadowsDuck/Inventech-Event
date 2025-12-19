// import { type ColumnDef } from '@tanstack/react-table'
// import React from 'react'

// export type CellCtx<T> = { row: any; value: unknown; key: keyof T }

// export type ColumnConfig<T extends object> = {
//   header: React.ReactNode
//   accessorKey: keyof T
//   enableSorting?: boolean
//   size?: number
//   // ใส่ className ต่อคอลัมน์ได้ (ปรับหน้าตาแต่ละหน้าสะดวก)
//   headClassName?: string
//   cellClassName?: string

//   // custom render เฉพาะคอลัมน์นั้น
//   cell?: (ctx: CellCtx<T>) => React.ReactNode
// }

// export function createColumns<T extends object>(
//   configs: ColumnConfig<T>[],
//   options?: {
//     // fallback renderer ถ้าไม่ได้กำหนด cell
//     defaultCell?: (ctx: CellCtx<T>) => React.ReactNode
//   }
// ): ColumnDef<T>[] {
//   const defaultCell =
//     options?.defaultCell ??
//     (({ value }) => <div>{String(value ?? '')}</div>)

//   return configs.map(cfg => ({
//     header: cfg.header,
//     accessorKey: cfg.accessorKey as string,
//     enableSorting: cfg.enableSorting ?? true,
//     size: cfg.size,
//     meta: {
//       headClassName: cfg.headClassName,
//       cellClassName: cfg.cellClassName
//     },
//     cell: ({ row }) => {
//       const value = row.getValue(cfg.accessorKey as string)
//       const ctx = { row, value, key: cfg.accessorKey }
//       return cfg.cell ? cfg.cell(ctx) : defaultCell(ctx)
//     }
//   }))
// }
