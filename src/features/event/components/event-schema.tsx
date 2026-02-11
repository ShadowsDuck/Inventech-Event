// event-schema.ts
import { z } from "zod";

const EquipmentEventSchema = z.object({
  equipmentId: z.number(),
  quantity: z.number().min(1),
});

const StaffSchema = z.object({
  staffId: z.number().or(z.string()),
  roleId: z.number().min(1, "Role is required"),
});

const OutsourceSchema = z.object({
  outsourceId: z.number().or(z.string()),
  roleId: z.number(),
});

const baseEventSchema = z.object({
  eventName: z.string().min(1, "Event name is required").max(255),
  note: z.string().optional(),
  companyId: z.number().min(1, "Please select a company"),
  packageId: z.number().optional().nullable(),
  eventType: z.number().min(1, "Please select an event type"),
  address: z.string().optional(),

  eventDate: z.date({
    error: (issue) => {
      if (issue.code === "invalid_type" && issue.input === undefined) {
        return "Event date is required";
      }
      return "Invalid date format";
    },
  }),
  registrationTime: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  timePeriod: z.number().min(1, "Please select a time period"),
  location: z.string().optional(),

  eventStaff: z.array(StaffSchema),
  eventOutsources: z.array(OutsourceSchema),
  eventExtraEquipments: z.array(EquipmentEventSchema),
  attachmentFiles: z.array(z.instanceof(File)),
});

// Export Type และ Function ออกไปใช้งาน
export type EventData = z.infer<typeof baseEventSchema>;

export const getEventSchema = (mode: "create" | "edit") => {
  return baseEventSchema.superRefine((data, ctx) => {
    if (data.registrationTime && data.startTime) {
      if (data.registrationTime > data.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Registration time must be before start time",
          path: ["registrationTime"],
        });
      }
    }

    if (data.startTime && data.endTime) {
      if (data.startTime >= data.endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start time must be before end time",
          path: ["startTime"],
        });
      }
    }

    if (mode === "create" && data.eventDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = new Date(data.eventDate);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Event date cannot be in the past",
          path: ["eventDate"],
        });
      }
    }
  });
};
