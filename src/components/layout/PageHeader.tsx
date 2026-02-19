import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

import { Badge } from "../ui/badge";
import { SidebarTrigger } from "../ui/sidebar";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  count?: number;
  countLabel?: string;
  showStatusDot?: boolean;
  actions?: ReactNode;
  description?: string;
  className?: string;
  backButton?: boolean;
  showStatusBadge?: boolean;
  isDeleted?: boolean;
  tabs?: ReactNode;
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
  tabs,
}: PageHeaderProps) {
  const navigate = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (isDesktop && isOpen) {
      const timer = setTimeout(() => setIsOpen(false), 0);
      return () => clearTimeout(timer);
    }
  }, [isDesktop, isOpen]);

  const showCount = typeof count === "number" && countLabel;

  return (
    <div
      className={cn(
        "flex flex-col border-b border-gray-200 bg-white",
        className,
      )}
    >
      {/* ส่วนบน: Title และ Actions */}
      <div className="flex min-h-20 items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="-ml-2 block lg:hidden">
            <SidebarTrigger />
          </div>

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
              {showStatusBadge && (
                <Badge variant={isDeleted ? "unsuccess" : "success"}>
                  <span
                    className={cn(
                      "mr-0.5 size-1.25 rounded-full",
                      isDeleted
                        ? "bg-secondary-foreground/30"
                        : "bg-green-600/60",
                    )}
                  />
                  {isDeleted ? "Inactive" : "Active"}
                </Badge>
              )}
            </div>
            {subtitle && <div className="mt-0.5">{subtitle}</div>}
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

      {/* ส่วนล่าง: Tabs (ถ้ามี) */}
      {tabs && <div className="px-6">{tabs}</div>}
    </div>
  );
}

export default PageHeader;
