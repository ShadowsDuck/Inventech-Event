import { useNavigate } from "@tanstack/react-router";

import { useCreateEvent } from "../../api/createEvent";
import EventForm from "../event-form";
import { type EventData } from "../event-schema";

export default function CreateEvent() {
  const navigate = useNavigate();

  const { mutate, isPending } = useCreateEvent();

  const handleCreateSubmit = (values: EventData) => {
    const [latStr, lngStr] = values.location?.split(",") || [];
    const latitude = latStr ? parseFloat(latStr.trim()) : null;
    const longitude = lngStr ? parseFloat(lngStr.trim()) : null;

    const payload = {
      ...values,
      latitude,
      longitude,
      location: undefined,
    };

    mutate(payload, {
      onSuccess: () => {
        navigate({ to: "..", replace: true });
      },
    });
  };

  return (
    <EventForm
      mode="create"
      isPending={isPending}
      onSubmit={handleCreateSubmit}
    />
  );
}
