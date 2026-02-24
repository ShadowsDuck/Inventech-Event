import React from "react";

// เรียกใช้ ExportEquipmentProp แบบใหม่ที่แยก packageQuantity และ extraQuantity
export interface ExportEquipmentProp {
  id: string | number;
  name: string;
  category: string;
  packageQuantity: number;
  extraQuantity: number;
}

interface Props {
  equipmentList: ExportEquipmentProp[];
  eventName?: string;
  meetingDate?: string;
}

export const ExportEquipment = ({
  equipmentList,
  eventName = "ไม่ระบุ",
  meetingDate = "ไม่ระบุ",
}: Props) => {
  return (
    <div className="hidden print:m-0 print:block print:bg-white print:p-0">
      <table className="w-full border-collapse text-sm">
        <thead className="print:table-header-group">
          <tr className="hidden print:table-row">
            <th colSpan={6} className="h-[1.5cm] border-0 p-0"></th>
          </tr>

          <tr>
            <th colSpan={6} className="border-0 pb-6 text-center font-normal">
              <h1 className="mb-2 text-2xl font-bold text-black">
                รายการอุปกรณ์
              </h1>
              <p className="text-gray-600">
                ชื่องาน: {eventName} | วันที่: {meetingDate}
              </p>
            </th>
          </tr>

          <tr className="break-inside-avoid bg-gray-100">
            <th className="w-16 border border-gray-800 p-1 text-center">
              ลำดับ
            </th>
            <th className="w-auto border border-gray-800 p-1 text-left">
              ชื่ออุปกรณ์
            </th>
            <th className="w-24 border border-gray-800 p-1 text-center">
              จำนวน
            </th>
            <th className="w-24 border border-gray-800 p-1 text-center">
              เบิกเพิ่ม
            </th>
            <th className="w-32 border border-gray-800 p-1 text-center">
              ตรวจสอบ
            </th>
            <th className="w-48 border border-gray-800 p-1 text-left">
              หมายเหตุ
            </th>
          </tr>
        </thead>

        <tbody className="print:table-row-group">
          {equipmentList.map((item, index) => (
            <tr
              key={`print-${item.id}-${index}`}
              className="break-inside-avoid print:break-inside-avoid"
            >
              <td className="border border-gray-800 p-1 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-800 p-1 text-left font-medium text-black">
                {item.name}
              </td>
              {/* แสดงจำนวนจาก Package */}
              <td className="border border-gray-800 p-1 text-center font-bold text-black">
                {item.packageQuantity > 0 ? item.packageQuantity : "-"}
              </td>
              {/* แสดงจำนวนจาก Extra */}
              <td className="border border-gray-800 p-1 text-center font-bold text-black">
                {item.extraQuantity > 0 ? item.extraQuantity : ""}
              </td>
              <td className="border border-gray-800 p-1"></td>
              <td className="border border-gray-800 p-1"></td>
            </tr>
          ))}

          {/* บรรทัดว่างเผื่อจดเพิ่มหน้างาน */}
          {[1, 2, 3].map((num) => (
            <tr
              key={`empty-row-${num}`}
              className="break-inside-avoid print:break-inside-avoid"
            >
              <td className="border border-gray-800 p-1 text-center">
                {equipmentList.length + num}
              </td>
              <td className="border border-gray-800 p-1"></td>
              <td className="border border-gray-800 p-1"></td>
              <td className="border border-gray-800 p-1"></td>
              <td className="border border-gray-800 p-1"></td>
              <td className="border border-gray-800 p-1"></td>
            </tr>
          ))}
        </tbody>

        <tfoot className="hidden print:table-footer-group">
          <tr>
            <td colSpan={6} className="h-[1.5cm] border-0 p-0"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
