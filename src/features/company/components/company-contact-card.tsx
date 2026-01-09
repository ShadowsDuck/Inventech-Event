import { Mail, Phone, User } from "lucide-react";

import { cn } from "@/lib/utils";

interface CompanyContactCardProps {
  primary: boolean;
}

export default function CompanyContactCard({
  primary,
}: CompanyContactCardProps) {
  return (
    <div
      className={cn(
        "relative h-full overflow-hidden rounded-xl border",
        primary ? "border-primary/30 p-6" : "border-gray-100 p-3",
      )}
    >
      {/* Badge */}
      {primary && (
        <div className="bg-primary absolute top-0 right-0 rounded-bl-xl px-4 py-1.5">
          <p className="text-[10px] font-bold tracking-wider text-white uppercase">
            Primary Contact
          </p>
        </div>
      )}

      <div
        className={cn(
          "flex",
          primary
            ? "flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-normal"
            : "gap-4",
        )}
      >
        {/* Icon Avatar */}
        <div
          className={cn(
            primary
              ? "border-primary/20 flex h-18 w-18 shrink-0 items-center justify-center rounded-full border-2"
              : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50",
          )}
        >
          <User
            className={cn(
              primary ? "text-primary h-10 w-10" : "h-5 w-5 text-gray-400",
            )}
            strokeWidth="1.5"
          />
        </div>

        <div>
          {/* Name */}
          <h3
            className={cn(
              primary
                ? "-mb-0.5 text-center text-lg font-bold sm:justify-self-start"
                : "text-md font-bold",
            )}
          >
            Nancy Drew
          </h3>

          {/* Position */}
          <p
            className={cn(
              "uppercase",
              primary
                ? "text-primary text-center text-[13px] font-semibold sm:justify-self-start"
                : "text-muted-foreground text-[11px] font-bold",
            )}
          >
            Partnership Manager
          </p>

          <div
            className={cn(
              "flex",
              primary ? "mt-4 gap-3" : "mt-2 flex-col gap-1",
            )}
          >
            {/* Phone Badge */}
            <div
              className={cn(
                "flex items-center",
                primary
                  ? "rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5"
                  : "",
              )}
            >
              <Phone
                className={cn(
                  "mr-2",
                  primary
                    ? "text-chart-2 h-4 w-4"
                    : "text-muted-foreground h-3 w-3",
                )}
              />
              <span
                className={cn(
                  "text-[12px] font-medium",
                  primary ? "text-black/70" : "text-black/55",
                )}
              >
                012-456-7890
              </span>
            </div>

            {/* Email Badge */}
            <div
              className={cn(
                "flex items-center",
                primary
                  ? "rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5"
                  : "",
              )}
            >
              <Mail
                className={cn(
                  "mr-2",
                  primary
                    ? "text-chart-2 h-4 w-4"
                    : "text-muted-foreground h-3 w-3",
                )}
              />
              <span
                className={cn(
                  "text-[12px] font-medium",
                  primary ? "text-black/70" : "text-black/55",
                )}
              >
                john.doe@example.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
