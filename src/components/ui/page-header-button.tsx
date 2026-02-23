import { type LucideIcon, Plus } from "lucide-react";

import { Button } from "./button";

interface PageHeaderButtonProps {
  onClick: () => void;
  label: string;
  icon?: LucideIcon;
}

export default function PageHeaderButton({
  onClick,
  label,
  icon: Icon,
}: PageHeaderButtonProps) {
  return (
    <Button size="add" onClick={onClick} className="flex items-center gap-1.5">
      {Icon ? (
        <Icon size={18} strokeWidth={2.5} />
      ) : (
        <Plus size={18} strokeWidth={2.5} />
      )}
      {label}
    </Button>
  );
}
