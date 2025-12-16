import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  countLabel?: string;
  showStatusDot?: boolean;
  actions?: ReactNode;
  description?: string;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  count,
  countLabel,
  showStatusDot = true,
  actions,
  description,
  className,
}: PageHeaderProps) {
  const showCount = typeof count === "number" && countLabel;

  return (
    // กรอบสี่เหลี่ยมเต็มความกว้าง แต่ไม่ขยับตำแหน่ง
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white min-h-22",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>

        {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}

        {showCount && (
          <p className="mt-0.5 flex items-center gap-2 text-sm text-gray-500">
            {showStatusDot && (
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            )}
            {count} {countLabel}
          </p>
        )}

        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export default PageHeader;
