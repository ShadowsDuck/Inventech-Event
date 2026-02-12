import { Check, CircleCheck, Package as PackageIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { PackageType } from "@/types/package";

import { PackageAction } from "./package-action";

interface CarouselPackageProps {
  packages: PackageType[];
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  canEdit?: boolean;
  itemBasis?: string;
}
export default function CarouselPackage({
  packages,
  value,
  onChange,
  readOnly = false,
  disabled = false,
  canEdit = true,
  itemBasis = "basis-1/3",
  className,
}: CarouselPackageProps) {
  return (
    <div className="flex w-full justify-center transition-opacity duration-300">
      <Carousel
        opts={{
          align: "start",
          loop: false,
          slidesToScroll: 3,
          duration: 20,
        }}
        className="w-full"
      >
        <CarouselContent className={cn("-ml-4", className)}>
          {packages.map((pkg) => {
            const id = String(pkg.packageId);
            const isSelected = value === id;
            const isInteractive = !readOnly && !disabled;

            return (
              <CarouselItem key={id} className={cn("pl-4", itemBasis)}>
                <div className="h-full p-1">
                  <Card
                    onClick={() => isInteractive && onChange?.(id)}
                    className={cn(
                      "flex h-full flex-col transition-all duration-200",
                      isSelected
                        ? "z-10 border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600"
                        : "border-gray-200",
                      isInteractive
                        ? "cursor-pointer hover:border-blue-300 hover:shadow-md"
                        : "cursor-default",
                      disabled && "pointer-events-none opacity-50 grayscale",
                    )}
                  >
                    <div className="px-6 py-4">
                      <div className="mb-4 flex items-start justify-between">
                        <div
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-blue-50 text-blue-600",
                          )}
                        >
                          <PackageIcon className="h-6 w-6" />
                        </div>

                        <div className="flex items-center gap-2">
                          {isSelected && !readOnly && (
                            <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                              Selected <CircleCheck size={14} />
                            </span>
                          )}
                          {canEdit && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="relative z-20"
                            >
                              <PackageAction packages={pkg} />
                            </div>
                          )}
                        </div>
                      </div>

                      <h3
                        className={cn(
                          "mb-2 text-lg font-bold transition-colors",
                          isSelected ? "text-blue-700" : "text-gray-900",
                        )}
                      >
                        {pkg.packageName}
                      </h3>

                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                          isSelected
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600",
                        )}
                      >
                        {pkg.equipmentSets?.length ?? 0} items
                      </span>
                    </div>

                    <div className="px-6">
                      <div className="mb-4 flex items-center gap-4">
                        <p className="text-xs font-bold tracking-wider whitespace-nowrap text-gray-400 uppercase">
                          Included Equipment
                        </p>
                        <div className="h-px flex-1 bg-gray-200" />
                      </div>
                    </div>

                    <CardContent className="flex-1 px-6 pt-0 pb-6">
                      {!pkg.equipmentSets?.length ? (
                        <p className="text-sm text-gray-500">
                          No equipment found.
                        </p>
                      ) : (
                        <ul className="space-y-3">
                          {pkg.equipmentSets.map((es) => (
                            <li
                              key={es.equipmentId}
                              className="flex items-start gap-3"
                            >
                              <Check
                                className={cn(
                                  "mt-0.5 h-4 w-4 shrink-0 transition-colors",
                                  isSelected
                                    ? "text-blue-600"
                                    : "text-green-500",
                                )}
                              />
                              <span className="text-sm leading-tight text-gray-600">
                                <span className="mr-1 font-bold text-gray-600">
                                  {es.quantity || 1}x
                                </span>
                                {es.equipmentName || "Unknown Equipment"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="-left-4 h-10 w-10 shadow-sm disabled:hidden [&_svg]:size-6" />
        <CarouselNext className="-right-4 h-10 w-10 shadow-sm disabled:hidden [&_svg]:size-6" />
      </Carousel>
    </div>
  );
}
