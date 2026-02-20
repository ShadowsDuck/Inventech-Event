import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/mobile/$eventId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/mobile/event-detail"!</div>;
}
