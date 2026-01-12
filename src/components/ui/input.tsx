import * as React from "react";

import { Input as InputPrimitive } from "@base-ui/react/input";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: LucideIcon;
}

function Input({
  className,
  type,
  startIcon: StartIcon,
  ...props
}: InputProps) {
  const baseClasses =
    "dark:bg-input/30 border-input aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 file:text-foreground placeholder:text-muted-foreground/80 focus-visible:border-primary focus-visible:ring-primary/20 h-10 w-full min-w-0 rounded-xl border bg-white px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-[3px] md:text-sm";

  // ถ้ามี Icon ให้หุ้มด้วย div.relative
  if (StartIcon) {
    return (
      <div className="relative w-full">
        <StartIcon className="text-muted-foreground/80 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 select-none" />
        <InputPrimitive
          type={type}
          data-slot="input"
          className={cn(baseClasses, "pl-9", className)}
          {...props}
        />
      </div>
    );
  }

  // ถ้าไม่มี Icon ก็ render แบบปกติ
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(baseClasses, className)}
      {...props}
    />
  );
}

export { Input };
