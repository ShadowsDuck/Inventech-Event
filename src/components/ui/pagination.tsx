import * as React from "react";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function Pagination({
  totalRows,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  totalRows: number;
  pageIndex: number; // 0-based
  pageSize: number;
  onPageChange: (index: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = clamp(pageIndex + 1, 1, pageCount);

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 border-t bg-white rounded-b-xl">
      <div className="text-sm text-slate-700">{totalRows} row(s) total.</div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <span>Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              if (!v) return; // ✅ กัน null
              const n = Number(v);
              if (Number.isNaN(n)) return;
              onPageSizeChange(n);
            }}
          >
            <SelectTrigger className="h-9 w-[76px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-slate-700">
          Page {currentPage} of {pageCount}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(0)}
            disabled={currentPage === 1}
            aria-label="First page"
          >
            <ChevronsLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={currentPage === pageCount}
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(pageCount - 1)}
            disabled={currentPage === pageCount}
            aria-label="Last page"
          >
            <ChevronsRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
