import { revalidateLogic } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Mail, Phone, Save, User } from "lucide-react";
import z from "zod"; // ลบ { number } ออก เพราะไม่ได้ใช้จาก zod

import { useAppForm } from "@/components/form";
import { MultiSelectField } from "@/components/form/multiselect-field";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCreateStaff } from "../api/createStaff";
import { roleQuery } from "../api/getRole";

const StaffSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name should be at least 2 characters.")
    .max(255, "Full name should not exceed 255 characters."),
  email: z.email().optional().or(z.literal("")),
  phoneNumber: z
    .string()
    .regex(/^0/, "The phone number must start with 0")
    .min(10, "Invalid phone number")
    .max(12, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  roles: z.array(z.string()).min(1, "Please select at least one role."),
});

type CreateStaffInput = z.infer<typeof StaffSchema>;

export default function AddStaff() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateStaff();

  const { data: rolesData } = useSuspenseQuery(roleQuery());

  const roleOptions = rolesData.map((role) => ({
    label: role.roleName,
    value: role.roleId.toString(),
  }));

  const form = useAppForm({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      roles: [],
    } as CreateStaffInput,
    validators: {
      onChange: StaffSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
    onSubmit: async ({ value }) => {
      // --- จุดที่แก้ไข (TRANSFORM DATA) ---
      
      const payload = {
        fullName: value.fullName,
        // ถ้าเป็น string ว่างให้ส่ง undefined (API จะได้ไม่ validate format email)
        email: value.email || undefined, 
        // ตัดขีดออกจากเบอร์โทร
        phoneNumber: value.phoneNumber?.replace(/-/g, "") || undefined,
        
        // แปลง Array String ["1", "2"] -> Array Number [1, 2]
        // และส่งด้วยชื่อ field "roleIds" ตามที่ Backend (.NET) มักจะต้องการ
        roleIds: value.roles.map((id) => Number(id)), 
      };

      console.log("Payload to API:", payload); 

      mutate(payload, {
        onSuccess: () => {
          navigate({ to: ".." });
        },
      });
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Add New Staff"
        subtitle="Create profile and invite to team"
        backButton={true}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isPending}
            >
              Reset
            </Button>
            <Button
              size="add"
              type="submit"
              form="add-staff-form"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} strokeWidth={2.5} />
              )}
              {isPending ? "Adding..." : "Add Staff"}
            </Button>
          </div>
        }
      />

      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 lg:p-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1 rounded-full bg-blue-600" />
              Staff Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="add-staff-form"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
              noValidate
            >
              <form.AppField
                name="fullName"
                children={(field) => (
                  <field.TextField
                    label="Full Name"
                    type="text"
                    placeholder="e.g. Somchai Jaidee"
                    startIcon={User}
                    required
                  />
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <form.AppField
                  name="email"
                  children={(field) => (
                    <field.TextField
                      label="Email Address"
                      type="email"
                      placeholder="staff@inventecvt.com"
                      startIcon={Mail}
                    />
                  )}
                />

                <form.AppField
                  name="phoneNumber"
                  children={(field) => (
                    <field.TextField
                      label="Phone Number"
                      type="tel"
                      placeholder="081-234-5678"
                      startIcon={Phone}
                    />
                  )}
                />
              </div>

              {/* Roles MultiSelect */}
              <form.AppField
                name="roles"
                children={(field) => (
                  <MultiSelectField
                    label="Roles"
                    options={roleOptions}
                    placeholder="Select roles"
                    required
                  />
                )}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}