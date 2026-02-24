import { z } from "zod";

const EquipmentEventSchema = z.object({
  equipmentId: z.number(),
  quantity: z.number().min(1),
});

const StaffSchema = z.object({
  staffId: z.number().or(z.string()),
  roleId: z.number().min(1, "Role is required"),
  fullName: z.string().optional(),
  roleName: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

const OutsourceSchema = z.object({
  outsourceId: z.number().or(z.string()),
  roleId: z.number(),
  fullName: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

const RequirementSchema = z.object({
  roleId: z.number(),
  quantity: z.number(),
  sourceType: z.union([z.literal(1), z.literal(2)]), // 1 = Staff, 2 = Outsource
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
  staffAppointmentTime: z.string().optional(),
  outsourceAppointmentTime: z.string().optional(),
  registrationTime: z.string().min(1, "Registration time is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  timePeriod: z.number().min(1, "Please select a time period"),
  location: z.string().optional(),

  eventStaff: z.array(StaffSchema),
  eventOutsources: z.array(OutsourceSchema),
  eventExtraEquipments: z.array(EquipmentEventSchema),
  attachmentFiles: z.array(z.instanceof(File)),

  staffRequirements: z.array(RequirementSchema),
  outsourceRequirements: z.array(RequirementSchema),
});

export type EventData = z.infer<typeof baseEventSchema>;

export const getEventSchema = (mode: "create" | "edit") => {
  let schema = baseEventSchema
    .refine(
      (data) => {
        if (!data.registrationTime || !data.startTime) return true;
        return data.registrationTime <= data.startTime;
      },
      {
        error: "Registration time must be before start time",
        path: ["registrationTime"],
      },
    )
    .refine(
      (data) => {
        if (!data.startTime || !data.endTime) return true;
        return data.startTime < data.endTime;
      },
      {
        error: "Start time must be before end time",
        path: ["startTime"],
      },
    );

  if (mode === "create") {
    schema = schema.refine(
      (data) => {
        if (!data.eventDate) return true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(data.eventDate);
        selectedDate.setHours(0, 0, 0, 0);

        return selectedDate >= today;
      },
      {
        error: "Event date cannot be in the past",
        path: ["eventDate"],
      },
    );
  }

  return schema;
};
