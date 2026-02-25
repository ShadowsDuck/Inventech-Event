import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { EventType } from "@/types/event";

const API_URL = import.meta.env.VITE_API_URL;

const getEventById = async (id: string): Promise<EventType> => {
  const { data } = await api.get<EventType>(`${API_URL}/api/events/${id}`);

  return data;
};

export const eventQuery = (id: string) =>
  queryOptions({
    queryKey: ["events", "detail", id],
    queryFn: () => getEventById(id),
  });
