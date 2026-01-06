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
import { useEffect, useMemo } from "react";
import { STAFF_DATA } from "@/data/constants";

export default function StaffForm() {
  const navigate = useNavigate();

  // ✅ ดึง id เฉพาะตอนอยู่ route edit
  const editMatch = useMatch({
    from: "/staff/$staffId/edit",
    shouldThrow: false,
  });

  const staffId = editMatch?.params.staffId;
  const isEditMode = !!staffId;

  // ✅ หา staff
  const staff = useMemo(() => {
    if (!isEditMode) return null;
    return STAFF_DATA.find((s) => s.id === staffId) ?? null;
  }, [staffId, isEditMode]);

  const form = useForm({
    defaultValues: {
      avatar: null as File | null,
      fullName: "",
      email: "",
      phone: "",
      roles: [] as string[],
    },
    onSubmit: async ({ value }) => {
      if (isEditMode) {
        console.log("UPDATE STAFF", staffId, value);
      } else {
        console.log("CREATE STAFF", value);
      }

      toast(isEditMode ? "Staff updated" : "Staff created", {
        description: (
          <pre className="bg-black text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
      });

      navigate({ to: "/staff" });
    },
  });

  // ✅ เติมข้อมูลเข้า form ตอน Edit
  useEffect(() => {
    if (!staff) return;

    form.reset({
      avatar: null,
      fullName: staff.name,
      email: staff.email,
      phone: staff.phone,
      roles: staff.roles,
    });
  }, [staff]);

  // ❌ กรณี id ผิด
  if (isEditMode && !staff) {
    return <div className="p-10">Staff not found</div>;
  }

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
