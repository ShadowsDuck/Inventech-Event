import { Button } from "@/components/ui/button";

interface ResetFormButtonProps {
  onClick: () => void;
}

export function ResetFormButton({ onClick }: ResetFormButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onClick} className="px-3">
      <p>Reset</p>
    </Button>
  );
}
