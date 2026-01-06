import * as React from "react";

import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { Save } from "lucide-react";
import { toast } from "sonner";

import PageHeader from "@/components/layout/PageHeader";
// import * as z from "zod";

import { Button } from "@/components/ui/button";
import { DEFAULT_PACKAGE_OFFLINE } from "@/data/hardcode";
import { parseCoordinates } from "@/lib/utils";
import type { EventFormSchema } from "@/types/event-form";

import { BasicInfoSection } from "./basic-info-section";
import { FilesSection } from "./files-section";
import { LocationSection } from "./location-section";
import { PackageSection } from "./package-section";
import { ScheduleSection } from "./schedule-section";

// const formSchema = z.object({ ... });

export default function CreateEvent() {
  const form = useForm({
    defaultValues: {
      event_name: "",
      company: "",
      event_type: "offline",
      note: "",
      date: undefined,
      start_time: "",
      end_time: "",
      time_period: "",
      location: "",
      latitude: null,
      longitude: null,
      package: DEFAULT_PACKAGE_OFFLINE,
      files: [],
    } as EventFormSchema,

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

      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 pb-20 lg:p-10">
        <form
          id="create-event-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-8"
        >
          <BasicInfoSection form={form} />
          <ScheduleSection form={form} />
          <LocationSection form={form} />
          <PackageSection form={form} />

          {/* Equipment */}
          {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1.5 rounded-full bg-blue-600" />
              Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EquipmentSection />
          </CardContent>
        </Card> */}

          {/** Staff*/}
          {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1 rounded-full bg-blue-600" />
              Staff Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StaffSection />
          </CardContent>
        </Card> */}

          <FilesSection form={form} />
        </form>
      </div>
    </div>
  );
}
