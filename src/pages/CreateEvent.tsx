import * as React from "react";

import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { Moon, Save, Sun } from "lucide-react";
import { CheckCircle2, Package as PackageIcon } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

import { EquipmentSection } from "@/components/CreateEventComponents/equipment-section";
import StaffSection from "@/components/CreateEventComponents/staff-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import Dropzone from "@/components/ui/dropzone";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import FilterSelectCompany from "@/components/ui/filter-select-company";
import { Input } from "@/components/ui/input";
import { TabEventType } from "@/components/ui/tab-event-type";
import { cn } from "@/lib/utils";

import { PageHeader } from "../components/layout/PageHeader";

// const formSchema = z.object({ ... });

export default function CreateEvent() {
  const form = useForm({
    defaultValues: {
      title: "",
      company: "",
      type: "offline",
      date: undefined as Date | undefined,
      start_time: "",
      end_time: "",
      time_period: "",
      attachments: [] as File[],
      note: "",
      location: "",
    },
    // validators: {
    //   onSubmit: formSchema,
    // },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        date: value.date ? format(value.date, "yyyy-MM-dd") : null,
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
  const [timePeriod, setTimePeriod] = React.useState<"morning" | "afternoon">(
    "afternoon",
  );

  const packages = [
    {
      id: "premium",
      name: "Premium Event Package",
      highlight: "7 items included",
      items: [
        "4x Wireless Microphones",
        "2x HD Projectors (4K Ready)",
        "2x MacBook Pro Laptops",
        "1x Professional Sound System",
      ],
      moreText: "+ 3 more items",
      autoSelected: true,
    },
    {
      id: "standard",
      name: "Standard Conference",
      highlight: "5 items included",
      items: [
        "2x Wireless Microphones",
        "1x HD Projector",
        "2x Laptops",
        "1x LED Screen 3×2m",
      ],
      moreText: "+ 1 more item",
      autoSelected: false,
    },
  ];

  const [selectedPackage, setSelectedPackage] =
    React.useState<string>("premium");

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
                            onChange={field.handleChange}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
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
                  <form.Field
                    name="time_period"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Time Period
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
                </section>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1 rounded-full bg-blue-600" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full min-w-0 p-4 md:p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* ซ้าย: กรอกที่อยู่ */}
              <form.Field name="location">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} className="min-w-0">
                      <FieldLabel htmlFor={field.name} className="mb-1">
                        Address
                      </FieldLabel>

                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. ICONSIAM Bangkok"
                        aria-invalid={isInvalid}
                      />

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      <p className="mt-2 text-xs text-gray-500">
                        Tip: พิมพ์ชื่อสถานที่/ที่อยู่ แล้วแผนที่จะอัปเดตเอง
                      </p>
                    </Field>
                  );
                }}
              </form.Field>

              {/* Map */}
              <div className="min-w-0">
                <div className="mb-1 text-sm font-medium text-gray-900">
                  Map Preview
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <form.Subscribe
                    selector={(state) => state.values.location}
                    children={(location) => {
                      const q = (location?.trim() || "Bangkok").toString();
                      const src = `https://www.google.com/maps?q=${encodeURIComponent(
                        q,
                      )}&output=embed`;

                      return (
                        <iframe
                          title="map"
                          className="h-[260px] w-full"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          src={src}
                        />
                      );
                    }}
                  />
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  ถ้าพิมพ์กว้าง ๆ เช่น “CentralWorld” มันจะเดาให้ — ถ้าอยากแม่น
                  ให้ใส่ “ชื่อ + เมือง”
                </div>
              </div>
            </div>
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
            {/* ใส่อะไรก็ได้ตามที่อยากเพิ่มต่อ เช่น textarea / date / time */}
            <FieldGroup>
              <FieldGroup>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {packages.map((pkg) => {
                    const isActive = selectedPackage === pkg.id;

                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={cn(
                          "relative flex h-full w-full flex-col rounded-2xl border px-6 py-5 text-left transition",
                          "bg-slate-50",
                          isActive
                            ? "border-indigo-400 ring-2 ring-indigo-400/50"
                            : "border-slate-100 text-slate-400 hover:border-indigo-200 hover:bg-indigo-50/40",
                        )}
                      >
                        {/* badge Auto-Selected มุมขวาบน */}
                        {isActive && pkg.autoSelected && (
                          <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                            <CheckCircle2 className="h-3 w-3" />
                            Auto-Selected
                          </span>
                        )}

                        {/* icon กล่องมุมซ้ายบน */}
                        <div
                          className={cn(
                            "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl",
                            isActive
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-slate-100 text-slate-300",
                          )}
                        >
                          <PackageIcon className="h-7 w-7" />
                        </div>

                        {/* ชื่อแพ็กเกจ */}
                        <h3
                          className={cn(
                            "text-lg font-semibold",
                            isActive ? "text-slate-900" : "text-slate-400",
                          )}
                        >
                          {pkg.name}
                        </h3>

                        {/* จำนวน item */}
                        <p
                          className={cn(
                            "mt-1 text-sm",
                            isActive ? "text-slate-500" : "text-slate-300",
                          )}
                        >
                          {pkg.highlight}
                        </p>

                        {/* รายการอุปกรณ์ */}
                        <ul className="mt-4 space-y-1 text-sm">
                          {pkg.items.map((item) => (
                            <li
                              key={item}
                              className={cn(
                                "flex items-start gap-2",
                                isActive ? "text-slate-700" : "text-slate-300",
                              )}
                            >
                              <span
                                className={cn(
                                  "mt-1 h-1.5 w-1.5 rounded-full",
                                  isActive ? "bg-indigo-400" : "bg-slate-300",
                                )}
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        {/* ข้อความ more */}
                        <p
                          className={cn(
                            "mt-3 text-sm italic",
                            isActive ? "text-indigo-500" : "text-slate-300",
                          )}
                        >
                          {pkg.moreText}
                        </p>

                        {/* ปุ่มลูกศรด้านขวา สำหรับการ์ดที่ยังไม่ active */}
                        {/* {!isActive && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              )} */}
                      </button>
                    );
                  })}
                </div>
              </FieldGroup>
            </FieldGroup>
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/*Files & Documents*/}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="h-6 w-1 rounded-full bg-blue-600" />
                File and Document
              </CardTitle>
            </CardHeader>

            <CardContent className="w-full min-w-0 p-4 md:p-6">
              <form.Field name="attachments">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} className="min-w-0">
                      <Dropzone
                        value={field.state.value ?? []}
                        onChange={field.handleChange}
                        isInvalid={isInvalid}
                        accept="image/*,.pdf"
                        maxSizeMB={10}
                        multiple
                        placeholder="Drop files here or click to upload"
                      />

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </CardContent>
          </Card>

          {/** Note */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="h-6 w-1 rounded-full bg-blue-600" />
                Note
              </CardTitle>
            </CardHeader>

            <CardContent className="w-full min-w-0 p-4 md:p-6">
              <form.Field name="note">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid} className="min-w-0">
                      <textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Write notes here..."
                        className={cn(
                          "min-h-[140px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm",
                          "outline-none focus:border-blue-500",
                          isInvalid && "border-destructive",
                        )}
                      />

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
