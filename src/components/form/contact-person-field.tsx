import { Briefcase, Mail, Phone, Plus, Trash2, User } from "lucide-react";

import { useFieldContext } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { ContactData } from "@/features/company/components/company-form";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyForm = any;
type AnyField = any;
/* eslint-enable @typescript-eslint/no-explicit-any */

type ContactPersonFieldProps = {
  form: AnyForm;
};

export function ContactPersonField({ form }: ContactPersonFieldProps) {
  const field = useFieldContext<ContactData[]>();
  const contacts = field.state.value;

  const addContact = () => {
    const isFirstContact = contacts.length === 0;
    field.pushValue({
      fullName: "",
      position: "",
      phoneNumber: "",
      email: "",
      isPrimary: isFirstContact,
    });
  };

  const removeContact = (index: number) => {
    // 1. เช็คก่อนลบว่า คนนี้เป็น Primary หรือเปล่า?
    const isRemovingPrimary = contacts[index].isPrimary;

    // 2. สั่งลบตามปกติ (เพื่อให้ Library จัดการเรื่อง State/ID/Validation)
    field.removeValue(index);

    // 3. ถ้าคนที่เราลบตะกี้ คือ Primary -> เราต้องตั้งคนใหม่
    if (isRemovingPrimary) {
      // ใช้ setTimeout เพื่อรอให้กระบวนการ removeValue จบลงและ State อัปเดตก่อน
      setTimeout(() => {
        field.setValue((currentContacts) => {
          // เช็คว่ายังมีคนเหลืออยู่ไหม (กันเหนียว เผื่อลบหมดเกลี้ยง)
          if (currentContacts && currentContacts.length > 0) {
            // Clone array มาเพื่อแก้ไข
            const newContacts = [...currentContacts];

            // "บังคับ" ให้คนแรกสุดที่เหลืออยู่ (Index 0) กลายเป็น Primary
            newContacts[0] = { ...newContacts[0], isPrimary: true };

            return newContacts;
          }
          return currentContacts;
        });
      }, 0);
    }
  };

  const setPrimary = (index: number) => {
    const newContacts = contacts.map((c, i) => ({
      ...c,
      isPrimary: i === index,
    }));
    field.handleChange(newContacts);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-lg font-bold text-gray-900">
          <div className="flex items-center gap-2">
            <span className="h-6 w-1.5 rounded-full bg-blue-600" />
            Contact Person(s)
          </div>
          <Button
            type="button"
            onClick={addContact}
            size="sm"
            className="bg-chart-1/25 hover:bg-chart-1/50 border-chart-1 rounded-lg p-4"
          >
            <Plus className="text-chart-4 mr-1 -ml-1 h-4 w-4" />
            <p className="text-chart-4 font-semibold">Add Contact</p>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((c, idx) => {
            const isSwitchDisabled = contacts.length === 1 && c.isPrimary;
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl border bg-white p-5 shadow-sm transition-colors",
                  c.isPrimary
                    ? "border-blue-500 bg-blue-50/10"
                    : "border-gray-200",
                )}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-[16px] font-semibold text-gray-900">
                      Person {idx + 1}
                    </div>
                    {c.isPrimary && (
                      <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
                        PRIMARY
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          c.isPrimary ? "text-blue-600" : "text-gray-500",
                        )}
                      >
                        Primary
                      </span>
                      <Switch
                        checked={c.isPrimary}
                        disabled={isSwitchDisabled}
                        onCheckedChange={(checked) => {
                          if (checked) setPrimary(idx);
                        }}
                      />
                    </div>

                    {contacts.length > 1 && (
                      <>
                        <div className="h-6 w-px bg-gray-200" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeContact(idx)}
                          className="hover:bg-destructive/5 text-gray-400 duration-150 hover:rounded-xl hover:text-red-500"
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Full Name */}
                  <form.AppField
                    name={`${field.name}[${idx}].fullName`}
                    autoFocus
                    children={(subField: AnyField) => (
                      <subField.TextField
                        label="Name"
                        type="text"
                        placeholder="e.g. Somchai Jaidee"
                        startIcon={User}
                        required
                      />
                    )}
                  />

                  {/* Position */}
                  <form.AppField
                    name={`${field.name}[${idx}].position`}
                    children={(subField: AnyField) => (
                      <subField.TextField
                        label="Position"
                        type="text"
                        placeholder="e.g. Manager"
                        startIcon={Briefcase}
                      />
                    )}
                  />

                  {/* Phone Number */}
                  <form.AppField
                    name={`${field.name}[${idx}].phoneNumber`}
                    children={(subField: AnyField) => (
                      <subField.TextField
                        label="Phone"
                        type="tel"
                        placeholder="081-234-5678"
                        startIcon={Phone}
                        required
                      />
                    )}
                  />

                  {/* Email */}
                  <form.AppField
                    name={`${field.name}[${idx}].email`}
                    children={(subField: AnyField) => (
                      <subField.TextField
                        label="Email"
                        type="email"
                        placeholder="contact@example.com"
                        startIcon={Mail}
                        required
                      />
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
