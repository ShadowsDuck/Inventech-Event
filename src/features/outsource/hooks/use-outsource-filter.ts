import { useMemo, useState } from "react";

import { useFilterState } from "@/hooks/use-filter-state";
import type { OutsourceType } from "@/types/outsource";

export function useOutsourceFilter(outsource: OutsourceType[] | undefined) {
  const [searchValue, setSearchValue] = useState("");
  // --- อันใหม่ ---
  const { filters, updateFilter } = useFilterState({
    status: "",
  });

  // Logic การ Search และ Filter
  const filteredData = useMemo(() => {
    let result = outsource || [];

    // --- ส่วน Search ---
    if (searchValue) {
      const lowerSearch = searchValue.toLowerCase();
      result = result.filter((s) =>
        s.fullName?.toLowerCase().includes(lowerSearch),
      );
    }

    // --- ส่วน Filter Role ---

    if (filters.status && filters.status !== "") {
      result = result.filter((c) => {
        const currentStatus = c.isDeleted ? "inactive" : "active";

        return currentStatus === filters.status;
      });
    }

    return result;
  }, [outsource, filters.status, searchValue]);
  return {
    searchValue,
    setSearchValue,
    filters,
    handleFilterChange: updateFilter,
    filteredData,
  };
}
