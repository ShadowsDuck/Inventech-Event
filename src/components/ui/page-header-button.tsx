import { Plus } from "lucide-react";

import { Button } from "./button";

interface PageHeaderButtonProps {
  onClick: () => void;
  label: string;
}

export default function PageHeaderButton({
  onClick,
  label,
}: PageHeaderButtonProps) {
  return (
    <Button size="add" onClick={onClick}>
      <Plus size={18} strokeWidth={2.5} />
      {label}
    </Button>
  );
}
