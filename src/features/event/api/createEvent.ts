import { useMutation } from "@tanstack/react-query";

import type { EventType } from "@/types/event";

const API_URL = import.meta.env.VITE_API_URL;

// รับ input เป็น FormData (เพราะเราปั้น new FormData() มาจากหน้า Form)
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
      // 4. อย่าลืมเปลี่ยน query key ที่ต้องการ Invalidate
      invalidatesQuery: ["events", "list"],
      successMessage: "Created event successfully",
      errorMessage: "Failed to create event",
    },
  });
