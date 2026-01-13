import * as React from "react";

import { Trash2 } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type Contact = {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  isPrimary: boolean;
};

export const newContact = (isPrimary = false): Contact => ({
  id: crypto.randomUUID(),
  name: "",
  position: "",
  phone: "",
  email: "",
  isPrimary,
});

export default function ContactPersonsSection({
  field,
  form,
}: {
  field: any;
  form: any;
}) {
  const contacts = field.state.value as Contact[];

  const removeContact = (index: number) => {
    const contactToRemove = contacts[index];

    field.removeValue(index);

    if (contactToRemove.isPrimary && contacts.length > 1) {
      setTimeout(() => {
        const currentContacts = form.getFieldValue("contacts") as Contact[];
        if (
          currentContacts.length > 0 &&
          !currentContacts.some((c) => c.isPrimary)
        ) {
          form.setFieldValue("contacts[0].isPrimary", true);
        }
      }, 0);
    } else if (contacts.length === 1) {
      field.pushValue(newContact(true));
    }
  };

  const setPrimary = (targetIndex: number) => {
    const updatedContacts = contacts.map((c, idx) => ({
      ...c,
      isPrimary: idx === targetIndex,
    }));
    field.handleChange(updatedContacts);
  };

  return (
    <section className="w-full space-y-4">
      <div className="space-y-4">
        {contacts.map((c, idx) => (
          <div
            key={c.id}
            className={cn(
              "rounded-2xl border bg-white p-5 shadow-sm transition-colors",
              c.isPrimary ? "bg-blue border-blue-500" : "border-gray-200",
            )}
          >
            {/* Card top row */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="font-semibold text-gray-900">
                  Contact Person {idx + 1}
                </div>
                {c.isPrimary && (
                  <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">
                    PRIMARY
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">
                    Primary Contact
                  </span>
                  <Switch
                    checked={c.isPrimary}
                    onCheckedChange={(checked) => {
                      if (checked) setPrimary(idx);
                    }}
                  />
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <button
                  type="button"
                  onClick={() => removeContact(idx)}
                  className="rounded-md p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            </div>

            {/* Inputs grid */}

            <div className="mb-4 space-y-2">
              <form.AppField
                name={`contacts[${idx}].position`}
                children={(subField: any) => (
                  <subField.TextField
                    label="Position"
                    placeholder="e.g., Event Manager"
                  />
                )}
              />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <form.AppField
                name={`contacts[${idx}].phone`}
                // แก้ไขตรงนี้: ใส่ :any ให้ subField
                children={(subField: any) => (
                  <subField.TextField
                    label="Phone"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                )}
              />
              <form.AppField
                name={`contacts[${idx}].email`}
                children={(subField: any) => (
                  <subField.TextField
                    label="Email"
                    placeholder="email@company.com"
                    required
                  />
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
