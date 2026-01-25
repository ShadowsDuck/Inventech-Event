import { useNavigate } from "@tanstack/react-router";

import { cleanPhoneNumber } from "@/lib/format";

import { useCreateCompany } from "../../api/createCompany";
import { type CompanyData, CompanyForm } from "./../company-form";

export default function CreateCompany() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateCompany();

  // แปลงจาก Form -> DB
  const handleCreateSubmit = (values: CompanyData) => {
    const [latStr, lngStr] = values.location?.split(",") || [];
    const latitude = latStr ? parseFloat(latStr.trim()) : null;
    const longitude = lngStr ? parseFloat(lngStr.trim()) : null;

    const payload = {
      ...values,
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

    console.log(payload);

    mutate(payload, {
      onSuccess: () => {
        navigate({ to: "..", replace: true });
      },
    });
  };

  return (
    <CompanyForm
      mode="create"
      isPending={isPending}
      onSubmit={handleCreateSubmit}
    />
  );
}
