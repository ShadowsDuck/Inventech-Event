import { z } from "zod";

const EquipmentEventSchema = z.object({
  equipmentId: z.number(),
  quantity: z.number().min(0),
  remark: z.string().optional().nullable(),
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
  companyId: z.number().min(1, "Please select a company"),
  packageId: z.number().optional().nullable(),
  eventType: z.number().min(1, "Please select an event type"),
  address: z.string().optional(),
  location: z.string().optional(),
  note: z.string().optional(),

  eventDate: z.date().optional(),
  staffAppointmentTime: z.string().min(1, "Staff appointment time is required"),
  outsourceAppointmentTime: z.string().optional(),
  registrationTime: z.string().min(1, "Registration time is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  timePeriod: z.number().min(1, "Please select a time period"),

  eventStaff: z.array(StaffSchema),
  eventOutsources: z.array(OutsourceSchema),
  staffRequirements: z.array(RequirementSchema),
  outsourceRequirements: z.array(RequirementSchema),

  eventExtraEquipments: z.array(EquipmentEventSchema),
  attachmentFiles: z.array(z.instanceof(File)),
});

export type EventData = z.infer<typeof baseEventSchema>;

export const getEventSchema = () => {
  const schema = baseEventSchema
    // eventDate
    .superRefine((data, ctx) => {
      if (!data.eventDate) {
        ctx.addIssue({
          code: "custom",
          message: "Event date is required",
          path: ["eventDate"],
          input: data,
        });
      }
    })
    // eventDate ห้ามเป็นวันในอดีต
    .refine(
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
    )
    // registrationTime
    .superRefine((data, ctx) => {
      if (data.registrationTime) {
        if (data.startTime && data.registrationTime >= data.startTime) {
          ctx.addIssue({
            code: "custom",
            message: "Registration time must be before start time",
            path: ["registrationTime"],
            input: data,
          });
        } else if (data.endTime && data.registrationTime >= data.endTime) {
          ctx.addIssue({
            code: "custom",
            message: "Registration time must be before end time",
            path: ["registrationTime"],
            input: data,
          });
        }
      }
    })
    // startTime ต้องก่อน endTime
    .refine(
      (data) => {
        if (!data.startTime || !data.endTime) return true;
        return data.startTime < data.endTime;
      },
      {
        error: "Start time must be before end time",
        path: ["startTime"],
      },
    )
    // รวม staff/outsource appointment time ให้แจ้งทีละข้อความด้วย superRefine
    .superRefine((data, ctx) => {
      // staffAppointmentTime: แจ้งแค่ 1 ข้อความ (ตาม priority)
      if (data.staffAppointmentTime) {
        if (
          data.registrationTime &&
          data.staffAppointmentTime >= data.registrationTime
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Staff appointment time must be before registration time",
            path: ["staffAppointmentTime"],
            input: data,
          });
        } else if (
          data.startTime &&
          data.staffAppointmentTime >= data.startTime
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Staff appointment time must be before start time",
            path: ["staffAppointmentTime"],
            input: data,
          });
        } else if (data.endTime && data.staffAppointmentTime >= data.endTime) {
          ctx.addIssue({
            code: "custom",
            message: "Staff appointment time must be before end time",
            path: ["staffAppointmentTime"],
            input: data,
          });
        }
      }
      // outsourceAppointmentTime: แจ้งแค่ 1 ข้อความ (ตาม priority)
      if (data.outsourceAppointmentTime) {
        if (
          data.registrationTime &&
          data.outsourceAppointmentTime >= data.registrationTime
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              "Outsource appointment time must be before registration time",
            path: ["outsourceAppointmentTime"],
            input: data,
          });
        } else if (
          data.startTime &&
          data.outsourceAppointmentTime >= data.startTime
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Outsource appointment time must be before start time",
            path: ["outsourceAppointmentTime"],
            input: data,
          });
        } else if (
          data.endTime &&
          data.outsourceAppointmentTime >= data.endTime
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Outsource appointment time must be before end time",
            path: ["outsourceAppointmentTime"],
            input: data,
          });
        }
      }
    });

  return schema;
};
