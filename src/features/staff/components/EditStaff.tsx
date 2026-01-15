import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { formatPhoneNumberDisplay, formatPhoneNumberInput } from "@/lib/format";
import { Route } from "@/routes/staff/$staffId/edit";

import { staffByIdQuery } from "../api/getStaffById";
import { useUpdateStaff } from "../api/updateStaff";
import { StaffForm, type StaffFormData } from "./staff-form";

export default function EditStaff() {
  const navigate = useNavigate();

  const { staffId } = Route.useParams();
  const numericStaffId = Number(staffId);
  const { data: staffData } = useSuspenseQuery(staffByIdQuery(numericStaffId));
  const { mutate, isPending: isSaving } = useUpdateStaff();



  if (!staffData) {
    return <div className="p-10 text-center">Staff not found</div>;
  }

  const initialValues: StaffFormData = {
    fullName: staffData.fullName,
    email: staffData.email ?? "",
    phoneNumber: formatPhoneNumberDisplay(staffData.phoneNumber) ?? "",
    isDeleted: staffData.isDeleted ?? false,
    roles: staffData.staffRoles?.map((r) => r.roleId.toString()) ?? [],
    avatar: staffData.avatar
  };

  const handleEditSubmit = (values: StaffFormData) => {
    const newAvatarFile = values.avatar instanceof File ? values.avatar : undefined;


    const payload = {
      id: numericStaffId,
      staffId: numericStaffId,
      fullName: values.fullName,
      email: values.email || undefined,
      isDeleted: values.isDeleted ?? false,
      phoneNumber:
        formatPhoneNumberInput(values.phoneNumber ?? "") || undefined,

      roleIds: values.roles.map((id) => String(id)),
      avatar: newAvatarFile,
    };

    console.log("Submitting Update Payload:", payload);

    mutate(payload, {
      onSuccess: () => {
        navigate({ to: "/staff" });
      },
      onError: (error) => {
        console.error("Update failed:", error);
      },
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
