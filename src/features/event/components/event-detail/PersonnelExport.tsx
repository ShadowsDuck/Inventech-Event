import React from "react";

export interface ReportStaff {
  id: string;
  name: string;
  roleName: string;
  type: "staff" | "outsource";
}

interface Props {
  staffList: ReportStaff[];
  eventName?: string;
  meetingDate?: string;
}

export const PersonnelExport = ({
  staffList,
  eventName = "ไม่ระบุ",
  meetingDate = "ไม่ระบุ",
}: Props) => {
  return (
    <div className="hidden print:block print:p-10">
      {" "}
      <table className="w-full border-collapse text-sm">
        <thead className="print:table-header-group">
          <tr className="hidden print:table-row">
            <th colSpan={7} className="h-[1.5cm] border-0 p-0"></th>
          </tr>

          <tr>
            <th colSpan={7} className="border-0 pb-6 text-center font-normal">
              <h1 className="mb-2 text-2xl font-bold text-black">
                ใบลงทะเบียนลงเวลาปฏิบัติงาน
              </h1>
              <p className="text-gray-600">
                ชื่องาน: {eventName} | วันที่: {meetingDate}
                {}
                {}
              </p>
            </th>
          </tr>

          <tr className="break-inside-avoid bg-gray-100">
            <th className="w-12 border border-gray-800 p-2 text-center">
              ลำดับ
            </th>
            <th className="w-48 border border-gray-800 p-2 text-left">
              ชื่อ-นามสกุล
            </th>
            <th className="w-32 border border-gray-800 p-2 text-left">
              หน้าที่
            </th>
            <th className="w-24 border border-gray-800 p-2 text-center">
              ประเภท
            </th>
            <th className="w-24 border border-gray-800 p-2 text-center">
              เวลาเข้า
            </th>
            <th className="w-24 border border-gray-800 p-2 text-center">
              เวลาออก
            </th>
            <th className="w-32 border border-gray-800 p-2 text-center">
              ลายมือชื่อ
            </th>
          </tr>
        </thead>

        <tbody className="print:table-row-group">
          {staffList.map((person, index) => (
            <tr
              key={`${person.id}-${index}`}
              className="break-inside-avoid print:break-inside-avoid"
            >
              <td className="border border-gray-800 p-2 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-800 p-2 text-left font-medium text-black">
                {person.name}
              </td>
              <td className="border border-gray-800 p-2 text-left text-black">
                {person.roleName}
              </td>
              <td className="border border-gray-800 p-2 text-center text-black">
                {person.type === "staff" ? "Staff" : "Outsource"}
              </td>
              <td className="border border-gray-800 p-2"></td>
              <td className="border border-gray-800 p-2"></td>
              <td className="border border-gray-800 p-2"></td>
            </tr>
          ))}

          {[1, 2, 3, 4, 5].map((num) => (
            <tr
              key={`empty-row-${num}`}
              className="break-inside-avoid print:break-inside-avoid"
            >
              <td className="border border-gray-800 p-2 text-center">
                {staffList.length + num}
              </td>
              <td className="border border-gray-800 p-2"></td>
              <td className="border border-gray-800 p-2"></td>
              <td className="border border-gray-800 p-2"></td>
              <td className="border border-gray-800 p-2"></td>
              <td className="border border-gray-800 p-2"></td>
              <td className="border border-gray-800 p-2"></td>
            </tr>
          ))}
        </tbody>

        <tfoot className="hidden print:table-footer-group">
          <tr>
            <td colSpan={7} className="h-[1.5cm] border-0 p-0"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
