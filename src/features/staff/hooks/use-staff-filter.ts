import { useMemo, useState } from "react";

import { useFilterState } from "@/hooks/use-filter-state";
import type { StaffType } from "@/types/staff";

export function useStaffFilter(staff: StaffType[] | undefined) {
  const [searchValue, setSearchValue] = useState("");

  // --- อันเก่า ---
  // const [filters, setFilters] = useState({
  //   role: [] as string[],
  // });

  // const handleFilterChange =
  //   (key: keyof typeof filters) => (values: string[]) => {
  //     setFilters((prev) => ({
  //       ...prev,
  //       [key]: values,
  //     }));
  //   };

  // --- อันใหม่ ---
  const { filters, updateFilter } = useFilterState({
    role: [] as string[],status: "",
  });

  // Logic การ Search และ Filter
  const filteredData = useMemo(() => {
    let result = staff || [];

    // --- ส่วน Search ---
    if (searchValue) {
      const lowerSearch = searchValue.toLowerCase();
      result = result.filter((s) =>
        s.fullName?.toLowerCase().includes(lowerSearch),
      );
    }

    // --- ส่วน Filter Role ---
    if (filters.role.length > 0) {
      const roleSet = new Set(filters.role);
      result = result.filter((s) =>
        s.staffRoles?.some((sr) => roleSet.has(sr.roleId.toString())),
      );
    }

if (filters.status && filters.status !== "") {
      result = result.filter((c) => {
        const currentStatus = c.isDeleted ? "inactive" : "active";

        return currentStatus === filters.status;
      });console.log(filters.status)
    }

    return result;
  }, [staff, filters.role,filters.status, searchValue,]);
  return {
    searchValue,
    setSearchValue,
    filters,
    handleFilterChange: updateFilter,
    filteredData,
  };
  
}
