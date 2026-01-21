import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CreateFormButtonProps {
  saveLabel: string;
  loadingLabel: string;
  form: string;
  isPending: boolean;
}

export function CreateFormButton({
  saveLabel,
  loadingLabel,
  form,
  isPending,
}: CreateFormButtonProps) {
  return (
    <Button
      size="add"
      type="submit"
      form={form}
      variant="default"
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <Save size={18} strokeWidth={2.5} className="mr-0.5" />
      )}
      <p>{isPending ? loadingLabel : saveLabel}</p>
    </Button>
  );
}
