import { useMemo, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ListFilter, Plus } from "lucide-react";

import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/filter-select";
import { SELECT_OPTIONS } from "@/data/constants";
import { companyColumns } from "@/features/company/components/companies-column";
import { Route } from "@/routes/_sidebarLayout/company";

import SearchBar from "../../../components/SearchBar";
import PageHeader from "../../../components/layout/PageHeader";
import { companiesQuery } from "../api/getCompanies";

export default function CompanyList() {
  const navigate = Route.useNavigate();

  // Suspense รอจนกว่าข้อมูลจะพร้อม แล้วจึงจะเรนเดอร์
  // ถ้าใช้ useQuery ข้อมูลอาจจะยังไม่ถูกโหลดขึ้นมา ตอนที่มาที่หน้านี้แล้ว
  const { data: companies } = useSuspenseQuery(companiesQuery());

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // useMemo จะสั่งให้ React จดจำผลลัพธ์ ของ filteredCompanies ไว้ในหน่วยความจำ
  // และจะยอมเสียเวลาคำนวณใหม่ ก็ต่อเมื่อ ค่าในวงเล็บ [companies, search, status] ตัวใดตัวหนึ่งเปลี่ยนไปเท่านั้นครับ
  const filteredCompanies = useMemo(() => {
    let result = companies;

    result = result.filter((c) => {
      // search กับ status(All) ถ้าไม่ได้เลือกจะเป็น ""
      // และ "" มีค่าเป็น false
      // เติม !"" ไปจะมีค่าเป็น true

      // 1. ค้นหาจากชื่อ: ถ้าไม่ได้พิมพ์ให้ผ่านหมด หรือถ้าพิมพ์ต้องมีคำนั้นอยู่ในชื่อบริษัท (ไม่สนตัวเล็ก-ใหญ่)
      // includes (มี... อยู่ในนั้นไหม?)
      const matchesSearch =
        !search || c.companyName.toLowerCase().includes(search.toLowerCase());

      // 2. กรองตามสถานะ: ถ้าเลือก 'All' ให้ผ่านหมด หรือถ้าเลือกสถานะต้องตรงกับค่า isDeleted
      // (Active = isDeleted: false, Inactive = isDeleted: true)
      const matchesStatus = !status || c.isDeleted === (status === "inactive");

      // ข้อมูลต้องผ่าน "ทุกเงื่อนไข" ถึงจะถูกเก็บไว้ในผลลัพธ์
      return matchesSearch && matchesStatus;
    });

    return result;
  }, [companies, search, status]);

  return (
    <>
      <PageHeader
        title="Company"
        count={companies.length}
        countLabel="companies"
        actions={
          <Button
            size="add"
            onClick={() => navigate({ to: "/company/create" })}
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Company
          </Button>
        }
      />

      <div className="flex flex-col gap-4 px-6 pt-4">
        <div className="flex items-center gap-2">
          <SearchBar
            value={search}
            onChange={(value) => setSearch(value)}
            placeholder="Search company..."
          />

          <FilterSelect
            title="Status"
            icon={ListFilter}
            options={SELECT_OPTIONS}
            value={status}
            onChange={(value) => setStatus(value)}
          />
        </div>

        <DataTable
          columns={companyColumns}
          data={filteredCompanies}
          onRowClick={(row) =>
            navigate({
              to: "/company/$companyId",
              params: { companyId: row.companyId.toString() },
            })
          }
        />
      </div>
    </>
  );
}
