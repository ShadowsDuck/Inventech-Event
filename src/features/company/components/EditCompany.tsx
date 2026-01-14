import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { Route } from "@/routes/company/$companyId/edit";

import { companyQuery } from "../api/getCompany";
import { useUpdateCompany } from "../api/updateCompany";
import { type CompanyData, CompanyForm } from "./company-form";

export default function EditCompany() {
  const navigate = useNavigate();

  const { companyId } = Route.useParams();
  const { data: companyData, isPending: isLoadingData } = useQuery(
    companyQuery(companyId),
  );
  const { mutate, isPending: isSaving } = useUpdateCompany();

  if (isLoadingData) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // ถ้าโหลดเสร็จแล้วแต่ไม่เจอข้อมูล
  if (!companyData) {
    return <div className="p-10 text-center">Company not found</div>;
  }

  // แปลงจาก DB -> Form
  const initialValues: CompanyData = {
    companyName: companyData.companyName,
    address: companyData.address ?? "",
    location:
      companyData.latitude && companyData.longitude
        ? `${companyData.latitude}, ${companyData.longitude}`
        : "",

    // Map Contacts array
    companyContacts:
      companyData.companyContacts?.map((contact) => ({
        companyContactId: contact.companyContactId,
        fullName: contact.fullName,
        position: contact.position ?? "",
        email: contact.email ?? "",
        phoneNumber: contact.phoneNumber ?? "",
        isPrimary: contact.isPrimary ?? false,
      })) ?? [],
  };

  const handleEditSubmit = (values: CompanyData) => {
    const [latStr, lngStr] = values.location?.split(",") || [];
    const latitude = latStr ? parseFloat(latStr.trim()) : undefined;
    const longitude = lngStr ? parseFloat(lngStr.trim()) : undefined;

    const payload = {
      id: companyId,
      companyId: parseInt(companyId),
      ...values,
      latitude,
      longitude,
      location: undefined,

      companyContacts: values.companyContacts.map((contact) => ({
        companyContactId: contact.companyContactId,
        fullName: contact.fullName,
        position: contact.position,
        email: contact.email,
        phoneNumber: contact.phoneNumber?.replace(/-/g, "") || "",
        isPrimary: contact.isPrimary,
      })),
    };

    mutate(payload, {
      onSuccess: () => {
        navigate({
          to: "/company/$companyId",
          params: { companyId },
          replace: true,
        });
      },
    });
  };

  return (
    <CompanyForm
      mode="edit"
      isPending={isSaving}
      initialValues={initialValues}
      onSubmit={handleEditSubmit}
      // onCancel={() => navigate({ to: ".." })}
    />
  );
}
