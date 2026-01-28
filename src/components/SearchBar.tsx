import type { ChangeEvent } from "react";

import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Input } from "./ui/input";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className,
  fullWidth = false,
}: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("w-full max-w-md", fullWidth && "max-w-full")}>
      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
          <SearchIcon className="size-4" />
          <span className="sr-only">Search</span>
        </div>
        <Input
          type="search"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
            className,
          )}
        />
      </div>
    </div>
  );
}

export default SearchBar;
