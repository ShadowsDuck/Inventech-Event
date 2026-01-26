import * as React from "react";

import { useForm } from "@tanstack/react-form";
import { Save } from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import type { EventFormType } from "@/types/event";

import EventForm from "./event-form";

// import { PackageSection } from "./create-sections/package-section";

export default function CreateEvent() {
  // --- Form State (คงไว้เพื่อให้ UI inputs ทำงานได้) ---
  const form = useForm({
    defaultValues: {
      eventId: 0,
      eventName: "",
      eventType: "Offline",
      meetingDate: "",
      registrationTime: "",
      startTime: "",
      endTime: "",
      period: "Morning",
      location: "",
      latitude: 0,
      longitude: 0,
      note: "",
      createdByStaffId: 0,
      companyId: 0,
      packageId: 0,
      eventAttachments: [],
      eventStaff: [],
      eventOutsources: [],
      eventExtraEquipments: [],
      newFiles: [],
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as EventFormType,

    onSubmit: async ({ value }) => {
      console.log("Form Submitted:", value);
    },
  });

  return <EventForm />;
}
