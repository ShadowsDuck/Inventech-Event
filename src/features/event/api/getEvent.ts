import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { EventParams } from "@/routes/_auth/_sidebarLayout/event";
import type { EventType } from "@/types/event";

const getEvents = async (params?: EventParams): Promise<EventType[]> => {
  const { data } = await api.get<EventType[]>("/api/events", {
    params: params,
  });

  return data;
};

export const eventsQuery = (params?: EventParams) =>
  queryOptions({
    queryKey: ["events", "list", params],
    queryFn: () => getEvents(params),
  });
