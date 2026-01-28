import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { cleanPhoneNumber, formatPhoneNumberInput } from "@/lib/format";
import { Route } from "@/routes/staff/$staffId/edit";

import { staffByIdQuery } from "../../api/getStaffById";
import { useUpdateStaff } from "../../api/updateStaff";
import { type StaffData, StaffForm } from "../staff-form";

export default function EditStaff() {
  const navigate = useNavigate();

  const { staffId } = Route.useParams();
  const { data: staffData } = useSuspenseQuery(staffByIdQuery(staffId));
  const { mutate, isPending: isSaving } = useUpdateStaff();

  // แปลงจาก DB -> Form
  const initialValues: StaffData = {
    fullName: staffData.fullName,
    email: staffData.email ?? "",
    phoneNumber: formatPhoneNumberInput(staffData.phoneNumber ?? ""),
    isDeleted: staffData.isDeleted,
    staffRoles: staffData.staffRoles?.map((sr) => sr.roleId) ?? [],
    avatar: staffData.avatar,
  };

  // แปลงจาก Form -> DB
  const handleEditSubmit = (values: StaffData) => {
    // ถ้า avatar เป็น null แสดงว่าผู้ใช้กดลบรูป
    const shouldDelete = values.avatar === null;

    // ถ้า avatar เป็น File แสดงว่ามีไฟล์ใหม่
    const newAvatarFile =
      values.avatar instanceof File ? values.avatar : undefined;

    const payload = {
      ...values,
      id: staffId,
      phoneNumber: cleanPhoneNumber(
        values.phoneNumber ? values.phoneNumber : "",
      ),
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
