import { useMemo, useState } from "react";

import { useStore } from "@tanstack/react-form";
import { useQuery, useSuspenseQueries } from "@tanstack/react-query";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import { z } from "zod";

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
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
} from "@/components/ui/file-upload";
import { equipmentQuery } from "@/features/equipment/api/getEquipment";
import { outsourcesQuery } from "@/features/outsource/api/getOutsource";
import { packageQuery } from "@/features/package/api/getPackage";
import { rolesQuery } from "@/features/staff/api/getRoles";
import { staffQuery } from "@/features/staff/api/getStaff";

import { companiesQueries } from "../api/getCompany";
import { equipmentBypackageIdQuery } from "../api/getEquipmentByPackageId";

// --- Sub-Schemas ---
// --- Sub-Schemas ---

const EquipmentEventSchema = z.object({
  equipmentId: z.number(),
  quantity: z.number().min(1),
});

const OutsourcedSchema = z.object({
  outsourceId: z.number(),
  roleId: z.number().min(1, "Role is required"),
});

const LocationSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// --- Main Event Schema ---

export const EventSchema = z.object({
  eventName: z.string().min(1, "Event name is required").max(255),
  note: z.string().optional(),

  // 1. แก้ไข: ใช้ z.number() แทน coerce เพื่อ Type Safety กับ Form State
  companyId: z.number().min(1, "Please select a company"),
  packageId: z.number().optional().nullable(),
  eventType: z.number().min(1, "Please select an event type"),

  eventDate: z
    .union([z.date(), z.string()])
    // ใช้ refine เพื่อเช็คว่าต้อง "มีค่า" (ไม่เป็น null, undefined, หรือ string ว่าง)
    .optional()
    .refine((val) => !!val, { message: "Event date is required" }),
  registrationTime: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  timePeriod: z.union([z.string(), z.number()]),
  location: LocationSchema.optional(),

  // --- API Fields (ส่งไป Backend) ---
  staffIds: z.array(z.number()),
  eventExtraEquipments: z.array(EquipmentEventSchema),
  eventOutsources: z.array(OutsourcedSchema),

  file: z.array(z.instanceof(File)),
  // --- UI Fields ---
  staff: z.array(z.any()),
  outsource: z.array(z.any()),
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
      companiesQueries(),
      packageQuery(),
      equipmentQuery(),
      rolesQuery(),
      staffQuery(),
      outsourcesQuery(),
    ],
  });

  // Log เพื่อเช็คว่าข้อมูล Master Data เข้ามาครบไหม
  // console.log("Loaded Master Data:", { staffData, outsourceData, roleData });

  const companiesOptions = useMemo(() => {
    return companiesData?.map((company) => ({
      value: company.companyId.toString(),
      label: company.companyName,
    }));
  }, [companiesData]);

  const form = useAppForm({
    defaultValues: {
      eventName: initialValues?.eventName || "",

      // Default Values ต้องเป็น Number
      companyId: initialValues?.companyId || 0,
      eventType: initialValues?.eventType || 0,
      packageId: initialValues?.packageId || 0,

      eventDate: initialValues?.eventDate || undefined,
      registrationTime: initialValues?.registrationTime || "",
      startTime: initialValues?.startTime || "",
      endTime: initialValues?.endTime || "",
      timePeriod: initialValues?.timePeriod || "",

      location: initialValues?.location || {},
      note: initialValues?.note || "",
      file: initialValues?.file || [],
      // UI Fields
      staff: initialValues?.staff || [],
      outsource: initialValues?.outsource || [],

      // API Fields (ต้องมีให้ครบตาม Schema)
      staffIds: initialValues?.staffIds || [],
      eventOutsources: initialValues?.eventOutsources || [],
      eventExtraEquipments: initialValues?.eventExtraEquipments || [],
    } as EventData,

    validators: {
      onChange: EventSchema,
    },

    onSubmit: async ({ value }) => {
      // ---------------------------------------------------------
      // 🕵️‍♂️ LOG 1: ดูข้อมูลดิบจาก Form ก่อนแปลง
      // ---------------------------------------------------------
      console.group("🚀 START: Debug Event Submission");
      console.log("1️⃣ Raw Values from Form:", value);

      const formData = new FormData();

      // --- 1. Prepare Data ---
      const dateObj = new Date(value.eventDate || new Date());
      const formattedDate = dateObj.toISOString().split("T")[0];

      const periodMapping: Record<string, string> = {
        morning: "0",
        afternoon: "1",
      };
      const periodValue =
        periodMapping[value.timePeriod.toString()] ||
        value.timePeriod.toString();

      console.log("📅 Formatted Date:", formattedDate);
      console.log("⏰ Mapped Period Value:", periodValue);

      // --- 2. Basic Fields ---
      formData.append("EventName", value.eventName);
      formData.append("EventType", value.eventType.toString());
      formData.append("CompanyId", value.companyId.toString());

      // --- Handle Package ID ---
      if (value.packageId && value.packageId > 0) {
        console.log("📦 Sending PackageId:", value.packageId);
        formData.append("PackageId", value.packageId.toString());
      } else {
        console.log("📦 PackageId is empty -> Sending empty string");
        formData.append("PackageId", ""); // ส่งค่าว่างเพื่อให้ Backend แปลงเป็น null
      }

      formData.append("MeetingDate", formattedDate);
      formData.append("RegistrationTime", value.registrationTime || "");
      formData.append("StartTime", value.startTime);
      formData.append("EndTime", value.endTime);
      formData.append("Period", periodValue);
      formData.append("Note", value.note || "");

      // --- 3. Location ---
      if (value.location) {
        formData.append("Latitude", value.location.latitude?.toString() || "");
        formData.append(
          "Longitude",
          value.location.longitude?.toString() || "",
        );
      }

      // --- 4. Arrays & Transformations ---

      // A. Equipment
      if (value.eventExtraEquipments && value.eventExtraEquipments.length > 0) {
        console.log("🔧 Adding Equipment:", value.eventExtraEquipments);
        value.eventExtraEquipments.forEach((item, index) => {
          formData.append(
            `EventExtraEquipments[${index}].EquipmentId`,
            item.equipmentId.toString(),
          );
          formData.append(
            `EventExtraEquipments[${index}].Quantity`,
            item.quantity.toString(),
          );
        });
      }

      // B. Outsource
      const formattedOutsource = value.outsource.map((item) => {
        const matchedRole = roleData?.find((r) => r.roleName === item.roleName);
        if (!matchedRole)
          console.warn(
            `⚠️ Warning: Role not found for outsource: ${item.roleName}`,
          );

        return {
          outsourceId: Number(item.staffId),
          roleId: matchedRole ? matchedRole.roleId : 0,
        };
      });

      console.log("👷 Mapped Outsource Data:", formattedOutsource);

      if (formattedOutsource.length > 0) {
        formattedOutsource.forEach((item, index) => {
          // 🛡️ Safety Check: ถ้า RoleId เป็น 0 (หาไม่เจอ) ไม่ควรส่งไปเพราะจะทำ 500 Error
          if (item.roleId !== 0) {
            formData.append(
              `EventOutsources[${index}].OutsourceId`,
              item.outsourceId.toString(),
            );
            formData.append(
              `EventOutsources[${index}].RoleId`,
              item.roleId.toString(),
            );
          } else {
            console.error("❌ SKIPPING OUTSOURCE due to missing role:", item);
          }
        });
      }

      // C. Staff
      if (value.staff && value.staff.length > 0) {
        // 1. กรองและหา ID ให้เรียบร้อยก่อน
        const finalStaffList = value.staff
          .map((item) => {
            //แก้การเทียบชื่อให้ยืดหยุ่น (ตัดช่องว่าง + ไม่สนตัวพิมพ์ใหญ่เล็ก)
            const matchedRole = roleData?.find(
              (r) =>
                r.roleName.trim().toLowerCase() ===
                item.roleName?.trim().toLowerCase(),
            );

            return {
              staffId: Number(item.staffId),
              roleId: matchedRole ? matchedRole.roleId : 0,
            };
          })
          //  กรองเอาเฉพาะคนที่มีทั้ง StaffId และ RoleId
          .filter((s) => s.staffId > 0 && s.roleId > 0);

        console.log("👥 ข้อมูล Staff ที่จะส่งจริง:", finalStaffList);

        // 2. วนลูปส่งด้วย Index ที่เรียงต่อเนื่อง (0, 1, 2...)
        finalStaffList.forEach((item, index) => {
          formData.append(
            `EventStaffs[${index}].StaffId`,
            item.staffId.toString(),
          );
          formData.append(
            `EventStaffs[${index}].RoleId`,
            item.roleId.toString(),
          );
        });
      }

      // --- 5. File ---
      if (value.file && value.file.length > 0) {
        console.log("📎 Attaching Files:", value.file.length);
        value.file.forEach((f) => {
          formData.append("AttachmentFiles", f);
        });
      }

      // ---------------------------------------------------------
      // LOG 2: แอบดูไส้ใน FormData
      // ---------------------------------------------------------
      console.group("📦 FINAL FORM DATA CONTENT");

      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      console.groupEnd();
      console.groupEnd(); // End Main Debug Group

      onSubmit(formData as any);
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

  //  ใช้ useMemo เพื่อป้องกัน Infinite Loop
  const formattedStaffList = useMemo(() => {
    return (
      staffData?.map((s) => ({
        staffId: String(s.staffId),
        fullName: s.fullName,
        roles: s.staffRoles ? s.staffRoles.map((r) => r.roleName) : [],
        avatar: s.avatar || "",
      })) || []
    );
  }, [staffData]);

  //  ใช้ useMemo เพื่อป้องกัน Infinite Loop
  const formattedOutsourceList = useMemo(() => {
    return (
      outsourceData?.map((o) => ({
        staffId: String(o.outsourceId),
        fullName: o.fullName,
        roles: [],
        avatar: "",
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
                    <field.LocationField label="Select Location " />
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
                        if (pendingPackage) {
                          form.setFieldValue(
                            "packageId",
                            Number(pendingPackage),
                          ); // Save เป็น Number
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
                name="staff"
                children={(field) => (
                  <StaffAssignmentBuilder
                    staffList={formattedStaffList}
                    availableRoles={roleData?.map((r) => r.roleName) || []}
                    onChange={(data) => field.handleChange(data)}
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
                name="outsource"
                children={(field) => (
                  <StaffAssignmentBuilder
                    staffList={formattedOutsourceList}
                    availableRoles={roleData?.map((r) => r.roleName) || []}
                    onChange={(data) => field.handleChange(data)}
                    ignoreRoleValidation={true}
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
                  name="file"
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
