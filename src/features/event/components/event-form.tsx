import { useMemo, useState } from "react";

import { revalidateLogic } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { UploadCloud } from "lucide-react";
import z, { file } from "zod";

import { useAppForm } from "@/components/form";
import { CreateFormButton } from "@/components/form/ui/create-form-button";
import { ResetFormButton } from "@/components/form/ui/reset-form-button";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload, FileUploadDropzone } from "@/components/ui/file-upload";
import { Textarea } from "@/components/ui/textarea";

import { companiesQueries } from "../api/getCompany";

const EventSchema = z.object({
  eventName: z
    .string()
    .min(1, "Event name is required")
    .max(255, "Event name must be between 1 and 255 characters"),
  eventDate: z.date().min(new Date(), "Event date must be in the future"),
  Company: z.string().min(1, "Please select at least one company"),
  eventType: z.string(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  timePeriod: z.string(),

  file: z.instanceof(File).optional(),
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
  const [resetKey, setResetKey] = useState(0);
  const { data: companiesData } = useSuspenseQuery(companiesQueries());

  const companiesOptions = useMemo(() => {
    return companiesData?.map((company) => ({
      value: company.companyId.toString(),
      label: company.companyName,
    }));
  }, [companiesData]);

  const defaultValues: EventData = {
    eventName: initialValues?.eventName || "",
    Company: initialValues?.Company || "",
    eventType: initialValues?.eventType || "",
    eventDate: initialValues?.eventDate || new Date(),
    startTime: initialValues?.startTime || "",
    endTime: initialValues?.endTime || "",
    timePeriod: initialValues?.timePeriod || "",
  };

  const form = useAppForm({
    defaultValues,
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

  // --- UI Labels ---
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
                {/*Event Name */}
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
                {/*Company */}
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
                  {/*Event type */}
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
          {/*Schedule */}
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
              {/*Start Time & End Time */}
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
              </section>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-bold text-gray-600">
                Package
              </CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-bold text-gray-600">
                Equipment
              </CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-bold text-gray-600">
                Staff Management
              </CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-bold text-gray-600">
                Outsource Management
              </CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-bold text-gray-600">
                Venue Management
              </CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>

          {/*File upload & Note */}
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
                  <Textarea
                    className="mt-6 h-64 w-full rounded-2xl rounded-md border border-gray-300 bg-gray-50 p-2 text-gray-600"
                    placeholder="Enter note..."
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
