import { Check, CircleCheck, Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// 1. เพิ่ม id ให้กับข้อมูลเพื่อใช้เป็น value
const packages = [
  {
    id: "premium-event",
    title: "Premium Event Package",
    itemsCount: 7,
    features: [
      "4x Wireless Microphones",
      "2x HD Projectors (4K Ready)",
      "2x MacBook Pro Laptops",
      "1x Professional Sound System",
      "1x LED Screen 3x2m",
      "8x Staff Members (Uniformed)",
      "1x Full Technical Support",
    ],
  },
  {
    id: "standard-conf",
    title: "Standard Conference",
    itemsCount: 5,
    features: [
      "2x Wireless Microphones",
      "1x HD Projector",
      "2x Laptops",
      "1x LED Screen 3x2m",
      "4x Staff Members",
    ],
  },
  {
    id: "basic-meeting",
    title: "Basic Meeting Setup",
    itemsCount: 4,
    features: [
      "1x Microphone",
      "1x Projector Screen",
      "1x Laptop",
      "2x Staff Members",
    ],
  },
  {
    id: "minimal-kit",
    title: "Minimal Kit",
    itemsCount: 2,
    features: ["1x Projector", "1x Whiteboard"],
  },
  {
    id: "sound-only",
    title: "Sound Only",
    itemsCount: 3,
    features: ["2x Speakers", "1x Mixer", "1x Mic"],
  },
];

// 2. กำหนด Type ของ Props
interface CarouselPackageProps {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export default function CarouselPackage({
  value,
  onChange,
  readOnly = false,
}: CarouselPackageProps) {
  return (
    <div className="flex w-full justify-center">
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
            // 3. เช็คสถานะว่า Card นี้ถูกเลือกอยู่หรือไม่
            const isSelected = value === pkg.id;

            return (
              <CarouselItem key={pkg.id} className="basis-1/3 pl-4">
                <div className="h-full p-1">
                  <Card
                    // 4. เพิ่ม onClick เพื่อส่งค่า id กลับไป
                    onClick={() => !readOnly && onChange?.(pkg.id)}
                    className={cn(
                      "flex h-full flex-col transition-all duration-200",
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-md",
                      !readOnly && "cursor-pointer",
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
                          <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 transition-colors">
                            Selected <CircleCheck size={14} />
                          </span>
                        )}
                      </div>

                      <h3
                        className={cn(
                          "mb-2 text-lg font-bold transition-colors",
                          isSelected ? "text-blue-700" : "text-gray-900",
                        )}
                      >
                        {pkg.title}
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
                        {pkg.itemsCount} items
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
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check
                              className={cn(
                                "mt-0.5 h-4 w-4 shrink-0 transition-colors",
                                isSelected ? "text-blue-600" : "text-green-500",
                              )}
                            />
                            <span className="text-sm leading-tight text-gray-600">
                              {feature}
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
