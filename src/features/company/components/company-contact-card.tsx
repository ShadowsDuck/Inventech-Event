import { Mail, Phone, User } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ContactPersonType } from "@/types/company";

// --- Base Component ---
interface ContactItemProps {
  icon: React.ElementType;
  text?: string;
  variant?: "primary" | "standard";
}

const ContactItem = ({
  icon: Icon,
  text,
  variant = "standard",
}: ContactItemProps) => {
  const isPrimary = variant === "primary";

  return (
    <div
      className={cn(
        "flex items-center",
        isPrimary && "rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5",
      )}
    >
      <Icon
        className={cn(
          "mr-2",
          isPrimary ? "text-chart-2 h-4 w-4" : "text-muted-foreground h-3 w-3",
        )}
      />
      <span
        className={cn(
          "text-[12px] font-medium",
          isPrimary ? "text-black/70" : "text-black/55",
        )}
      >
        {text || "-"}
      </span>
    </div>
  );
};

// --- Primary Card ---
export function PrimaryContactCard({
  contact,
}: {
  contact: ContactPersonType;
}) {
  return (
    <div className="border-primary/30 relative overflow-hidden rounded-xl border p-6">
      {/* Badge */}
      <div className="bg-primary absolute top-0 right-0 rounded-bl-xl px-4 py-1.5">
        <p className="text-[10px] font-bold tracking-wider text-white uppercase">
          Primary Contact
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-normal">
        {/* Avatar */}
        <div className="border-primary/20 flex h-18 w-18 shrink-0 items-center justify-center rounded-full border-2">
          <User className="text-primary h-10 w-10" strokeWidth="1.5" />
        </div>

        <div>
          <h3 className="-mb-0.5 text-center text-lg font-bold sm:justify-self-start">
            {contact.fullName}
          </h3>
          <p className="text-primary text-center text-[13px] font-semibold uppercase sm:justify-self-start">
            {contact.position}
          </p>

          <div className="mt-4 flex gap-3">
            <ContactItem
              icon={Phone}
              text={contact.phoneNumber}
              variant="primary"
            />
            <ContactItem icon={Mail} text={contact.email} variant="primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Standard Card ---
export function StandardContactCard({
  contact,
}: {
  contact: ContactPersonType;
}) {
  return (
    <div className="rounded-xl border border-gray-100 p-3">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50">
          <User className="h-5 w-5 text-gray-400" strokeWidth="1.5" />
        </div>

        <div>
          <h3 className="text-md font-bold">{contact.fullName}</h3>
          <p className="text-muted-foreground text-[11px] font-bold uppercase">
            {contact.position}
          </p>

          <div className="mt-2 flex flex-col gap-1">
            <ContactItem
              icon={Phone}
              text={contact.phoneNumber}
              variant="standard"
            />
            <ContactItem icon={Mail} text={contact.email} variant="standard" />
          </div>
        </div>
      </div>
    </div>
  );
}
