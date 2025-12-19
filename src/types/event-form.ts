import { useForm } from "@tanstack/react-form";

export interface EventFormSchema {
  event_name: string;
  company: string;
  event_type: string;
  note: string;
  date: Date | undefined;
  start_time: string;
  end_time: string;
  time_period: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  package: string;
  files: File[];
}

export function useFormTypeHelper() {
  return useForm({
    defaultValues: {} as EventFormSchema,
  });
}

export type EventFormApi = ReturnType<typeof useFormTypeHelper>;
