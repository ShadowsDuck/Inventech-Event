import { useMemo, useState } from "react";

import { useStore } from "@tanstack/react-form";
import { useQuery, useSuspenseQueries } from "@tanstack/react-query";
import { FileText, Loader2, Trash2, UploadCloud } from "lucide-react";

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
import type { CompanyType } from "@/types/company";
import type { EquipmentType } from "@/types/equipment";
import type { ExistingFileType } from "@/types/event";
import type { OutsourceType } from "@/types/outsource";
import type { PackageType } from "@/types/package";
import type { StaffType } from "@/types/staff";

import { equipmentBypackageIdQuery } from "../api/getEquipmentByPackageId";
import { type EventData, getEventSchema } from "./event-schema";

// --- Sub-Schemas ---
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

  // --- State สำหรับจัดการไฟล์เดิม ---
  const [currentExistingFiles, setCurrentExistingFiles] =
    useState(existingFiles);
  const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);

  // Function ลบไฟล์เดิม
  const handleRemoveExisting = (fileId: number) => {
    setCurrentExistingFiles((prev) => prev.filter((f) => f.id !== fileId));
    setDeletedFileIds((prev) => [...prev, fileId]);
  };

  // 1. Load Data
  const [
    { data: roleData },
    { data: companiesData },
    { data: staffData },
    { data: outsourceData },
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
        ...staffQuery(),
        select: (data: StaffType[]) => data.filter((s) => !s.isDeleted),
      },
      {
        ...outsourcesQuery(),
        select: (data: OutsourceType[]) => data.filter((s) => !s.isDeleted),
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
    validators: {
      onChange: getEventSchema(mode),
    },
    onSubmit: async ({ value }) => {
      // ส่งค่า deletedFileIds ออกไปด้วย
      onSubmit(value, deletedFileIds, currentExistingFiles);
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

  //LockStaff And Outsource
  const currentEventDate = useStore(
    form.store,
    (state) => state.values.eventDate,
  );
  const currentTimePeriod = useStore(
    form.store,
    (state) => state.values.timePeriod,
  );
  const isResourceLocked =
    !currentEventDate || !currentTimePeriod || currentTimePeriod === 0;

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
                        onChange={(val) => field.handleChange(Number(val))}
                        value={field.state.value?.toString()}
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
                    canEdit={false}
                    onChange={(newValue) => {
                      const numValue = Number(newValue);
                      const currentEquipment = field.form.getFieldValue(
                        "eventExtraEquipments",
                      );
                      const hasEquipment =
                        currentEquipment && currentEquipment.length > 0;

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
              {isResourceLocked ? (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-10">
                  <span className="font-medium text-gray-500">
                    Please select an Event Date and Period first.
                  </span>
                  <span className="mt-1 text-sm text-gray-400">
                    You must set the schedule before assigning staff.
                  </span>
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
                      // รับค่า Quota Staff (SourceType = 1)
                      onRequirementChange={(reqs) => {
                        // ใช้ form.setFieldValue อัปเดต state เบื้องหลัง
                        form.setFieldValue(
                          "staffRequirements",
                          reqs.map((r) => ({
                            roleId: r.roleId,
                            quantity: r.quantity,
                            sourceType: 1, // Internal Staff
                          })),
                        );
                      }}
                    />
                  )}
                />
              )}
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
              {isResourceLocked ? (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-10">
                  <span className="font-medium text-gray-500">
                    Please select an Event Date and Period first.
                  </span>
                  <span className="mt-1 text-sm text-gray-400">
                    You must set the schedule before assigning outsource.
                  </span>
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
                      // รับค่า Quota Outsource (SourceType = 2)
                      onRequirementChange={(reqs) => {
                        form.setFieldValue(
                          "outsourceRequirements",
                          reqs.map((r) => ({
                            roleId: r.roleId,
                            quantity: r.quantity,
                            sourceType: 2, // Outsource
                          })),
                        );
                      }}
                    />
                  )}
                />
              )}
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
                <div className="flex flex-col gap-4">
                  {/* --- [NEW] Section แสดงไฟล์เดิม --- */}
                  {currentExistingFiles.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Existing Files
                      </label>
                      {currentExistingFiles.map((file) => (
                        <div
                          key={file.id}
                          className="bg-accent/30 relative flex items-center gap-2.5 rounded-md border p-3"
                        >
                          <div className="bg-accent/50 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border text-gray-500">
                            <FileText className="size-5" />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="truncate text-sm font-medium text-blue-600 hover:underline"
                            >
                              {file.fileName}
                            </a>
                            <span className="text-muted-foreground text-xs">
                              Stored in Server
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExisting(file.id)}
                            className="p-1 text-red-500 transition-colors hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* --- Section Upload ไฟล์ใหม่ (Logic เดิม) --- */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Upload New Files
                    </label>
                    <form.AppField
                      name="attachmentFiles"
                      children={(field) => (
                        <FileUpload
                          value={field.state.value}
                          onValueChange={(files) => {
                            if (Array.isArray(files)) {
                              field.handleChange(files);
                            } else {
                              field.handleChange([]);
                            }
                          }}
                        >
                          <FileUploadDropzone className="text-black-500 mb-4 flex h-32 items-center justify-center rounded-2xl transition-colors group-hover:bg-blue-200 group-hover:text-blue-600">
                            <div className="flex flex-col items-center justify-center">
                              <UploadCloud size={32} color="gray" />
                              <p className="mt-2 text-sm text-gray-600">
                                Drag & Drop new files here
                              </p>
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
                  </div>
                </div>
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
