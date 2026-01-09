import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StaffProfileFormFields from "@/components/AddStaffandOutsourceComponent/StaffProfileFormFields";

import { useMatch, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { staffByIdQuery } from "@/features/staff/api/getStaffById";

const API_URL = import.meta.env.VITE_API_URL;

export default function StaffForm() {
  const navigate = useNavigate();

  // ===============================
  // Route params (edit mode)
  // ===============================
  const editMatch = useMatch({
    from: "/staff/$staffId/edit",
    shouldThrow: false,
  });

  const staffId = editMatch?.params.staffId;
  const isEditMode = !!staffId;

  // ===============================
  // Fetch staff by id (EDIT only)
  // ===============================
const { data: staff, isLoading } = useQuery({
  ...staffByIdQuery(Number(staffId)),
  enabled: isEditMode,
});

  // ===============================
  // Form
  // ===============================
  const form = useForm({
    defaultValues: {
      avatar: null as File | null,
      fullName: "",
      email: "",
      phone: "",
      roles: [] as string[],
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditMode) {
          await fetch(`${API_URL}/api/Staff/${staffId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value),
          });
        } else {
          await fetch(`${API_URL}/api/Staff`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value),
          });
        }

        toast(isEditMode ? "Staff updated" : "Staff created", {
          position: "bottom-right",
        });

        navigate({ to: "/staff" });
      } catch (err) {
        toast("Something went wrong", {
          description: String(err),
        });
      }
    },
  });

  // ===============================
  // Fill form when editing
  // ===============================
  useEffect(() => {
    if (!staff) return;

    form.reset({
      avatar: null,
      fullName: staff.fullName,
      email: staff.email ?? "",
      phone: staff.phoneNumber ?? "",
      roles:
        staff.staffRoles
          ?.map((sr) => sr.role?.roleName)
          .filter(Boolean) ?? [],
    });
  }, [staff]);

  // ===============================
  // States
  // ===============================
  if (isEditMode && isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  if (isEditMode && !staff) {
    return <div className="p-10">Staff not found</div>;
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={isEditMode ? "Edit Staff" : "Add Staff"}
        countLabel={isEditMode ? "Edit Staff" : "Add Staff"}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>

            <Button size="add" type="submit" form="staff-form">
              <Save size={18} strokeWidth={2.5} />
              {isEditMode ? "Save Changes" : "Add Staff"}
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 max-w-6xl mx-auto w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1 rounded-full bg-blue-600" />
              Staff Information
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form
              id="staff-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            />

            <StaffProfileFormFields
              form={form}
              roleOptions={[
                "Host",
                "Technician",
                "Project Manager",
                "Coordinator",
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
