import { createFileRoute } from "@tanstack/react-router";

import setPassword from "@/features/login/components/pages/Set-Password";

export const Route = createFileRoute("/auth/set-password")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || "",
    };
  },
  component: setPassword,
});
