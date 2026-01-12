// src/app/staff/StaffList.tsx
import { useMemo, useState } from "react";

import {
  useQueries,
  useSuspenseQueries,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import { DataTable } from "@/components/tables/data-table";
import { staffColumns } from "@/components/tables/staff-column";
import { Button } from "@/components/ui/button";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
import { Route } from "@/routes/_sidebarLayout/staff";
import type { StaffType } from "@/types/staff";

import { roleQuery } from "../api/getRole";
import { staffQuery } from "../api/getStaff";
// import { type ColumnFiltersState } from "@tanstack/react-table"; // ถ้าไม่ได้ใช้ columnFilters ส่งเข้า Table ก็เอาออกได้ครับ

export default function StaffList() {
  const navigate = Route.useNavigate();
  
  // 1. ลบการดึง q จาก URL
  // const { q } = Route.useSearch(); 

  // 2. ลบ q ออกจาก Query เพื่อดึงข้อมูลทั้งหมด
  const [{ data: staff }, { data: roles }] = useQueries({
    queries: [staffQuery({}), roleQuery({})], 
  });

  const [searchValue, setSearchValue] = useState("");

  // 3. ปรับ function search ให้เปลี่ยน state โดยตรง (ไม่ต้อง debounce หรือ navigate แล้ว)
  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const roleOptions = useMemo(() => {
    return roles?.map((role) => ({
      value: role.roleId.toString(),
      label: role.roleName,
    }));
  }, [roles]);

  const [filters, setFilters] = useState({
    role: [] as string[],
  });

  const handleFilterChange =
    (key: keyof typeof filters) => (values: string[]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: values,
      }));
    };

  // 4. รวม Logic การ Search และ Filter ไว้ใน useMemo เดียวกัน
  const filteredStaff = useMemo(() => {
    let result = staff || [];

    // --- ส่วน Search (Client-side) ---
    if (searchValue) {
      const lowerSearch = searchValue.toLowerCase();
      result = result.filter((s) => 
        // กรองจากชื่อ หรือ อีเมล (ปรับตาม field ที่มี)
        s.fullName?.toLowerCase().includes(lowerSearch) ||
        s.email?.toLowerCase().includes(lowerSearch)
      );
    }

    // --- ส่วน Filter Role ---
    if (filters.role.length > 0) {
      const roleSet = new Set(filters.role);
      result = result.filter((s) =>
        s.staffRoles?.some((sr) => roleSet.has(sr.roleId.toString())),
      );
    }

    return result;
  }, [staff, filters.role, searchValue]); // อย่าลืมใส่ searchValue ใน dependency

  return (
    <>
      <PageHeader
        title="Staff"
        count={filteredStaff.length} // นับจากจำนวนที่กรองแล้ว
        countLabel="staff members"
        actions={
          <Button size="add" onClick={() => navigate({ to: "/staff/create" })}>
            <Plus size={18} strokeWidth={2.5} />
            Add Staff
          </Button>
        }
      />
      <div className="flex items-center gap-2 px-6 pt-4 pb-2">
        <div className="w-[450px] max-w-full">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search staff..."
          />
        </div>
        <FilterMultiSelect
          title="Role"
          icon={Users}
          options={roleOptions || []}
          selected={filters.role}
          onChange={handleFilterChange("role")}
        />
      </div>
      <PageSection>
        <DataTable columns={staffColumns} data={filteredStaff || []} />
      </PageSection>
    </>
  );
}