// StaffProfileFormFields.tsx
import * as React from "react";
import {
  Camera,
  User,
  Mail,
  Phone,
  ChevronsUpDown,
  Check,
  X,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type Props = {
  form: any;
  roleOptions: string[];
};

export default function StaffProfileFormFields({ form, roleOptions }: Props) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  // ✅ Avatar preview จากการเลือกไฟล์
  const [preview, setPreview] = React.useState<string | null>(null);
  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // ✅ Roles dropdown (แบบ in-flow)
  const [rolesOpen, setRolesOpen] = React.useState(false);
  const [roleQuery, setRoleQuery] = React.useState("");
  const rolesWrapRef = React.useRef<HTMLDivElement | null>(null);

  // click outside -> close
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rolesOpen) return;
      const el = rolesWrapRef.current;
      if (el && !el.contains(e.target as Node)) setRolesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!rolesOpen) return;
      if (e.key === "Escape") setRolesOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [rolesOpen]);

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <form.Field name="avatar">
        {(field: any) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid} className="min-w-0">
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={cn(
                    "relative grid place-items-center",
                    "h-28 w-28 rounded-full border-2 border-dashed border-gray-300 bg-white",
                    "hover:border-gray-400 transition",
                    isInvalid && "border-destructive"
                  )}
                  aria-label="upload avatar"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="avatar"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <Camera className="size-6 text-gray-400" />
                  )}

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;

                      // ✅ เก็บไฟล์ลง tanstack form
                      field.handleChange(f);

                      // ✅ ทำ preview
                      if (f) {
                        const url = URL.createObjectURL(f);
                        setPreview((prev) => {
                          if (prev) URL.revokeObjectURL(prev);
                          return url;
                        });
                      } else {
                        setPreview((prev) => {
                          if (prev) URL.revokeObjectURL(prev);
                          return null;
                        });
                      }
                    }}
                  />
                </button>
              </div>

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      {/* Full Name */}
      <form.Field name="fullName">
        {(field: any) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid} className="min-w-0">
              <FieldLabel htmlFor={field.name}>
                Full Name <span className="text-red-500">*</span>
              </FieldLabel>

              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Somchai Jai-dee"
                  className={cn("pl-10", isInvalid && "border-destructive")}
                />
              </div>

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Email */}
        <form.Field name="email">
          {(field: any) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid} className="min-w-0">
                <FieldLabel htmlFor={field.name}>
                  Email Address <span className="text-red-500">*</span>
                </FieldLabel>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="staff@eventflow.com"
                    className={cn("pl-10", isInvalid && "border-destructive")}
                  />
                </div>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {/* Phone */}
        <form.Field name="phone">
          {(field: any) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid} className="min-w-0">
                <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="081-234-5678"
                    className={cn("pl-10", isInvalid && "border-destructive")}
                  />
                </div>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </div>

      {/* Roles (multi-select แบบในรูป + เปิดลงล่างและดันหน้าให้ยาวขึ้น) */}
      <form.Field name="roles">
        {(field: any) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          const roles: string[] = field.state.value ?? [];

          const toggleRole = (role: string) => {
            const has = roles.includes(role);
            const next = has ? roles.filter((r) => r !== role) : [...roles, role];
            field.handleChange(next);
          };

          const clear = () => {
            field.handleChange([]);
          };

          const filtered = roleOptions.filter((r) =>
            r.toLowerCase().includes(roleQuery.trim().toLowerCase())
          );

          return (
            <Field data-invalid={isInvalid} className="min-w-0">
              <FieldLabel htmlFor={field.name}>Roles (Select multiple)</FieldLabel>

              <div ref={rolesWrapRef} className="min-w-0">
                {/* Trigger (chips อยู่ในช่อง) */}
                <button
                  type="button"
                  onClick={() => setRolesOpen((o) => !o)}
                  className={cn(
                    "w-full rounded-xl border bg-white px-3 py-2 text-left",
                    "flex items-center gap-3",
                    "outline-none focus:border-blue-500",
                    isInvalid ? "border-destructive" : "border-gray-200"
                  )}
                >
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    {roles.length === 0 ? (
                      <span className="text-sm text-gray-400">Select roles...</span>
                    ) : (
                      roles.map((r) => (
                        <span
                          key={r}
                          className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-sm text-gray-900 shadow-sm"
                        >
                          {r}
                        </span>
                      ))
                    )}
                  </div>

                  <ChevronsUpDown
                    className={cn(
                      "size-4 shrink-0 text-gray-400 transition-transform",
                      rolesOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown (อยู่ใน flow → หน้าเพิ่มความยาวเอง) */}
                {rolesOpen && (
                  <div className="mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    {/* Search */}
                    <div className="border-b border-gray-100 p-3">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                        <input
                          value={roleQuery}
                          onChange={(e) => setRoleQuery(e.target.value)}
                          placeholder="Search..."
                          className={cn(
                            "h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm",
                            "outline-none focus:border-blue-500"
                          )}
                        />
                      </div>
                    </div>

                    {/* List */}
                    <div className="max-h-72 overflow-auto p-2">
                      {filtered.length === 0 ? (
                        <div className="px-3 py-4 text-sm text-gray-400">
                          No role found.
                        </div>
                      ) : (
                        filtered.map((role) => {
                          const selected = roles.includes(role);
                          return (
                            <button
                              key={role}
                              type="button"
                              onClick={() => toggleRole(role)}
                              className={cn(
                                "w-full rounded-lg px-3 py-2",
                                "flex items-center gap-3 text-left",
                                "hover:bg-gray-50"
                              )}
                            >
                              <span
                                className={cn(
                                  "grid h-5 w-5 place-items-center rounded border",
                                  selected
                                    ? "border-blue-600 bg-blue-600"
                                    : "border-gray-300 bg-white"
                                )}
                              >
                                <Check
                                  className={cn(
                                    "size-4 text-white",
                                    selected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </span>

                              <span className="text-sm text-gray-900">{role}</span>
                            </button>
                          );
                        })
                      )}
                    </div>

                    {/* Clear */}
                    <button
                      type="button"
                      onClick={clear}
                      className={cn(
                        "w-full border-t border-gray-100 py-3",
                        "flex items-center justify-center gap-2",
                        "text-sm font-medium text-red-600 hover:bg-red-50"
                      )}
                    >
                      <X className="size-4" />
                      Clear Selection
                    </button>
                  </div>
                )}
              </div>

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>
    </div>
  );
}
