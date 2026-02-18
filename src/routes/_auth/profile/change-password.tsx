import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/profile/change-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/auth/change-password"!</div>;
}
