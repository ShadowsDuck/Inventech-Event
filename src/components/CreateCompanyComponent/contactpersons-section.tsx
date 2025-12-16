import * as React from "react";
import { Trash2, User, Briefcase, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

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
  contacts,
  setContacts,
}: {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}) {
  const removeContact = (id: string) => {
    setContacts((prev) => {
      const removing = prev.find((c) => c.id === id);
      const next = prev.filter((c) => c.id !== id);

      if (removing?.isPrimary && next.length > 0) {
        return next.map((c, idx) => ({ ...c, isPrimary: idx === 0 }));
      }
      return next.length === 0 ? [newContact(true)] : next;
    });
  };

  const setPrimary = (id: string) => {
    setContacts((prev) => prev.map((c) => ({ ...c, isPrimary: c.id === id })));
  };

  const update = (id: string, patch: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  };

  return (
    <section className="w-full space-y-4">
      {/* Cards */}
      <div className="space-y-4">
        {contacts.map((c, idx) => (
          <div
            key={c.id}
            className={cn(
              "rounded-2xl border bg-white p-5 shadow-sm transition-colors",
              c.isPrimary
                ? "border-blue-500 bg-blue"
                : "border-gray-200"
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
                      if (checked) setPrimary(c.id);
                    }}
                  />
                </div>

                <div className="h-6 w-px bg-gray-200" />

                <button
                  type="button"
                  onClick={() => removeContact(c.id)}
                  className="rounded-md p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  aria-label="remove contact"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            </div>

            {/* Inputs grid */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-1 text-sm font-semibold text-gray-900">
                  Name <span className="text-red-500">*</span>
                </div>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={c.name}
                    onChange={(e) => update(c.id, { name: e.target.value })}
                    placeholder="Full name"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-900">Position</div>
                <div className="relative">
                  <Briefcase className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={c.position}
                    onChange={(e) => update(c.id, { position: e.target.value })}
                    placeholder="e.g., Event Manager"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-1 text-sm font-semibold text-gray-900">
                  Phone <span className="text-red-500">*</span>
                </div>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={c.phone}
                    onChange={(e) => update(c.id, { phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-1 text-sm font-semibold text-gray-900">
                  Email <span className="text-red-500">*</span>
                </div>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={c.email}
                    onChange={(e) => update(c.id, { email: e.target.value })}
                    placeholder="email@company.com"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
