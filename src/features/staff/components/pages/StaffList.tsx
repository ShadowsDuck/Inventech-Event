import { useMemo, useState } from "react";

import { useSuspenseQueries } from "@tanstack/react-query";
import { ListFilter, Plus, Users } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { FilterMultiSelect } from "@/components/ui/filter-multi-select";
import { FilterSelect } from "@/components/ui/filter-select";
import { SELECT_OPTIONS } from "@/data/constants";
import { staffColumns } from "@/features/staff/components/staff-column";
import { Route } from "@/routes/_sidebarLayout/staff";

import { rolesQuery } from "../../api/getRoles";
import { staffQuery } from "../../api/getStaff";

export default function StaffList() {
  const navigate = Route.useNavigate();

  // Suspense รอจนกว่าข้อมูลจะพร้อม แล้วจึงจะเรนเดอร์
  // ถ้าใช้ useQueries ข้อมูลอาจจะยังไม่ถูกโหลดขึ้นมา ตอนที่มาที่หน้านี้แล้ว
  const [{ data: staff }, { data: roles }] = useSuspenseQueries({
    queries: [staffQuery(), rolesQuery()],
  });

  // แปลง Role ให้อยู่ในรูปแบบ Array of Objects (value, label)
  const roleOptions = useMemo(() => {
    return roles?.map((role) => ({
      value: role.roleId.toString(),
      label: role.roleName,
    }));
  }, [roles]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState<string[]>([]);

  // useMemo จะสั่งให้ React จดจำผลลัพธ์ ของ filteredCompanies ไว้ในหน่วยความจำ
  // และจะยอมเสียเวลาคำนวณใหม่ ก็ต่อเมื่อ ค่าในวงเล็บ [companies, search, status] ตัวใดตัวหนึ่งเปลี่ยนไปเท่านั้นครับ
  const filteredStaff = useMemo(() => {
    let result = staff;

    // .filter() เหมือนคนตรวจบัตรหน้าประตู:
    // - หยิบพนักงานมาทีละคน (s) แล้วตรวจสอบ 3 ด่าน (ชื่อ, สถานะ, บทบาท)
    // - ถ้าพนักงานคนนั้นผ่าน "ทุกด่าน" (true && true && true) -> จะถูกเก็บไว้ในรายการที่จะแสดงผล
    // - ถ้าไม่ผ่านแม้แต่ด่านเดียว (ผลลัพธ์มี false) -> จะถูกคัดออกทันที
    result = result.filter((s) => {
      // search กับ status(All) ถ้าไม่ได้เลือกจะเป็น ""
      // และ "" มีค่าเป็น false
      // เติม !"" ไปจะมีค่าเป็น true

      // 1. ค้นหาจากชื่อ: ถ้าไม่ได้พิมพ์ให้ผ่านหมด หรือถ้าพิมพ์ต้องมีคำนั้นอยู่ในชื่อ (ไม่สนตัวเล็ก-ใหญ่)
      // includes (มี... อยู่ในนั้นไหม?)
      const matchesSearch =
        !search || s.fullName.toLowerCase().includes(search.toLowerCase());

      // 2. กรองตามสถานะ: ถ้าเลือก 'All' ให้ผ่านหมด หรือถ้าเลือกสถานะต้องตรงกับค่า isDeleted
      // (Active = isDeleted: false, Inactive = isDeleted: true)
      const matchesStatus = !status || s.isDeleted === (status === "inactive");

      // 3. กรองตามบทบาท:
      // - ถ้าไม่ได้เลือกบทบาทใน Filter (Array ว่าง) ให้ผ่านทุกคน
      // - แต่ถ้าเลือก ให้เช็กว่า "มีอย่างน้อยหนึ่งบทบาท" ของพนักงานคนนั้น ตรงกับที่เราเลือกไว้หรือไม่
      const matchesRole =
        role.length === 0 ||
        s.staffRoles.some((sr) => role.includes(sr.roleId.toString()));
      // .some() จะคืนค่าเป็น True ทันที ถ้าพบว่ามี "อย่างน้อย 1 ค่า" ที่ตรงกับเงื่อนไขที่เรากำลังจะเขียนข้างใน

      // .includes (มี... อยู่ในนั้นไหม?), "ก้อนใหญ่" ตั้ง แล้วใช้ .includes() ตามด้วย "ของชิ้นเล็ก"
      // ตัวอย่าง: ถ้าเราเลือก Filter เป็น Admin (ID: 1) และ Manager (ID: 2) ตัวแปร role จะมีค่าเป็น ["1", "2"]
      // มันจะเช็กว่า role ของพนักงานคนนี้คือ 1 หรือ 2 หรือไม่

      // กรณีที่ 1: พนักงานมีตำแหน่ง ["1", "3"]
      // .some() เริ่มทำงาน: หยิบ 1 มาเช็กก่อน
      // เช็ก: "1", "2" (ก้อนใหญ่) มี "1" (ชิ้นเล็ก) อยู่ข้างในไหม? → เจอ! (True)
      // ผลลัพธ์: .some() หยุดทำงานทันที และตอบว่า True (คนนี้ผ่านด่าน)

      // กรณีที่ 2: พนักงานมีตำแหน่ง ["3", "4"]
      // .some() เริ่มทำงาน: หยิบ 3 มาเช็กก่อน
      // เช็ก: "1", "2" มี "3" ไหม? → ไม่เจอ (False)
      // .some() ทำงานต่อ: หยิบ 4 มาเช็ก
      // เช็ก: "1", "2" มี "4" ไหม? → ไม่เจอ (False)
      // ผลลัพธ์: เมื่อเช็กจนครบแล้วไม่เจอใครเลย จึงตอบว่า False (คนนี้ไม่ผ่านด่าน)

      // ข้อมูลต้องผ่าน "ทุกเงื่อนไข" ถึงจะถูกเก็บไว้ในผลลัพธ์
      return matchesSearch && matchesStatus && matchesRole;
    });

    return result;
  }, [staff, search, status, role]);

  return (
    <>
      <PageHeader
        title="Staff"
        count={filteredStaff.length}
        countLabel="staff members"
        actions={
          <Button size="add" onClick={() => navigate({ to: "/staff/create" })}>
            <Plus size={18} strokeWidth={2.5} />
            Add Staff
          </Button>
        }
      />

      <div className="flex flex-col gap-4 px-6 pt-4">
        <div className="flex items-center gap-2">
          <SearchBar
            value={search}
            onChange={(value) => setSearch(value)}
            placeholder="Search staff..."
          />

          <FilterMultiSelect
            title="Role"
            icon={Users}
            options={roleOptions || []}
            selected={role}
            onChange={(value) => setRole(value)}
          />

          <FilterSelect
            title="Status"
            icon={ListFilter}
            options={SELECT_OPTIONS}
            value={status}
            onChange={(value) => setStatus(value)}
          />
        </div>

        <DataTable columns={staffColumns} data={filteredStaff} />
      </div>
    </>
  );
}
