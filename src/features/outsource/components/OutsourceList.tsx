import { useMemo, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ListFilter, Plus } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/filter-select";
import { SELECT_OPTIONS } from "@/data/constants";
// ตัวเลือกใน Dropdown (Active/Inactive)
import { outsourceColumns } from "@/features/outsource/components/outsource-column";
import { Route } from "@/routes/_sidebarLayout/outsource";

import { outsourcesQuery } from "../api/getOutsource";

export default function OutsourceList() {
  const navigate = Route.useNavigate();

  // 1. Data Fetching
  // ดึงข้อมูล Outsource ทั้งหมดมาพักไว้ที่ Client (Client-side Fetching)
  const { data: outsources } = useSuspenseQuery(outsourcesQuery());

  // 2. Local State
  const [search, setSearch] = useState(""); // เก็บคำค้นหา
  const [status, setStatus] = useState(""); // เก็บสถานะที่เลือกจาก Filter

  // 3. Filtering Logic
  // กรองข้อมูลในเครื่องโดยใช้ useMemo ทำงานเมื่อข้อมูล, คำค้น, หรือสถานะเปลี่ยน
  const filteredOutsources = useMemo(() => {
    let result = outsources;

    result = result.filter((c) => {
      //ค้นหาจากชื่อ (Full Name)
      const matchesSearch =
        !search || c.fullName.toLowerCase().includes(search.toLowerCase());

      // Logic 2: กรองตามสถานะ (Status)
      // ถ้า status เป็น "" (เลือก All) -> !status เป็น true -> ผ่านเงื่อนไขเสมอ
      // ถ้า status เป็น "inactive" -> เช็คว่า isDeleted ต้องเป็น true
      // ถ้า status เป็น "active" -> เช็คว่า isDeleted ต้องเป็น false (active)
      const matchesStatus = !status || c.isDeleted === (status === "inactive");

      // ต้องผ่านทั้ง 2 เงื่อนไขถึงจะแสดงผล
      return matchesSearch && matchesStatus;
    });

    return result;
  }, [outsources, search, status]);

  return (
    <>
      {/* --- ส่วนหัว (Header) --- */}
      <PageHeader
        title="Outsource"
        count={filteredOutsources.length} // นับจำนวนรายการที่เหลือจากการกรอง
        countLabel="outsource members"
        actions={
          // ปุ่ม Add Outsource: ไปหน้าสร้างใหม่
          <Button
            size="add"
            onClick={() => navigate({ to: "/outsource/create" })}
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Outsource
          </Button>
        }
      />

      {/* --- ส่วนค้นหาและกรอง (Search & Filter Bar) --- */}
      <div className="flex flex-col gap-4 px-6 pt-4">
        <div className="flex items-center gap-2">
          {/* 1. ช่องค้นหา */}
          <SearchBar
            value={search}
            onChange={(value) => setSearch(value)}
            placeholder="Search outsources..."
          />

          {/* 2. ปุ่มตัวกรองสถานะ (Dropdown) */}
          <FilterSelect
            title="Status"
            icon={ListFilter} // ไอคอนรูปกรวยกรอง
            options={SELECT_OPTIONS} // ตัวเลือก [All, Active, Inactive]
            value={status} // ค่าปัจจุบันที่เลือก
            onChange={(value) => setStatus(value)} // อัปเดต state เมื่อเลือก
          />
        </div>

        {/* --- ตารางแสดงข้อมูล --- */}
        <DataTable columns={outsourceColumns} data={filteredOutsources} />
      </div>
    </>
  );
}
