import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

// 1. import axios

import type { EventType } from "@/types/event";

const API_URL = import.meta.env.VITE_API_URL;

const getEvents = async (): Promise<EventType[]> => {
  const { data } = await axios.get<EventType[]>(`${API_URL}/api/events`);

  return data; // 3. ข้อมูลจะอยู่ใน property data พร้อมใช้งานทันที
};

export const eventsQuery = () =>
  queryOptions({
    queryKey: ["events", "list"],
    queryFn: () => getEvents(),
  });
