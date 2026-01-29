import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Menu } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { NAV_LINKS } from "@/data/constants";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

import { Badge } from "../ui/badge";

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

  const [isOpen, setIsOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (isDesktop && isOpen) {
      // ใช้ setTimeout เพื่อหลบ synchronous update warning
      const timer = setTimeout(() => setIsOpen(false), 0);
      return () => clearTimeout(timer);
    }
  }, [isDesktop, isOpen]);

  const showCount = typeof count === "number" && countLabel;

  return (
    <div
      className={cn(
        "flex min-h-22 items-center justify-between border-b border-gray-200 bg-white px-6 py-4",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="-ml-2 lg:hidden">
          <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
            <DrawerTrigger asChild>
              <button className="hover:bg-muted-foreground/10 rounded-full p-2 duration-150">
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            </DrawerTrigger>

            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle className="pt-3 text-center text-xl font-semibold">
                    Event Management
                  </DrawerTitle>
                  <DrawerDescription className="sr-only">
                    Navigation Menu
                  </DrawerDescription>
                </DrawerHeader>

                <div className="px-4 py-1">
                  <div className="flex flex-col gap-2">
                    {NAV_LINKS.map((item) => (
                      <DrawerClose asChild key={item.title}>
                        <Link
                          to={item.url}
                          className="text-muted-foreground hover:bg-muted hover:text-foreground/90 active:bg-muted flex items-center gap-4 rounded-xl px-4 py-3"
                          activeProps={{
                            className:
                              "bg-sidebar-primary/5 text-blue-600! font-medium",
                          }}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="text-base">{item.title}</span>
                        </Link>
                      </DrawerClose>
                    ))}
                  </div>
                </div>

                <DrawerFooter>
                  <DrawerClose asChild>
                    <button className="w-full rounded-lg border p-3 text-sm font-medium hover:bg-gray-50">
                      Close
                    </button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
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

      <div className="flex items-center gap-3">
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
