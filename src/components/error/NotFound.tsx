import { Link } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
      <div className="bg-muted rounded-full p-6">
        <FileQuestion className="text-muted-foreground h-12 w-12" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <h2 className="text-xl font-semibold">Page Not Found</h2>
      <p className="text-muted-foreground max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button className="mt-4">
        <Link to="/event">Return</Link>
      </Button>
    </div>
  );
}
