import {
  type ErrorComponentProps,
  Link,
  useRouter,
} from "@tanstack/react-router";
import axios from "axios";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { NotFound } from "./NotFound";

export function GlobalError({ error }: ErrorComponentProps) {
  const router = useRouter();

  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  const is404 =
    errorMessage.includes("404") ||
    (axios.isAxiosError(error) && error.response?.status === 404);

  if (is404) {
    return <NotFound />;
  }

  // ถ้าเป็น Error อื่นๆ (เช่น 500, แอปพังจริง) ให้โชว์หน้าแดงๆ ตามปกติ
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="bg-destructive/10 rounded-full p-6">
        <AlertTriangle className="text-destructive h-12 w-12" />
      </div>
      <h1 className="text-2xl font-bold">Something went wrong!</h1>
      <p className="text-muted-foreground max-w-md">{errorMessage}</p>

      <div className="mt-4 flex gap-4">
        <Button onClick={() => router.history.back()} variant="outline">
          <Link to="/">Return</Link>
        </Button>
      </div>
    </div>
  );
}
