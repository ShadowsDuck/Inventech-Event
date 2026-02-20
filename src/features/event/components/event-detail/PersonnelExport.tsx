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
}

export const PersonnelExport = ({
  staffList,
  eventName = "ไม่ระบุ",
}: Props) => {
  return (
    <div className="hidden print:block">
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-2xl font-bold text-black">
          ใบลงทะเบียนลงเวลาปฏิบัติงาน
        </h1>
        <p className="text-gray-600">
          ชื่องาน: {eventName} | วันที่
          ........................................................
        </p>
      </div>

      <table className="w-full border-collapse border border-gray-800 text-sm">
        <thead>
          <tr className="bg-gray-100">
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
        <tbody>
          {staffList.map((person, index) => (
            <tr key={`${person.id}-${index}`}>
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

          {/* บรรทัดว่างเผื่อเขียนเพิ่มหน้างาน */}
          {[1, 2, 3].map((num) => (
            <tr key={`empty-row-${num}`}>
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
      </table>
    </div>
  );
};
