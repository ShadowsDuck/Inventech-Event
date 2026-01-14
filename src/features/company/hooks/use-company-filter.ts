import { useMemo, useState } from "react";

import { useFilterState } from "@/hooks/use-filter-state";
import type { CompanyType } from "@/types/company";

export function useCompanyFilter(company: CompanyType[] | undefined) {
  const [searchValue, setSearchValue] = useState("");

  const { filters, updateFilter } = useFilterState({
    status: "",
  });

  const filteredData = useMemo(() => {
    let result = company || [];

    if (searchValue) {
      const lowerSearch = searchValue.toLowerCase();
      result = result.filter((c) =>
        c.companyName?.toLowerCase().includes(lowerSearch),
      );
    }

    if (filters.status && filters.status !== "") {
      result = result.filter((c) => {
        const currentStatus = c.isDeleted ? "inactive" : "active";

        return currentStatus === filters.status;
      });
    }

    return result;
  }, [company, filters.status, searchValue]);

  return {
    searchValue,
    setSearchValue,
    filters,
    handleFilterChange: updateFilter,
    filteredData,
  };
}
