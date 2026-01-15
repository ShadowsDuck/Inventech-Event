import type { ReactNode } from "react";

import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  countLabel?: string;
  showStatusDot?: boolean;
  actions?: ReactNode;
  description?: string;
  className?: string;
  backButton?: boolean;
  showStatusBadge?: boolean;
  isDeleted?: boolean;
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
  backButton = false,
  showStatusBadge = false,
  isDeleted = false,
}: PageHeaderProps) {
  const navigate = useRouter();

  const showCount = typeof count === "number" && countLabel;

  return (
    // กรอบสี่เหลี่ยมเต็มความกว้าง แต่ไม่ขยับตำแหน่ง
    <div
      className={cn(
        "flex min-h-22 items-center justify-between border-b border-gray-200 bg-white px-6 py-4",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {backButton && (
          <button
            onClick={() => navigate.history.back()}
            className="hover:bg-muted-foreground/7 rounded-full bg-white p-2 duration-150"
          >
            <ChevronLeft color="gray" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>

            {showStatusBadge &&
              (isDeleted ? (
                <Badge variant="unsuccess">
                  <span
                    className="bg-secondary-foreground/30 mr-0.5 size-1.25 rounded-full"
                    aria-hidden="true"
                  />
                  Inactive
                </Badge>
              ) : (
                <Badge variant="success">
                  <span
                    className="mr-0.5 size-1.25 rounded-full bg-green-600/60"
                    aria-hidden="true"
                  />
                  Active
                </Badge>
              ))}
          </div>

          {subtitle && (
            <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
          )}

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
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export default PageHeader;
