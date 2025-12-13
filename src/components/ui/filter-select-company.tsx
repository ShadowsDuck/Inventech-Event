import { ChevronsUpDown, CircleCheckIcon, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const favoriteTools = [
  { value: "Bangkok Airways", label: "Bangkok Airways" },
  { value: "Agoda Services Co., Ltd.", label: "Agoda Services Co., Ltd." },
];

const allCompany = [
  { value: "Bangkok Airways", label: "Bangkok Airways" },
  { value: "Agoda Services Co., Ltd.", label: "Agoda Services Co., Ltd." },
  {
    value: "Google Thailand Co., Ltd.",
    label: "Google Thailand Co., Ltd.",
  },
  { value: "notion", label: "Notion" },
  { value: "github", label: "GitHub" },
  { value: "linear", label: "Linear" },
];

interface SelectCompanyProps {
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
}

const SelectCompany = ({ value, onChange, isInvalid }: SelectCompanyProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger>
        <Button
          aria-expanded={open}
          className={cn(
            "w-full justify-between rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-muted-foreground h-10",
            isInvalid && "border-destructive text-destructive",
            value && "text-foreground hover:text-foreground"
          )}
          role="combobox"
          variant="outline"
        >
          {value
            ? allCompany.find((item) => item.value === value)?.label ||
              favoriteTools.find((item) => item.value === value)?.label ||
              value
            : "Select Company..."}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-123.75" align="start">
        <Command>
          <CommandInput placeholder="Search companies..." />
          <CommandList>
            <CommandEmpty>No company found.</CommandEmpty>

            <CommandGroup heading="Favorites">
              {favoriteTools.map((item) => (
                <CompanyItem
                  key={item.value}
                  item={item}
                  isSelected={value === item.value}
                  onSelect={handleSelect}
                  isFavorite={true}
                />
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="All Companies">
              {allCompany
                .filter(
                  (item) =>
                    !favoriteTools.find((fav) => fav.value === item.value)
                )
                .map((item) => (
                  <CompanyItem
                    key={item.value}
                    item={item}
                    isSelected={value === item.value}
                    onSelect={handleSelect}
                    isFavorite={false}
                  />
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CompanyItem = ({
  item,
  isSelected,
  onSelect,
  isFavorite,
}: {
  item: { value: string; label: string };
  isSelected: boolean;
  onSelect: (val: string) => void;
  isFavorite: boolean;
}) => {
  return (
    <CommandItem
      value={item.label}
      onSelect={() => onSelect(item.value)}
      className={cn(
        "cursor-pointer rounded-lg mx-1 my-1 flex items-center justify-between w-full px-2 py-1.5 transition-colors",
        isSelected
          ? "bg-primary/10 text-primary data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary hover:bg-primary/20"
          : "data-[selected=true]:bg-transparent text-foreground hover:bg-accent! hover:text-accent-foreground! data-[selected=true]:hover:bg-accent! data-[selected=true]:hover:text-accent-foreground!"
      )}
    >
      <div className="flex items-center flex-1 min-w-0 gap-2 mr-2">
        {isFavorite && (
          <Star className="size-3 fill-yellow-400 text-yellow-400 stroke-0 shrink-0" />
        )}
        <span className="truncate text-left">{item.label}</span>
      </div>

      <CircleCheckIcon
        className={cn(
          "size-4 fill-blue-500 stroke-white shrink-0",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
};

export default SelectCompany;
