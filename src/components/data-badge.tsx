import { Badge } from "@/components/ui/badge";
import { getBadgeStyle } from "@/lib/badge-styles";
import { cn } from "@/lib/utils";

interface DataBadgeProps {
  type: "role" | "category";
  value: string;
  showDot?: boolean;
}

export function DataBadge({ type, value, showDot = false }: DataBadgeProps) {
  const style = getBadgeStyle(type, value);

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-2 rounded-xl border px-2.5 py-0.5 font-medium",
        style.bg,
        style.text,
        style.border,
      )}
    >
      {showDot && style.dotColor && (
        <span className={cn("h-1.5 w-1.5 rounded-full", style.dotColor)} />
      )}

      {value}
    </Badge>
  );
}
