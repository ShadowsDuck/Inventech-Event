import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker } from "@/components/ui/date-picker";
import TimePicker from "@/components/ui/time-picker";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import FilterSelectCompany from "@/components/ui/filter-select-company";
import { TabEventType } from "@/components/ui/tab-event-type";

import { PageHeader } from "../components/layout/PageHeader";
import { Save } from "lucide-react";

// const formSchema = z.object({ ... });

export default function CreateEvent() {
  const form = useForm({
    defaultValues: {
      title: "",
      company: "",
      type: "offline",
    },
    // validators: {
    //   onSubmit: formSchema,
    // },
    onSubmit: async ({ value }) => {
      toast("You submitted the following values:", {
        description: (
          <pre className="bg-black text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>{JSON.stringify(value, null, 2)}</code>
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
      {/* 🔹 Header ด้านบน พร้อมปุ่ม Reset + Create Event */}
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
            <Button
              size="add"
              type="submit"
              form="create-event-form"
            >
              <Save size={18} strokeWidth={2.5} />
              Create Event
            </Button>
          </div>
        }
      />

      {/* 🔹 เนื้อหา + ฟอร์ม */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 max-w-6xl mx-auto w-full space-y-8 pb-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
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
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                              placeholder="Login button not working on mobile"
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
                        field.state.meta.isTouched &&
                        !field.state.meta.isValid;
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
                        field.state.meta.isTouched &&
                        !field.state.meta.isValid;
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
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* ใส่อะไรก็ได้ตามที่อยากเพิ่มต่อ เช่น textarea / date / time */}
            <FieldGroup>
              <section className="md:grid-cols-2 gap-8">
                <Field>
                  <FieldLabel htmlFor="Event Shedule">
                    MeetingDate
                  </FieldLabel>
                  <DatePicker
                  />
                </Field>
              </section>
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field>
                  <FieldLabel htmlFor="StarTime">
                    Start Time
                  </FieldLabel>
                  <TimePicker
                  
                  />                    
                </Field>
                <Field>
                  <FieldLabel htmlFor="StarTime">
                    End Time
                  </FieldLabel>
                  <TimePicker 
                  
                  />                    
                </Field>
              </section>  
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
              Package 
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* ใส่อะไรก็ได้ตามที่อยากเพิ่มต่อ เช่น textarea / date / time */}
            <FieldGroup>
              <section className="md:grid-cols-2 gap-8">
                <Field>
                  <FieldLabel htmlFor="Event Shedule">
                    MeetingDate
                  </FieldLabel>
                  <DatePicker
                  />
                </Field>
              </section>
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field>
                  <FieldLabel htmlFor="StarTime">
                    Start Time
                  </FieldLabel>
                  <TimePicker
                  
                  />                    
                </Field>
                <Field>
                  <FieldLabel htmlFor="StarTime">
                    End Time
                  </FieldLabel>
                  <TimePicker 
                  
                  />                    
                </Field>
              </section>  
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
