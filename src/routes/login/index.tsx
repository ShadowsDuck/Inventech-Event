import { createFileRoute } from "@tanstack/react-router";

import Login from "@/features/login/components/Login";

export const Route = createFileRoute("/login/")({
  component: Login,
});
