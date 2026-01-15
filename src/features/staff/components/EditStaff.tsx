import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { formatPhoneNumberDisplay, formatPhoneNumberInput } from "@/lib/format";
import { Route } from "@/routes/staff/$staffId/edit";

import { staffByIdQuery } from "../api/getStaffById";
import { useUpdateStaff } from "../api/updateStaff";
import { type StaffFormData, StaffForm } from "./staff-form";

export default function EditStaff() {
  const navigate = useNavigate();
  const { staffId } = Route.useParams();
  const numericStaffId = Number(staffId);

  const { data: staffData } = useSuspenseQuery(staffByIdQuery(numericStaffId));
  const { mutate, isPending: isSaving } = useUpdateStaff();

  if (!staffData) {
    return <div className="p-10 text-center">Staff not found</div>;
  }

  // --- 1. Map ค่าจาก DB -> Form ---
  const initialValues: StaffFormData = {
    fullName: staffData.fullName,
    email: staffData.email ?? "",
    phoneNumber: formatPhoneNumberDisplay(staffData.phoneNumber) ?? "",
    roles: staffData.staffRoles?.map((r: any) => r.roleId.toString()) ?? [],
    
    // เพิ่ม: ดึงค่า isDeleted เดิมมาแสดง
    isDeleted: staffData.isDeleted ?? false, 
  };

  const handleEditSubmit = (values: StaffFormData) => {
    
    // --- 2. Map ค่าจาก Form -> API Payload ---
    const payload = {
      id: numericStaffId,
      staffId: numericStaffId,
      fullName: values.fullName,
      email: values.email || undefined,
      phoneNumber: formatPhoneNumberInput(values.phoneNumber ?? "") || undefined,
      roleIds: values.roles.map((id) => Number(id)),

      // เพิ่ม: ส่งค่า isDeleted กลับไปที่ Backend (ถ้า undefined ให้เป็น false)
      isDeleted: values.isDeleted ?? false, 
    };

    console.log("Submitting Update Payload:", payload);

    mutate(payload, {
      onSuccess: () => {
        navigate({ to: ".." });
      },
      onError: (error) => {
        console.error("Update failed:", error);
      }
    });
  };

  return (
    <StaffForm
      mode="edit"
      isPending={isSaving}
      initialValues={initialValues}
      onSubmit={handleEditSubmit}
      onCancel={() => navigate({ to: ".." })}
    />
  );
}