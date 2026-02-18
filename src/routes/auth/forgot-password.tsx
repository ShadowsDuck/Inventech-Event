import { createFileRoute } from "@tanstack/react-router";

import ForgotPass from "@/features/login/components/pages/forgot-pass";

export const Route = createFileRoute("/auth/forgot-password")({
  validateSearch: (search: Record<string, unknown>) => {
    return {};
  },
  component: ForgotPass,
});
