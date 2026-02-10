import { useMemo, useState } from "react";

import { useStore } from "@tanstack/react-form";
import { useQuery, useSuspenseQueries } from "@tanstack/react-query";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import { z } from "zod";

import { useAppForm } from "@/components/form";
import { EquipmentSelectField } from "@/components/form/equipment-select-field";
import StaffAssignmentBuilder from "@/components/form/resource-manage-form";
import ResourceAssignmentBuilder from "@/components/form/resource-manage-form";
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
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
} from "@/components/ui/file-upload";
import { companiesQuery } from "@/features/company/api/getCompanies";
import { equipmentQuery } from "@/features/equipment/api/getEquipment";
import { outsourcesQuery } from "@/features/outsource/api/getOutsource";
import { packageQuery } from "@/features/package/api/getPackage";
import { rolesQuery } from "@/features/staff/api/getRoles";
import { staffQuery } from "@/features/staff/api/getStaff";

import { equipmentBypackageIdQuery } from "../api/getEquipmentByPackageId";

// --- Sub-Schemas ---
const EquipmentEventSchema = z.object({
  equipmentId: z.number(),
  quantity: z.number().min(1),
});

const StaffSchema = z.object({
  staffId: z.number().or(z.string()), // รองรับทั้ง 2 แบบเผื่อ select ส่ง string มา
  roleId: z.number().min(1, "Role is required"),
});

const OutsourceSchema = z.object({
  outsourceId: z.number().or(z.string()), // รองรับทั้ง 2 แบบ
  roleId: z.number(),
});

// --- Main Event Schema ---
export const EventSchema = z
  .object({
    eventName: z.string().min(1, "Event name is required").max(255),
    note: z.string().optional(),

    companyId: z.number().min(1, "Please select a company"),
    packageId: z.number().optional().nullable(),
    eventType: z.number().min(1, "Please select an event type"),

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
  })
  .superRefine((data, ctx) => {
    //  Registration Time ต้องอยู่ก่อน Start Time
    if (data.registrationTime && data.startTime) {
      // เปรียบเทียบ String เวลา (เช่น "09:00" > "08:00")
      if (data.registrationTime > data.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Registration time must be before start time", // ข้อความด่า user (หยอกๆ)
          path: ["registrationTime"], // ให้ Error ไปโผล่ที่ช่อง Registration Time
        });
      }
    }

    //  ตรวจสอบ Start Time ต้องอยู่ก่อน End Time ด้วย
    if (data.startTime && data.endTime) {
      if (data.startTime >= data.endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start time must be before end time",
          path: ["startTime"], // ให้ Error ไปโผล่ที่ช่อง Start Time
        });
      }
    }
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

  // 1. Load Data
  const [
    { data: companiesData },
    { data: packagesData },
    { data: equipmentData },
    { data: roleData },
    { data: staffData },
    { data: outsourceData },
  ] = useSuspenseQueries({
    queries: [
      companiesQuery(),
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
      eventName: initialValues?.eventName ?? "",

      // Default Values ต้องเป็น Number
      companyId: initialValues?.companyId ?? 0,
      eventType: initialValues?.eventType ?? 0,
      packageId: initialValues?.packageId ?? 0,

      eventDate: initialValues?.eventDate,
      registrationTime: initialValues?.registrationTime ?? "",
      startTime: initialValues?.startTime ?? "",
      endTime: initialValues?.endTime ?? "",
      timePeriod: initialValues?.timePeriod ?? "",

      location: initialValues?.location ?? "",
      note: initialValues?.note ?? "",

      eventStaff: initialValues?.eventStaff ?? [],
      eventOutsources: initialValues?.eventOutsources ?? [],
      eventExtraEquipments: initialValues?.eventExtraEquipments ?? [],
      attachmentFiles: initialValues?.attachmentFiles ?? [],
    } as EventData,
    validators: {
      onChange: EventSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  // --- Real-time Package Logic ---
  const selectedPackageId = useStore(
    form.store,
    (state) => state.values.packageId,
  );

  const { data: packageDetail, isLoading: isLoadingPkg } = useQuery({
    ...equipmentBypackageIdQuery(selectedPackageId?.toString() || "0"),
    enabled: !!selectedPackageId,
  });

  const packageItems = useMemo(() => {
    if (!packageDetail?.equipmentSets) return [];
    return packageDetail.equipmentSets.map((item) => ({
      equipmentId: item.equipmentId,
      quantity: item.quantity,
    }));
  }, [packageDetail]);

  const formattedStaffList = useMemo(() => {
    return (
      staffData?.map((s) => ({
        id: String(s.staffId),
        name: s.fullName,
        roles: s.staffRoles ? s.staffRoles.map((r) => r.roleName) : [],
        avatar: s.avatar || "",
      })) || []
    );
  }, [staffData]);

  const formattedOutsourceList = useMemo(() => {
    return (
      outsourceData?.map((o) => ({
        id: String(o.outsourceId),
        name: o.fullName,
        roles: [],
      })) || []
    );
  }, [outsourceData]);

  const title = mode === "create" ? "Create Event" : "Edit Event";
  const subtitle =
    mode === "create" ? "Create a new Event" : "Update Event details";
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
            <ResetFormButton onClick={() => form.reset()} />
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
          {/* Basic Info */}
          <Card className="mt-6">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="h-6 w-1.5 rounded-full bg-blue-600" />
                Basic Information
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
                    name="companyId"
                    children={(field) => (
                      <field.SelectField
                        label="Company"
                        options={companiesOptions.map((company) => ({
                          label: company.label,
                          value: company.value.toString(),
                        }))}
                        placeholder="Select Company"
                        required
                        // 2. แก้ไข: แปลง String -> Number
                        onChange={(val) => field.handleChange(Number(val))}
                        value={field.state.value?.toString()} // แปลงกลับเป็น String เพื่อแสดงผล
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

          {/* Schedule */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="h-6 w-1 rounded-full bg-blue-600" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <section className="w-full space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <form.AppField
                    name="eventDate"
                    children={(field) => <field.DateField label="Event Date" />}
                  />
                  <form.AppField
                    name="registrationTime"
                    children={(field) => (
                      <field.TimeField label="Registration Time" />
                    )}
                  />
                </div>
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
                    <field.LocationField
                      label="Select Location "
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val)}
                    />
                  )}
                />
              </section>
            </CardContent>
          </Card>

          {/* Package Selection */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="h-6 w-1 rounded-full bg-blue-600" />
                Package
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form.AppField
                name="packageId"
                children={(field) => (
                  <field.PackageEventField
                    packages={packagesData}
                    label="Package"
                    canEdit={true}
                    onChange={(newValue) => {
                      // 4. แก้ไข: แปลงเป็น Number ก่อน Logic เทียบค่า
                      const numValue = Number(newValue);

                      const currentEquipment = field.form.getFieldValue(
                        "eventExtraEquipments",
                      );
                      const hasEquipment =
                        currentEquipment && currentEquipment.length > 0;

                      // เทียบค่าด้วย Number
                      if (numValue !== field.state.value && hasEquipment) {
                        setPendingPackage(newValue); // เก็บค่าใหม่ (string หรือ number ก็ได้สำหรับ state ชั่วคราว)
                        setAlertOpen(true);
                      } else {
                        field.handleChange(numValue); // Save เป็น Number
                      }
                    }}
                  />
                )}
              />

              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Change Package?</AlertDialogTitle>
                    <AlertDialogDescription>
                      If you change the package, the selected equipment will be
                      cleared.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setPendingPackage(null)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        if (
                          pendingPackage !== null &&
                          pendingPackage !== undefined
                        ) {
                          form.setFieldValue(
                            "packageId",
                            Number(pendingPackage),
                          );
                          form.setFieldValue("eventExtraEquipments", []);
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
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="h-6 w-1 rounded-full bg-blue-600" />
                Equipment
                {isLoadingPkg && (
                  <span className="ml-2 flex items-center text-xs text-gray-400">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />{" "}
                    Updating...
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form.AppField
                name="eventExtraEquipments"
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

          {/* Staff */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="h-6 w-1 rounded-full bg-blue-600" />
                Staff Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form.AppField
                name="eventStaff"
                children={(field) => (
                  <ResourceAssignmentBuilder
                    candidates={formattedStaffList} // ส่ง Staff
                    availableRoles={roleData || []}
                    idKey="staffId"
                    entityLabel="Staff" // <--- บอกว่าเป็น Staff
                    onChange={(data) => field.handleChange(data)}
                    value={field.state.value}
                  />
                )}
              />
            </CardContent>
          </Card>

          {/* Outsource */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="h-6 w-1 rounded-full bg-violet-600" />
                Outsource Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form.AppField
                name="eventOutsources"
                children={(field) => (
                  <ResourceAssignmentBuilder
                    candidates={formattedOutsourceList} // ส่ง Outsource
                    availableRoles={roleData || []}
                    ignoreRoleValidation={true}
                    idKey="outsourceId"
                    entityLabel="Outsource" // <--- บอกว่าเป็น Outsource (Text จะเปลี่ยนตาม)
                    onChange={(data) => field.handleChange(data)}
                    value={field.state.value}
                  />
                )}
              />
            </CardContent>
          </Card>

          {/* File & Note */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-600">
                  <span className="h-6 w-1 rounded-full bg-blue-600" />
                  File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form.AppField
                  name="attachmentFiles"
                  children={(field) => (
                    <FileUpload
                      value={field.state.value}
                      onValueChange={(files) => {
                        if (Array.isArray(files)) {
                          // ส่ง Array เข้าไปเก็บใน State ตรงๆ เลย
                          field.handleChange(files);
                        } else {
                          // กันเหนียว กรณี component ส่งมาผิด หรือ user ลบไฟล์จนหมด
                          field.handleChange([]);
                        }
                      }}
                    >
                      <FileUploadDropzone className="text-black-500 mb-4 flex h-64 items-center justify-center rounded-2xl transition-colors group-hover:bg-blue-200 group-hover:text-blue-600">
                        <div className="flex flex-col items-center justify-center">
                          <UploadCloud size={32} color="gray" />
                          <p className="text-gray-600">ลากไฟล์มาวางที่นี่</p>
                        </div>
                      </FileUploadDropzone>
                      <FileUploadList>
                        {field.state.value?.map((file, index) => (
                          <FileUploadItem key={index} value={file}>
                            <div className="flex w-full items-center gap-2">
                              <FileUploadItemPreview />
                              <FileUploadItemMetadata />
                              <FileUploadItemDelete
                                className="text-red-500 hover:text-red-700"
                                onClick={() => {
                                  const newFiles = [...field.state.value];
                                  newFiles.splice(index, 1);
                                  field.handleChange(newFiles);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </FileUploadItemDelete>
                            </div>
                          </FileUploadItem>
                        ))}
                      </FileUploadList>
                    </FileUpload>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-600">
                  <span className="h-6 w-1 rounded-full bg-blue-600" />
                  Note
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
