import * as React from "react";

import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { Save } from "lucide-react";
import { toast } from "sonner";

// import * as z from "zod";

import { EquipmentSection } from "@/components/CreateEventComponents/equipment-section";
import StaffSection from "@/components/CreateEventComponents/staff-section";
import { LocationPicker } from "@/components/form/location-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CarouselPackage from "@/components/ui/carousel-package";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { FileUploader } from "@/components/ui/file-uploader";
import FilterSelectCompany from "@/components/ui/filter-select-company";
import { Input } from "@/components/ui/input";
import SelectPeriod from "@/components/ui/select-period";
import { TabEventType } from "@/components/ui/tab-event-type";
import { Textarea } from "@/components/ui/textarea";
import { parseCoordinates } from "@/lib/utils";

import { PageHeader } from "../components/layout/PageHeader";

// const formSchema = z.object({ ... });

const DEFAULT_PACKAGE = "p1";

export default function CreateEvent() {
  const form = useForm({
    defaultValues: {
      title: "",
      company: "",
      type: "offline",
      note: "",
      date: undefined as Date | undefined,
      start_time: "",
      end_time: "",
      time_period: "",
      location: "",
      package: DEFAULT_PACKAGE,
      files: [] as File[],
    },
    // validators: {
    //   onSubmit: formSchema,
    // },
    onSubmit: async ({ value }) => {
      const coords = parseCoordinates(value.location);

      // แปลง File Object เป็น Object ธรรมดา เพื่อให้มองเห็นใน JSON
      const filesForDisplay = value.files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));

      const payload = {
        ...value,
        date: value.date ? format(value.date, "yyyy-MM-dd") : null,
        location: undefined,
        latitude: coords ? coords[0] : null,
        longitude: coords ? coords[1] : null,
        files: filesForDisplay,
      };

      toast("You submitted the following values:", {
        description: (
          <pre className="text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md bg-black p-4">
            <code>{JSON.stringify(payload, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      });
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Create Event"
        countLabel="Create Event"
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button size="add" type="submit" form="create-event-form">
              <Save size={18} strokeWidth={2.5} />
              Create Event
            </Button>
          </div>
        }
      />

      {/* เนื้อหา + ฟอร์ม */}
      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 pb-20 lg:p-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1.5 rounded-full bg-blue-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="create-event-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* Event Name */}
                  <div className="md:col-span-2">
                    <form.Field
                      name="title"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Event Name
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="Enter event name..."
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />
                  </div>

                  {/* Company */}
                  <form.Field name="company">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Company</FieldLabel>
                          <FilterSelectCompany
                            value={field.state.value}
                            onChange={field.handleChange}
                            isInvalid={isInvalid}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  {/* Event Type */}
                  <form.Field
                    name="type"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Event Type
                          </FieldLabel>
                          <TabEventType
                            value={field.state.value}
                            onChange={(val) => {
                              field.handleChange(val);

                              if (val === "offline") {
                                form.setFieldValue("package", DEFAULT_PACKAGE);
                              } else {
                                form.setFieldValue("package", "");
                              }
                            }}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  {/* Note */}
                  <div className="md:col-span-2">
                    <form.Field
                      name="note"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Note</FieldLabel>
                            <Textarea
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="Write note here..."
                              className="min-h-32"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />
                  </div>
                </section>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/*Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1.5 rounded-full bg-blue-600" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="create-event-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* Meeting Date */}
                  <div className="md:col-span-2">
                    <form.Field
                      name="date"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Meeting Date
                            </FieldLabel>
                            <DatePicker
                              value={field.state.value}
                              onChange={(date) => field.handleChange(date)}
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />
                  </div>

                  {/* Start Time */}
                  <form.Field
                    name="start_time"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Start Time
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Enter start time..."
                            autoComplete="off"
                            type="time"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  {/* End Time */}
                  <form.Field
                    name="end_time"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>End Time</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Enter end time..."
                            autoComplete="off"
                            type="time"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  {/* Time Period */}
                  <div className="md:col-span-2">
                    <form.Field
                      name="time_period"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Time Period
                            </FieldLabel>
                            <SelectPeriod
                              value={field.state.value}
                              onChange={field.handleChange}
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />
                  </div>
                </section>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1.5 rounded-full bg-blue-600" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="create-event-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field
                  name="location"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Venue Location
                        </FieldLabel>
                        <LocationPicker
                          value={field.state.value}
                          onChange={field.handleChange}
                          onBlur={field.handleBlur}
                          error={isInvalid ? "true" : undefined}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}

                        <p className="text-muted-foreground mt-2 text-xs">
                          Enter coordinates in "latitude, longitude" format and
                          click the pin icon.
                        </p>
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Package*/}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1.5 rounded-full bg-blue-600" />
              Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="create-event-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                {/* 1. เรียกใช้ Subscribe เพื่อดักฟังค่า 'type' */}
                <form.Subscribe
                  selector={(state) => state.values.type} // เลือกฟังเฉพาะค่า type
                  children={(eventType) => {
                    //2. คำนวณ logic ตรงนี้
                    const isLocked = eventType === "offline";

                    return (
                      <form.Field
                        name="package"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel
                                htmlFor={field.name}
                                className="-mb-3"
                              />
                              <CarouselPackage
                                value={field.state.value}
                                onChange={field.handleChange}
                                disabled={isLocked}
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />
                    );
                  }}
                />
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Equipment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1.5 rounded-full bg-blue-600" />
              Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EquipmentSection />
          </CardContent>
        </Card>

        {/** Staff*/}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1 rounded-full bg-blue-600" />
              Staff Management
            </CardTitle>
          </CardHeader>

          {/* ลด padding ให้กว้างขึ้น (เลือกใช้ตามชอบ) */}
          <CardContent>
            <StaffSection />
          </CardContent>
        </Card>

        {/*Files & Documents*/}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1 rounded-full bg-blue-600" />
              Files & Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="create-event-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field
                  name="files"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name} className="-mb-3" />
                        <FileUploader
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
