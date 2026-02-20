import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

type TabsVariant = "default" | "underline" | "select";

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      className={cn(
        "flex flex-col gap-2 data-[orientation=vertical]:flex-row",
        "print:block print:h-auto print:overflow-visible",
        className,
      )}
      data-slot="tabs"
      {...props}
    />
  );
}

function TabsList({
  variant = "default",
  className,
  children,
  ...props
}: TabsPrimitive.List.Props & {
  variant?: TabsVariant;
}) {
  return (
    <TabsPrimitive.List
      className={cn(
        "text-muted-foreground relative z-0 flex w-fit items-center justify-center gap-x-0.5",
        "data-[orientation=vertical]:flex-col",
        variant === "default" &&
          "text-muted-foreground/72 rounded-xl border border-gray-200 bg-white p-1",

        variant === "select" &&
          "text-muted-foreground/72 rounded-xl border border-gray-200 bg-white p-1",
        className,
      )}
      data-slot="tabs-list"
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator
        className={cn(
          "absolute bottom-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom) transition-[width,translate] duration-200 ease-in-out",
          variant === "default" &&
            "dark:bg-accent -z-1 rounded-lg bg-blue-600 shadow-sm",
          variant === "underline" &&
            "bg-primary z-10 data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:translate-y-px data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:-translate-x-px",
          variant === "select" &&
            "dark:bg-accent -z-1 rounded-lg bg-white shadow-sm",
        )}
        data-slot="tab-indicator"
      />
    </TabsPrimitive.List>
  );
}

interface TabsTabProps extends TabsPrimitive.Tab.Props {
  activeColor?: string;
  inactiveColor?: string;
}

function TabsTab({
  className,
  activeColor = "data-active:text-white",
  inactiveColor = "text-gray-500",
  ...props
}: TabsTabProps) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "focus-visible:ring-ring flex flex-1 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] outline-none focus-visible:ring-2 data-disabled:pointer-events-none data-disabled:opacity-64 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",

        inactiveColor,
        activeColor,

        "gap-1.5 px-[calc(--spacing(2.5)-1px)] py-[calc(--spacing(1.5)-1px)]",
        "data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start",
        className,
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  );
}

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      className={cn(
        "flex-1 outline-none",
        "print:block print:h-auto print:w-full print:overflow-visible",
        className,
      )}
      data-slot="tabs-content"
      {...props}
    />
  );
}

export {
  Tabs,
  TabsList,
  TabsTab,
  TabsTab as TabsTrigger,
  TabsPanel,
  TabsPanel as TabsContent,
};
