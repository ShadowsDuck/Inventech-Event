import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { cleanPhoneNumber, formatPhoneNumberDisplay } from "@/lib/format";
import { Route } from "@/routes/company/$companyId/edit";

import { companyQuery } from "../../api/getCompany";
import { useUpdateCompany } from "../../api/updateCompany";
import { type CompanyData, CompanyForm } from "../company-form";

export default function EditCompany() {
  const navigate = useNavigate();

  const { companyId } = Route.useParams();
  const { data: companyData } = useSuspenseQuery(companyQuery(companyId));
  const { mutate, isPending: isSaving } = useUpdateCompany();

  // แปลงจาก DB -> Form
  const initialValues: CompanyData = {
    companyName: companyData.companyName,
    address: companyData.address ?? "",
    location:
      companyData.latitude && companyData.longitude
        ? `${companyData.latitude}, ${companyData.longitude}`
        : "",
    isDeleted: companyData.isDeleted ?? false,

    // Map Contacts array
    companyContacts:
      companyData.companyContacts?.map((contact) => ({
        companyContactId: contact.companyContactId,
        fullName: contact.fullName,
        position: contact.position ?? "",
        email: contact.email ?? "",
        phoneNumber: formatPhoneNumberDisplay(contact.phoneNumber) ?? "",
        isPrimary: contact.isPrimary ?? false,
      })) ?? [],
  };

  // แปลงจาก Form -> DB
  const handleEditSubmit = (values: CompanyData) => {
    const [latStr, lngStr] = values.location?.split(",") || [];
    const latitude = latStr ? parseFloat(latStr.trim()) : null;
    const longitude = lngStr ? parseFloat(lngStr.trim()) : null;

    const payload = {
      ...values,
      id: parseInt(companyId),
      latitude,
      longitude,
      location: undefined,
      companyContacts: values.companyContacts.map((contact) => ({
        ...contact,
        phoneNumber: contact.phoneNumber
          ? cleanPhoneNumber(contact.phoneNumber)
          : "",
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
    />
  );
}
