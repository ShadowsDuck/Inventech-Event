import { useMemo, useState } from "react";

import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { Route } from "@/routes/_sidebarLayout/equipment";
import type { CategoryType, EquipmentType } from "@/types/equipment";

import { equipmentQuery } from "../../api/getEquipment";
import { equipmentColumns } from "../equipment-column";

export default function EquipmentList() {
  const navigate = Route.useNavigate();

  // 1. Data Fetching (ดึงข้อมูลทั้งหมดทีเดียว)

  const { data: equipment } = useSuspenseQuery(equipmentQuery());

  // 2. Local State
  const [search, setSearch] = useState(""); // เก็บคำค้นหา
  const [status, setStatus] = useState(""); // เก็บสถานะกรอง (Active/Inactive) *ยังไม่มีปุ่มกดเปลี่ยนใน UI*

  // 3. Client-side Filtering Logic
  // ใช้ useMemo เพื่อกรองข้อมูลจาก equipment ตัวเต็ม ให้เหลือเฉพาะที่ตรงเงื่อนไข
  // จะทำงานใหม่ก็ต่อเมื่อ equipment, search หรือ status มีการเปลี่ยนแปลง
  const filteredEquipment = useMemo(() => {
    let result = equipment;

    result = result.filter((e) => {
      // กรองชื่อ (Case insensitive)
      const matchesSearch =
        !search || // ถ้าไม่มีคำค้นหา ให้ถือว่าผ่าน
        e.equipmentName
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase());

      // กรองสถานะ (Active/Inactive)
      // Logic: ถ้า status เลือก 'inactive' ให้หาตัวที่ isDeleted=true
      const matchesStatus = !status || e.isDeleted === (status === "inactive");

      return matchesSearch && matchesStatus;
    });

    return result;
  }, [equipment, search, status]);

  return (
    <>
      {/* --- ส่วนหัว (Header) --- */}
      <PageHeader
        title="Equipment"
        // ใช้ filteredEquipment.length เพื่อแสดงจำนวนที่เหลือจากการกรอง
        count={filteredEquipment.length}
        countLabel="items"
        actions={
          <Button
            size="add"
            onClick={() => navigate({ to: "/equipment/create" })}
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Equipment
          </Button>
        }
      />

      {/* --- ช่องค้นหา (Search Bar) --- */}
      <div className="px-6 pt-4 pb-2">
        <SearchBar
          value={search}
          // เมื่อพิมพ์ อัปเดต State ทันที
          onChange={(value) => setSearch(value)}
          placeholder="Search equipment..."
        />
      </div>

      {/* --- ตารางแสดงข้อมูล (Data Table) --- */}
      <PageSection>
        {/* ส่งข้อมูลที่ผ่านการกรองไปแสดง */}
        <DataTable columns={equipmentColumns} data={filteredEquipment} />
      </PageSection>
    </>
  );
}
