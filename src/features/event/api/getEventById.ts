import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

import { api } from "@/lib/axios";
// 1. import axios

import type { EventType } from "@/types/event";

const API_URL = import.meta.env.VITE_API_URL;

const getEventById = async (id: string): Promise<EventType> => {
  // 2. ใช้ axios.get และระบุ Generic Type <EventType>
  const { data } = await api.get<EventType>(`${API_URL}/api/events/${id}`);

  return data;
};

export const eventQuery = (id: string) =>
  queryOptions({
    queryKey: ["events", "detail", id],
    queryFn: () => getEventById(id),
  });
