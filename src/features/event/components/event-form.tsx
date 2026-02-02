import { useMemo, useState } from "react";

import { revalidateLogic, useStore } from "@tanstack/react-form";
// 1. ยังคงใช้ useQuery สำหรับ Dynamic Data
import { useQuery, useSuspenseQueries } from "@tanstack/react-query";
import { Loader2, UploadCloud } from "lucide-react";
import z from "zod";

import { useAppForm } from "@/components/form";
import { EquipmentSelectField } from "@/components/form/equipment-select-field";
import StaffAssignmentBuilder from "@/components/form/staff-manage-form";
import { CreateFormButton } from "@/components/form/ui/create-form-button";
import { ResetFormButton } from "@/components/form/ui/reset-form-button";
import PageHeader from "@/components/layout/PageHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload, FileUploadDropzone } from "@/components/ui/file-upload";
import { equipmentQuery } from "@/features/equipment/api/getEquipment";
import { outsourcesQuery } from "@/features/outsource/api/getOutsource";
import { packageQuery } from "@/features/package/api/getPackage";
import { rolesQuery } from "@/features/staff/api/getRoles";
import { staffQuery } from "@/features/staff/api/getStaff";

import { companiesQueries } from "../api/getCompany";
import { equipmentBypackageIdQuery } from "../api/getEquipmentByPackageId";

// --- Schema Definitions ---
const EquipmentEventSchema = z.object({
  equipmentId: z.number(),
  quantity: z.number().min(1),
});
const StaffSchema = z.object({
  role: z.string(),
  staffId: z.array(z.number()),
});
const OutsourcedSchema = z.object({
  outsourcedId: z.array(z.number()),
});
const LocationSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const EventSchema = z.object({
  eventName: z
    .string()
    .min(1, "Event name is required")
    .max(255, "Event name must be between 1 and 255 characters"),
  eventDate: z.date({ error: "Date is required" }),

  Company: z.string().min(1, "Please select at least one company"),
  eventType: z.enum(
    ["offline", "online", "hybrid"],
    "Please select an event type",
  ),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  timePeriod: z.enum(
    ["morning", "afternoon"],
    "Please select an event session.",
  ),
  package: z.string(),
  file: z.instanceof(File).optional(),
  eventExtraEquipment: z.array(EquipmentEventSchema),
  staff: z.array(StaffSchema).optional(),
  outsource: z.array(OutsourcedSchema).optional(),
  location: z.optional(LocationSchema),
  note: z.string().optional(),
});

export type EventData = z.infer<typeof EventSchema>;

interface EventFormProps {
  initialValues?: Partial<EventData>;
  onSubmit: (values: EventData) => void;
  isPending: boolean;
  mode: "create" | "edit";
}

export default function EventForm({
  initialValues,
  onSubmit,
  isPending,
  mode,
}: EventFormProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [pendingPackage, setPendingPackage] = useState<string | null>(null);
  console.log(alertOpen);
  // 1. Static Data (Load Once)
  const [
    { data: companiesData },
    { data: packagesData },
    { data: equipmentData },
    { data: roleData },
    { data: staffData },
    { data: outsourceData },
  ] = useSuspenseQueries({
    queries: [
      companiesQueries(),
      packageQuery(),
      equipmentQuery(),
      rolesQuery(),
      staffQuery(),
      outsourcesQuery(),
    ],
  });

  const companiesOptions = useMemo(() => {
    return companiesData?.map((company) => ({
      value: company.companyId.toString(),
      label: company.companyName,
    }));
  }, [companiesData]);

  const form = useAppForm({
    defaultValues: {
      eventName: initialValues?.eventName || "",
      Company: initialValues?.Company || "",
      eventType: initialValues?.eventType || "",
      eventDate: initialValues?.eventDate || null,
      startTime: initialValues?.startTime || "",
      endTime: initialValues?.endTime || "",
      timePeriod: initialValues?.timePeriod || "",
      package: initialValues?.package || "",
      eventExtraEquipment: initialValues?.eventExtraEquipment || [],
      staff: initialValues?.staff || [],
      outsource: initialValues?.outsource || [],
      location: initialValues?.location || {},
      note: initialValues?.note || "",
    } as EventData,
    validators: {
      onChange: EventSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  // A. ใช้ form.useStore ดึงค่า package ปัจจุบันแบบ Real-time
  const selectedPackageId = useStore(
    form.store,
    (state) => state.values.package,
  );

  // B. ยิง Query เมื่อมี packageId
  const { data: packageDetail, isLoading: isLoadingPkg } = useQuery({
    ...equipmentBypackageIdQuery(selectedPackageId),
    enabled: !!selectedPackageId, // ทำงานเมื่อมี ID เท่านั้น
  });

  // C. เตรียมข้อมูลสำหรับส่งให้ EquipmentSelectField
  const packageItems = useMemo(() => {
    if (!packageDetail?.equipmentSets) return [];
    return packageDetail.equipmentSets.map((item) => ({
      equipmentId: item.equipmentId,
      quantity: item.quantity,
    }));
  }, [packageDetail]);

  // -----------------------------------------------------------

  const title = mode === "create" ? "Create Event" : "Edit Event";
  const subtitle =
    mode === "create"
      ? "Create a new Event"
      : "Update Event details and contacts";
  const saveLabel = mode === "create" ? "Create Event" : "Save Changes";
  const loadingLabel = mode === "create" ? "Creating..." : "Saving...";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={title}
        backButton
        subtitle={subtitle}
        actions={
          <div className="flex items-center gap-2">
            <ResetFormButton
              onClick={() => {
                form.reset();
              }}
            />

            <CreateFormButton
              saveLabel={saveLabel}
              loadingLabel={loadingLabel}
              form="event-form-id"
              isPending={isPending}
            />
          </div>
        }
      />

      <div className="mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 pb-20 lg:p-10">
        <form
          id="event-form-id"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          {/* ... Basic Info & Schedule Cards (เหมือนเดิม) ... */}
          <Card className="mt-6">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center justify-between gap-2 text-lg font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-1.5 rounded-full bg-blue-600" />
                  Basic Information
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <section className="space-y-6">
                <form.AppField
                  name="eventName"
                  children={(field) => (
                    <field.TextField
                      label="Event Name"
                      type="text"
                      placeholder="e.g. Tech Conference"
                    />
                  )}
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <form.AppField
                    name="Company"
                    children={(field) => (
                      <field.SelectField
                        label="Company"
                        options={companiesOptions.map((company) => ({
                          label: company.label,
                          value: company.value.toString(),
                        }))}
                        placeholder="Select Company"
                        required
                      />
                    )}
                  />
                  <form.AppField
                    name="eventType"
                    children={(field) => (
                      <field.EventFormatField label="Event Type" />
                    )}
                  />
                </div>
              </section>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-lg font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-1 rounded-full bg-blue-600" />
                  Schedule
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <section className="w-full space-y-6">
                <form.AppField
                  name="eventDate"
                  children={(field) => <field.DateField label="Event Date" />}
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <form.AppField
                    name="startTime"
                    children={(field) => <field.TimeField label="Start Time" />}
                  />
                  <form.AppField
                    name="endTime"
                    children={(field) => <field.TimeField label="End Time" />}
                  />
                </div>
                <form.AppField
                  name="timePeriod"
                  children={(field) => (
                    <field.PeriodSelectField label="Period" />
                  )}
                />
                <form.AppField
                  name="location"
                  children={(field) => (
                    <field.LocationField label="Select Location " />
                  )}
                />
              </section>
            </CardContent>
          </Card>

          {/* Package Selection */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-lg font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-1 rounded-full bg-blue-600" />
                  Package
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* ส่วน Form Field */}
              <form.AppField
                name="package"
                children={(field) => (
                  <field.PackageEventField
                    packages={packagesData}
                    label="Package"
                    canEdit={false} // อย่าลืมเปลี่ยนเป็น true ถ้าต้องการให้กดเลือกได้
                    // --- Logic การทำงานเมื่อมีการคลิกเลือก ---
                    onChange={(newValue) => {
                      // ดึงค่า equipment ปัจจุบันมาเช็ค
                      const currentEquipment = field.form.getFieldValue(
                        "eventExtraEquipment",
                      );
                      const hasEquipment =
                        currentEquipment && currentEquipment.length > 0;

                      // เงื่อนไข: ถ้าเปลี่ยนค่าเดิม AND มี equipment ค้างอยู่
                      if (newValue !== field.state.value && hasEquipment) {
                        setPendingPackage(newValue); // 1. จำค่าใหม่ไว้ก่อน
                        setAlertOpen(true); // 2. สั่งเปิด popup
                      } else {
                        // ถ้าไม่มี equipment หรือกดตัวเดิม -> เปลี่ยนค่าได้เลย
                        field.handleChange(newValue);
                      }
                    }}
                  />
                )}
              />

              {/* --- ส่วน AlertDialog (ย้ายออกมาอยู่นอก onChange) --- */}
              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Change Package?</AlertDialogTitle>
                    <AlertDialogDescription>
                      If you change the package, the selected equipment will be
                      cleared. Do you want to proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    {/* ปุ่มยกเลิก: ปิด Dialog และล้างค่าที่จำไว้ */}
                    <AlertDialogCancel onClick={() => setPendingPackage(null)}>
                      Cancel
                    </AlertDialogCancel>

                    {/* ปุ่มยืนยัน: ทำการเปลี่ยนค่าจริง */}
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        if (pendingPackage) {
                          // 1. เปลี่ยน Package เป็นค่าใหม่ที่จำไว้
                          form.setFieldValue("package", pendingPackage);
                          // 2. ล้างค่า Equipment
                          form.setFieldValue("eventExtraEquipment", []);

                          // 3. Reset State ชั่วคราว
                          setPendingPackage(null);
                          setAlertOpen(false);
                        }
                      }}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* Equipment Selection */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-lg font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-1 rounded-full bg-blue-600" />
                  Equipment
                  {isLoadingPkg && (
                    <span className="ml-2 flex items-center text-xs font-normal text-gray-400">
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />{" "}
                      Updating...
                    </span>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form.AppField
                name="eventExtraEquipment"
                children={() => (
                  <EquipmentSelectField
                    label="Select Equipment"
                    equipmentList={equipmentData}
                    packageItems={packageItems}
                  />
                )}
              />
            </CardContent>
          </Card>

          {/* ... Staff, Outsource, Files, Notes (เหมือนเดิม) ... */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-lg font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-1 rounded-full bg-blue-600" />
                  Staff Management
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form.AppField
                name="staff"
                children={(field) => (
                  <StaffAssignmentBuilder
                    // Map ข้อมูลให้ตรงกับ Interface ของ StaffAssignmentBuilder
                    staffList={
                      staffData?.map((s) => ({
                        staffId: String(s.staffId),
                        fullName: s.fullName,
                        roles: s.staffRoles
                          ? s.staffRoles.map((r) => r.roleName)
                          : [],
                        avatar: s.avatar || "",
                      })) || []
                    }
                    availableRoles={roleData?.map((r) => r.roleName) || []}
                    onChange={(data) => field.handleChange(data)}
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-lg font-bold text-gray-900">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-1 rounded-full bg-violet-600" />
                  Outsource Management
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form.AppField
                name="outsource"
                children={(field) => (
                  <StaffAssignmentBuilder
                    staffList={outsourceData || []}
                    availableRoles={roleData?.map((r) => r.roleName) || []}
                    onChange={(data) => field.handleChange(data)}
                    ignoreRoleValidation={true} // <--- ใส่ตรงนี้ เพื่อบอกว่า "แสดงรายชื่อ Outsource ทุกคนมาเลย"
                  />
                )}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-bold text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-1 rounded-full bg-blue-600" />
                    File
                  </div>
                </CardTitle>
              </CardHeader>
              <section className="w-full space-y-6">
                <CardContent>
                  <FileUpload>
                    <FileUploadDropzone className="text-black-500 mb-4 flex h-64 items-center justify-center rounded-2xl transition-colors group-hover:bg-blue-200 group-hover:text-blue-600">
                      <div className="flex flex-col items-center justify-center">
                        <UploadCloud size={32} color="gray" />
                        <p className="text-gray-600">ลากไฟล์มาวางที่นี่</p>
                      </div>
                    </FileUploadDropzone>
                  </FileUpload>
                </CardContent>
              </section>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-bold text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-1 rounded-full bg-blue-600" />
                    Note
                  </div>
                </CardTitle>
                <CardContent>
                  <form.AppField
                    name="note"
                    children={(field) => (
                      <field.TextAreaField
                        placeholder="Enter your note here"
                        className="min-h-64 pt-2"
                      />
                    )}
                  />
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
