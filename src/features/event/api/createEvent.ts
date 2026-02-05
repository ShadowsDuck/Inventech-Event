import { useMutation } from "@tanstack/react-query";

import type { EventType } from "@/types/event";

const API_URL = import.meta.env.VITE_API_URL;

const createEvent = async (formData: FormData): Promise<EventType> => {
  const res = await fetch(`${API_URL}/api/events`, {
    method: "POST",

    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));

    throw new Error(
      (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to create event",
    );
  }

  return res.json();
};

export const useCreateEvent = () =>
  useMutation({
    mutationFn: createEvent,
    meta: {
      invalidatesQuery: ["events", "list"],
      successMessage: "Created event successfully",
      errorMessage: "Failed to create event",
    },
  });
