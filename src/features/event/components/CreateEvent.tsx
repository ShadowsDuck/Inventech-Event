import { useNavigate } from "@tanstack/react-router";

import { useCreateEvent } from "../api/createEvent";
import EventForm from "./event-form";

export default function CreateEvent() {
  const navigate = useNavigate();

  const { mutate, isPending } = useCreateEvent();

  // รับค่า FormData ที่ถูกปั้นมาจาก EventForm เรียบร้อยแล้ว
  const handleCreateSubmit = (formData: any) => {
    mutate(formData, {
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
