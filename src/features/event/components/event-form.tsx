import { useMemo, useRef, useState } from "react";

import { useStore } from "@tanstack/react-form";
import { useQuery, useSuspenseQueries } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Building2,
  FileText,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";

import { useAppForm } from "@/components/form";
import { EquipmentSelectField } from "@/components/form/equipment-select-field";
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
import type { CompanyType } from "@/types/company";
import type { EquipmentType } from "@/types/equipment";
import type { ExistingFileType } from "@/types/event";
import type { OutsourceType } from "@/types/outsource";
import type { PackageType } from "@/types/package";
import type { StaffType } from "@/types/staff";

import { equipmentBypackageIdQuery } from "../api/getEquipmentByPackageId";
import { type EventData, getEventSchema } from "./event-schema";

interface EventFormProps {
  initialValues?: Partial<EventData>;
  onSubmit: (
    values: EventData,
    deletedFileIds?: number[],
    currentExistingFiles?: ExistingFileType[],
  ) => void;
  isPending: boolean;
  mode: "create" | "edit";
  existingFiles?: Array<{ id: number; fileName: string; url: string }>;
}

export default function EventForm({
  initialValues,
  onSubmit,
  isPending,
  mode,
  existingFiles = [],
}: EventFormProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [pendingPackage, setPendingPackage] = useState<string | null>(null);

  // --- Logic จัดการการเปลี่ยนวันที่ (แก้ Bug กดยกเลิกแล้วคนหาย) ---
  const [dateAlertOpen, setDateAlertOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState<Date | undefined>(undefined);
  const [periodAlertOpen, setPeriodAlertOpen] = useState(false);
  const [pendingPeriod, setPendingPeriod] = useState<number | undefined>(
    undefined,
  );

  const [currentExistingFiles, setCurrentExistingFiles] =
    useState(existingFiles);
  const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);
  const currentExistingFilesRef = useRef(existingFiles);
  const deletedFileIdsRef = useRef<number[]>([]);

  const handleRemoveExisting = (fileId: number) => {
    setCurrentExistingFiles((prev) => {
      const next = prev.filter((f) => f.id !== fileId);
      currentExistingFilesRef.current = next; // อัปเดต Ref
      return next;
    });

    setDeletedFileIds((prev) => {
      const next = [...prev, fileId];
      deletedFileIdsRef.current = next; // อัปเดต Ref
      return next;
    });
  };
  // 1. Load ข้อมูลพื้นฐาน
  const [
    { data: roleData },
    { data: companiesData },
    { data: packagesData },
    { data: equipmentData },
  ] = useSuspenseQueries({
    queries: [
      rolesQuery(),
      {
        ...companiesQuery(),
        select: (data: CompanyType[]) => data.filter((s) => !s.isDeleted),
      },
      {
        ...packageQuery(),
        select: (data: PackageType[]) => data.filter((s) => !s.isDeleted),
      },
      {
        ...equipmentQuery(),
        select: (data: EquipmentType[]) => data.filter((s) => !s.isDeleted),
      },
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
      companyId: initialValues?.companyId ?? 0,
      eventType: initialValues?.eventType ?? 0,
      address: initialValues?.address ?? "",
      packageId: initialValues?.packageId ?? 0,
      eventDate: initialValues?.eventDate,
      staffAppointmentTime: initialValues?.staffAppointmentTime ?? "",
      outsourceAppointmentTime: initialValues?.outsourceAppointmentTime ?? "",
      registrationTime: initialValues?.registrationTime ?? "",
      startTime: initialValues?.startTime ?? "",
      endTime: initialValues?.endTime ?? "",
      timePeriod: initialValues?.timePeriod ?? 0,
      location: initialValues?.location ?? "",
      note: initialValues?.note ?? "",
      eventStaff: initialValues?.eventStaff ?? [],
      eventOutsources: initialValues?.eventOutsources ?? [],
      eventExtraEquipments: initialValues?.eventExtraEquipments ?? [],
      attachmentFiles: [],
      staffRequirements: initialValues?.staffRequirements ?? [],
      outsourceRequirements: initialValues?.outsourceRequirements ?? [],
    } as EventData,
    validators: { onChange: getEventSchema() },
    onSubmit: async ({ value }) =>
      onSubmit(
        value,
        deletedFileIdsRef.current,
        currentExistingFilesRef.current,
      ),
  });

  // --- ดึงค่าจาก Store มาใช้คุม Logic ---
  const currentEventDate = useStore(
    form.store,
    (state) => state.values.eventDate,
  );
  const currentTimePeriod = useStore(
    form.store,
    (state) => state.values.timePeriod,
  );
  const currentStaff = useStore(form.store, (state) => state.values.eventStaff);
  const currentOutsources = useStore(
    form.store,
    (state) => state.values.eventOutsources,
  );
  const selectedPackageId = useStore(
    form.store,
    (state) => state.values.packageId,
  );
  type FieldControl<T> = {
    state: { value: T | undefined };
    handleChange: (value: T) => void;
  };
  // --- ดักจับการเปลี่ยนวันที่ก่อนเข้า Store ---
  const handleDateChange = (
    newDate: Date | undefined,
    field: FieldControl<Date>,
  ) => {
    const hasResources =
      currentStaff?.length > 0 || currentOutsources?.length > 0;
    const isActuallyChanged =
      newDate?.getTime() !== field.state.value?.getTime();

    // โค้ดนี้ของคุณหายไปตอนวางทับ ให้เติมกลับเข้ามาด้วยครับ
    if (hasResources && isActuallyChanged) {
      setPendingDate(newDate); // พักวันที่ใหม่ไว้
      setDateAlertOpen(true); // เปิด Alert
    } else {
      field.handleChange(newDate as Date); // เปลี่ยนได้เลยถ้าไม่มีคน
    }
  };

  // --- ดักจับการเปลี่ยนเวลา ---
  const handlePeriodChange = (
    newPeriod: number,
    field: FieldControl<number>,
  ) => {
    const hasResources =
      currentStaff?.length > 0 || currentOutsources?.length > 0;
    const isActuallyChanged = newPeriod !== field.state.value;

    if (hasResources && isActuallyChanged) {
      setPendingPeriod(newPeriod);
      setPeriodAlertOpen(true);
    } else {
      field.handleChange(newPeriod);
    }
  };

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

  const dateString = currentEventDate
    ? format(currentEventDate, "yyyy-MM-dd")
    : undefined;
  const periodNumber = currentTimePeriod || undefined;

  const { data: staffData } = useQuery({
    ...staffQuery({ date: dateString, period: periodNumber }),
    select: (data: StaffType[]) =>
      data.filter((s) => !s.isDeleted && !isPending),
    enabled: !!dateString && !!periodNumber,
  });

  const { data: outsourceData } = useQuery({
    ...outsourcesQuery({ date: dateString, period: periodNumber }),
    select: (data: OutsourceType[]) => data.filter((s) => !s.isDeleted),
    enabled: !!dateString && !!periodNumber,
  });

  const isSameSchedule = useMemo(() => {
    if (mode !== "edit" || !initialValues?.eventDate || !currentEventDate)
      return false;
    return (
      format(initialValues.eventDate, "yyyy-MM-dd") ===
        format(currentEventDate, "yyyy-MM-dd") &&
      initialValues.timePeriod === currentTimePeriod
    );
  }, [mode, initialValues, currentEventDate, currentTimePeriod]);

  const isResourceLocked =
    !currentEventDate || !currentTimePeriod || currentTimePeriod === 0;

  // --- Formatting Lists พร้อม Safety Net กันคนหายตอน F5 ---
  const formattedStaffList = useMemo(() => {
    const BASE_IMAGE_URL = "https://localhost:7268/uploads/";
    const initialAssignedIds = new Set(
      mode === "edit"
        ? initialValues?.eventStaff
            ?.filter((s) => !s.isDeleted)
            .map((s) => String(s.staffId))
        : [],
    );

    const baseList =
      staffData?.map((s) => {
        const sId = String(s.staffId);
        let displayStatus = s.status;
        if (
          isSameSchedule &&
          initialAssignedIds.has(sId) &&
          s.status === "Unavailable"
        )
          displayStatus = "Available";
        return {
          id: sId,
          name: s.fullName,
          roles: s.staffRoles?.map((r) => r.roleName) || [],
          avatar: s.avatar ? `${BASE_IMAGE_URL}${s.avatar}` : "",
          status: displayStatus,
        };
      }) || [];

    // [SAFETY NET] รักษาคนเดิมไว้ใน Candidates จังหวะ Loading (แก้ Bug F5)
    if (mode === "edit" && initialValues?.eventStaff) {
      const existingIds = new Set(baseList.map((s) => s.id));
      initialValues.eventStaff.forEach((assigned) => {
        if (assigned.isDeleted) return;
        const sId = String(assigned.staffId);
        if (!existingIds.has(sId)) {
          baseList.push({
            id: sId,
            name: assigned.fullName || `Staff #${sId}`,
            roles: [assigned.roleName || "Unknown Role"],
            avatar: "",
            status: isSameSchedule ? "Available" : "Unavailable",
          });
        }
      });
    }
    return baseList;
  }, [staffData, mode, initialValues, isSameSchedule]);

  const formattedOutsourceList = useMemo(() => {
    const initialAssignedIds = new Set(
      mode === "edit"
        ? initialValues?.eventOutsources
            ?.filter((o) => !o.isDeleted)
            .map((o) => String(o.outsourceId))
        : [],
    );

    const baseList =
      outsourceData?.map((o) => {
        const oId = String(o.outsourceId);
        let displayStatus = o.status;
        if (
          isSameSchedule &&
          initialAssignedIds.has(oId) &&
          o.status === "Unavailable"
        )
          displayStatus = "Available";
        return {
          id: oId,
          name: o.fullName,
          roles: [],
          status: displayStatus,
        };
      }) || [];

    // [SAFETY NET] สำหรับ Outsource (แก้ Bug F5)
    if (mode === "edit" && initialValues?.eventOutsources) {
      const existingIds = new Set(baseList.map((o) => o.id));
      initialValues.eventOutsources.forEach((assigned) => {
        if (assigned.isDeleted) return;
        const oId = String(assigned.outsourceId);
        if (!existingIds.has(oId)) {
          baseList.push({
            id: oId,
            name: assigned.fullName || `Outsource #${oId}`,
            roles: [],
            status: isSameSchedule ? "Available" : "Unavailable",
          });
        }
      });
    }
    return baseList;
  }, [outsourceData, mode, initialValues, isSameSchedule]);

  // --- UI Configuration ---
  const title = mode === "create" ? "Create Event" : "Edit Event";
  const subtitle =
    mode === "create" ? "Create a new Event" : "Update Event details";
  const saveLabel = mode === "create" ? "Create Event" : "Save Changes";
  const loadingLabel = mode === "create" ? "Creating..." : "Saving...";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        className="sticky top-0 z-10"
        title={title}
        subtitle={subtitle}
        backButton
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
          <Card className="mt-6">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="h-6 w-1.5 rounded-full bg-blue-600" /> Basic
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                      options={companiesOptions}
                      placeholder="Company"
                      onChange={(val) => field.handleChange(Number(val))}
                      value={field.state.value?.toString()}
                      icon={Building2}
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
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="h-6 w-1.5 rounded-full bg-blue-600" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="gap-6 md:grid-cols-2">
                <form.AppField
                  name="eventDate"
                  children={(field) => (
                    <field.DateField
                      label="Event Date"
                      onChange={(d) => handleDateChange(d as Date, field)}
                    />
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <form.AppField
                  name="staffAppointmentTime"
                  children={(field) => (
                    <field.TimeField label="Staff Appointment Time" />
                  )}
                />
                <form.AppField
                  name="outsourceAppointmentTime"
                  children={(field) => (
                    <field.TimeField label="Outsource Appointment Time" />
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <form.AppField
                  name="registrationTime"
                  children={(field) => (
                    <field.TimeField label="Registration Time" />
                  )}
                />
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
                  <field.PeriodSelectField
                    label="Period"
                    onChange={(val) => handlePeriodChange(val as number, field)}
                  />
                )}
              />
              <form.AppField
                name="address"
                children={(field) => (
                  <field.TextField
                    label="Address"
                    type="text"
                    placeholder="Ex. 123 Main St"
                  />
                )}
              />
              <form.AppField
                name="location"
                children={(field) => (
                  <field.LocationField label="Select Location" />
                )}
              />

              <AlertDialog open={dateAlertOpen} onOpenChange={setDateAlertOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Change Event Date?</AlertDialogTitle>
                    <AlertDialogDescription>
                      If you change the event date, all assigned resources will
                      be cleared.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setPendingDate(undefined)}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        if (pendingDate) {
                          form.setFieldValue("eventDate", pendingDate);
                          form.setFieldValue("eventStaff", []);
                          form.setFieldValue("eventOutsources", []);
                          form.setFieldValue("staffRequirements", []);
                          form.setFieldValue("outsourceRequirements", []);
                        }
                        setPendingDate(undefined);
                        setDateAlertOpen(false);
                      }}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Package</CardTitle>
            </CardHeader>
            <CardContent>
              <form.AppField
                name="packageId"
                children={(field) => (
                  <field.PackageEventField
                    packages={packagesData}
                    canEdit={false}
                    onChange={(newValue) => {
                      const numValue = Number(newValue);
                      const hasEquipment =
                        form.getFieldValue("eventExtraEquipments")?.length > 0;
                      if (numValue !== field.state.value && hasEquipment) {
                        setPendingPackage(newValue);
                        setAlertOpen(true);
                      } else {
                        field.handleChange(numValue);
                      }
                    }}
                  />
                )}
              />
              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Change Package?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setPendingPackage(null)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        if (pendingPackage !== null) {
                          form.setFieldValue(
                            "packageId",
                            Number(pendingPackage),
                          );
                          form.setFieldValue("eventExtraEquipments", []);
                        }
                        setPendingPackage(null);
                        setAlertOpen(false);
                      }}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog
                open={periodAlertOpen}
                onOpenChange={setPeriodAlertOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Change Event Period?</AlertDialogTitle>
                    <AlertDialogDescription>
                      If you change the event period, all assigned resources
                      will be cleared.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setPendingPeriod(undefined)}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        if (pendingPeriod) {
                          form.setFieldValue("timePeriod", pendingPeriod);
                          form.setFieldValue("eventStaff", []);
                          form.setFieldValue("eventOutsources", []);
                          form.setFieldValue("staffRequirements", []);
                          form.setFieldValue("outsourceRequirements", []);
                        }
                        setPendingPeriod(undefined);
                        setPeriodAlertOpen(false);
                      }}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-bold">
                Equipment
                {isLoadingPkg && (
                  <span className="ml-2 flex items-center text-xs font-normal text-gray-400">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
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
                    equipmentList={equipmentData}
                    packageItems={packageItems}
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Staff Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isResourceLocked ? (
                <div className="rounded-xl border-2 border-dashed bg-gray-50 py-10 text-center text-gray-400">
                  Please select Date and Period first.
                </div>
              ) : (
                <form.AppField
                  name="eventStaff"
                  children={(field) => (
                    <ResourceAssignmentBuilder
                      candidates={formattedStaffList}
                      availableRoles={roleData || []}
                      initialRequirements={form.state.values.staffRequirements}
                      idKey="staffId"
                      entityLabel="Staff"
                      value={field.state.value}
                      onChange={(data) => field.handleChange(data)}
                      onRequirementChange={(reqs) =>
                        form.setFieldValue(
                          "staffRequirements",
                          reqs.map((r) => ({ ...r, sourceType: 1 })),
                        )
                      }
                    />
                  )}
                />
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Outsource Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isResourceLocked ? (
                <div className="rounded-xl border-2 border-dashed bg-gray-50 py-10 text-center text-gray-400">
                  Please select Date and Period first.
                </div>
              ) : (
                <form.AppField
                  name="eventOutsources"
                  children={(field) => (
                    <ResourceAssignmentBuilder
                      candidates={formattedOutsourceList}
                      availableRoles={roleData || []}
                      initialRequirements={
                        form.state.values.outsourceRequirements
                      }
                      ignoreRoleValidation={true}
                      idKey="outsourceId"
                      entityLabel="Outsource"
                      value={field.state.value}
                      onChange={(data) => field.handleChange(data)}
                      onRequirementChange={(reqs) =>
                        form.setFieldValue(
                          "outsourceRequirements",
                          reqs.map((r) => ({ ...r, sourceType: 2 })),
                        )
                      }
                    />
                  )}
                />
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-600">
                  Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentExistingFiles.map((file) => (
                  <div
                    key={file.id}
                    className="bg-accent/30 flex items-center gap-2.5 rounded-md border p-3"
                  >
                    <FileText className="size-5 text-gray-500" />
                    <div className="min-w-0 flex-1">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-sm font-medium text-blue-600 hover:underline"
                      >
                        {file.fileName}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExisting(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <form.AppField
                  name="attachmentFiles"
                  children={(field) => (
                    <FileUpload
                      value={field.state.value}
                      onValueChange={(files) =>
                        field.handleChange(Array.isArray(files) ? files : [])
                      }
                    >
                      <FileUploadDropzone className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed">
                        <div className="text-center">
                          <UploadCloud
                            size={32}
                            className="mx-auto text-gray-400"
                          />
                          <p className="text-sm">Drag & Drop new files</p>
                        </div>
                      </FileUploadDropzone>
                      <FileUploadList>
                        {field.state.value?.map((file, i) => (
                          <FileUploadItem key={i} value={file}>
                            <FileUploadItemPreview />
                            <FileUploadItemMetadata />
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...field.state.value];
                                next.splice(i, 1);
                                field.handleChange(next);
                              }}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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
                <CardTitle className="text-lg font-bold text-gray-600">
                  Note
                </CardTitle>
              </CardHeader>
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
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
