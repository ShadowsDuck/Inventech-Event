import { Check, CircleCheck, Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PACKAGE_DATA as packages } from "@/data/constants";
import { cn } from "@/lib/utils";

interface CarouselPackageProps {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
}

export default function CarouselPackage({
  value,
  onChange,
  readOnly = false,
  disabled = false,
}: CarouselPackageProps) {
  return (
    <div className="flex w-full justify-center transition-opacity duration-300">
      <Carousel
        opts={{
          align: "start",
          loop: false,
          slidesToScroll: 3,
          containScroll: false,
          duration: 20,
          watchDrag: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {packages.map((pkg) => {
            const isSelected = value === pkg.id;

            return (
              <CarouselItem key={pkg.id} className="basis-1/3 pl-4">
                <div className="h-full p-1">
                  <Card
                    onClick={() => !readOnly && !disabled && onChange?.(pkg.id)}
                    className={cn(
                      "flex h-full flex-col transition-all duration-200",

                      isSelected
                        ? "z-10 border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600"
                        : "border-gray-200",

                      !readOnly && !disabled
                        ? "cursor-pointer hover:border-blue-300 hover:shadow-md"
                        : "cursor-default",

                      disabled && !isSelected && "opacity-50 grayscale",

                      disabled && isSelected && "pointer-events-none",

                      disabled && "pointer-events-none",
                    )}
                  >
                    {/* ส่วนหัว Card */}
                    <div className="px-6 py-4">
                      <div className="mb-4 flex items-start justify-between">
                        {/* Icon สีฟ้า */}
                        <div
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-blue-50 text-blue-600",
                          )}
                        >
                          {isSelected ? (
                            <Package className="h-6 w-6" />
                          ) : (
                            <Package className="h-6 w-6" />
                          )}
                        </div>

                        {/* Badge Select */}
                        {isSelected && !readOnly && (
                          <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 transition-colors">
                            {disabled ? "Auto-" : ""}Selected
                            <CircleCheck size={14} />
                          </span>
                        )}
                      </div>

                      <h3
                        className={cn(
                          "mb-2 text-lg font-bold transition-colors",
                          isSelected ? "text-blue-700" : "text-gray-900",
                        )}
                      >
                        {pkg.name}
                      </h3>

                      {/* Badge items */}
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                          isSelected
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600",
                        )}
                      >
                        {pkg.items.length} items
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
                      <ul className="space-y-3">
                        {pkg.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check
                              className={cn(
                                "mt-0.5 h-4 w-4 shrink-0 transition-colors",
                                isSelected ? "text-blue-600" : "text-green-500",
                              )}
                            />
                            <span className="text-sm leading-tight text-gray-600">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
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
