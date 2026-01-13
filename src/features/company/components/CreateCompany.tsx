import * as React from "react";
import { useForm } from "@tanstack/react-form"; // หรือ useAppForm ของคุณ
import { Save, Plus } from "lucide-react";
import { toast } from "sonner";

// Import component ที่เราจะแก้
import ContactPersonsSection, {
  newContact,
  type Contact
} from "@/components/CreateCompanyComponent/contactpersons-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "../../../components/layout/PageHeader";
import { useAppForm } from "@/components/form";

// 1. เพิ่ม contacts เข้าไปใน Type ของ Form
type CreateCompany = {
  companyName: string;
  address: string;
  location: string;
  contacts: Contact[]; // เพิ่มตรงนี้
};

export default function CreateCompany() {
  const form = useAppForm({
    defaultValues: {
      companyName: "",
      address: "",
      location: "",
      contacts: [newContact(true)],
    },
    onSubmit: async ({ value }) => {
      // ตรวจสอบข้อมูลใน console หรือ toast
      toast("Submitted", {
        description: JSON.stringify(value, null, 2),
      });
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Create Company"
        countLabel="Create Company"
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button size="add" type="submit" form="create-company-form">
              <Save size={18} strokeWidth={2.5} />
              Create Company
            </Button>
          </div>
        }
      />

      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 pb-20 lg:p-10">
        <form
            id="create-company-form"
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
        >
          {/* ส่วน Basic Information (เหมือนเดิม) */}
          <Card className="mb-8">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="h-6 w-1.5 rounded-full bg-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
                <section className="space-y-6">
                  <form.AppField
                    name="companyName"
                    children={(field) => <field.TextField label="Company Name" placeholder="Company Name..." />}
                  />
                  <form.AppField
                    name="address"
                    children={(field) => <field.TextField label="Address" />}
                  />
                  <form.AppField
                    name="location"
                    children={(field) => <field.LocationField label="Location" />}
                  />
                </section>
            </CardContent>
          </Card>

          {/* 3. ส่วน Contact Persons */}
          {/* เราจะใช้ form.Field แบบ Array ตรงนี้ แล้วส่ง field API เข้าไปใน Component ย่อย */}
          <form.Field
            name="contacts"
            mode="array"
            children={(field) => (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <span className="h-6 w-1 rounded-full bg-blue-600" />
                    Contact Person(s)
                  </CardTitle>

                  <Button
                    type="button"
                    variant="outline"
                    // ใช้ field.pushValue แทน setContacts
                    onClick={() => field.pushValue(newContact(false))}
                    className="hover:text-blue border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="size-4" />
                    Add Contact
                  </Button>
                </CardHeader>
                <CardContent>
                  {/* ส่ง field instance และ form instance เข้าไป */}
                  <ContactPersonsSection field={field} form={form} />
                </CardContent>
              </Card>
            )}
          />
        </form>
      </div>
    </div>
  );
}