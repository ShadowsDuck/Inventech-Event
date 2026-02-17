import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { EventType } from "@/types/event";

const getEvents = async (): Promise<EventType[]> => {
  const { data } = await api.get<EventType[]>("/api/events");

  return data;
};

export const eventsQuery = () =>
  queryOptions({
    queryKey: ["events", "list"],
    queryFn: () => getEvents(),
  });
