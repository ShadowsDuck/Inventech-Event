import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { formatPhoneNumberDisplay, formatPhoneNumberInput } from "@/lib/format";
import { Route } from "@/routes/staff/$staffId/edit";

import { staffByIdQuery } from "../api/getStaffById";
import { useUpdateStaff } from "../api/updateStaff";
import { type StaffData, StaffForm } from "./staff-form";

export default function EditStaff() {
  const navigate = useNavigate();

  const { staffId } = Route.useParams();
  const { data: staffData } = useSuspenseQuery(staffByIdQuery(staffId));
  const { mutate, isPending: isSaving } = useUpdateStaff();

  if (!staffData) {
    return <div className="p-10 text-center">Staff not found</div>;
  }

  const initialValues: StaffData = {
    fullName: staffData.fullName,
    email: staffData.email ?? "",
    phoneNumber: formatPhoneNumberDisplay(staffData.phoneNumber) ?? "",
    isDeleted: staffData.isDeleted ?? false,
    roles: staffData.staffRoles?.map((r) => r.roleId.toString()) ?? [],
    avatar: staffData.avatar,
  };

  const handleEditSubmit = (values: StaffData) => {
    // ถ้า avatar เป็น null แสดงว่าผู้ใช้กดลบรูป
    const shouldDelete = values.avatar === null;

    // ถ้า avatar เป็น File แสดงว่ามีไฟล์ใหม่
    const newAvatarFile =
      values.avatar instanceof File ? values.avatar : undefined;

    const payload = {
      id: staffId,
      staffId: parseInt(staffId),
      fullName: values.fullName,
      email: values.email || undefined,
      isDeleted: values.isDeleted ?? false,
      phoneNumber:
        formatPhoneNumberInput(values.phoneNumber ?? "") || undefined,
      roles: values.roles.map((id) => String(id)),
      avatar: newAvatarFile,
      deleteAvatar: shouldDelete,
    };

    mutate(payload, {
      onSuccess: () => {
        navigate({ to: "/staff", replace: true });
      },
    });
  };

  return (
    <StaffForm
      mode="edit"
      isPending={isSaving}
      initialValues={initialValues}
      onSubmit={handleEditSubmit}
    />
  );
}
