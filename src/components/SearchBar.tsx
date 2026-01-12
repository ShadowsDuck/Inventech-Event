// src/components/SearchBar.tsx
import type { ChangeEvent } from "react";

import { Search, SearchIcon } from "lucide-react";

import { Input } from "./ui/input";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full max-w-md">
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
          className="peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
        />
      </div>
    </div>
  );
}

export default SearchBar;
