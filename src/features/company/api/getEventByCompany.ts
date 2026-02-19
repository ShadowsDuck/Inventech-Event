import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { EventType } from "@/types/event";

const getCompanyEvents = async (companyId: string): Promise<EventType[]> => {
  const { data } = await api.get<EventType[]>("/api/events", {
    params: {
      companyId: companyId,
    },
  });

  return data;
};

export const companyEventsQuery = (companyId: string) =>
  queryOptions({
    queryKey: ["events", "company", companyId],
    queryFn: () => getCompanyEvents(companyId),
  });
