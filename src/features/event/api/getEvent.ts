import { queryOptions } from "@tanstack/react-query";

import type { EventType } from "@/types/event";

const API_URL = import.meta.env.VITE_API_URL;
const getEvents = async (): Promise<EventType[]> => {
  const res = await fetch(`${API_URL}/api/events`);
  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }
  return res.json();
};
export const eventsQuery = () =>
  queryOptions({
    queryKey: ["events", "list"],
    queryFn: () => getEvents(),
  });
