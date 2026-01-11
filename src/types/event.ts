import { useForm } from "@tanstack/react-form";

export type TimePeriodEnum = "Morning" | "Afternoon";

export type EventTypeEnum = "Online" | "Hybrid" | "Offline";

export interface EventType {
  eventId: number;
  eventName: string;
  eventType: EventTypeEnum;
  meetingDate: string;
  registrationTime: string;
  startTime: string;
  endTime: string;
  period: TimePeriodEnum;
  latitude: number;
  longitude: number;
  note: string;
  documentUrl: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function useFormTypeHelper() {
  return useForm({
    defaultValues: {} as EventType,
  });
}

export type EventTypeSchema = ReturnType<typeof useFormTypeHelper>;
