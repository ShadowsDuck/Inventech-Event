import React from "react";

export interface ExportEquipmentProp {
  id: string | number;
  name: string;
  category: string;
  source: "Package" | "Extra";
  quantity: number;
}

interface Props {
  equipmentList: ExportEquipmentProp[];
  eventName?: string;
}

export const ExportEquipment = ({
  equipmentList,
  eventName = "ไม่ระบุ",
}: Props) => {
  return (
    // เอา print:p-12 ออก เพื่อให้ใช้ระยะขอบจาก CSS แทน
    <div className="hidden print:m-0 print:block print:bg-white print:p-0">
      {/* เอา border border-gray-800 ออกจาก table เพื่อไม่ให้ตีเส้นล้อมกรอบ */}
      <table className="w-full border-collapse text-sm">
        <thead className="print:table-header-group">
          {/* ขอบกระดาษด้านบนจำลอง (Top Margin) */}
          <tr className="hidden print:table-row">
            <th colSpan={5} className="h-[1.5cm] border-0 p-0"></th>
          </tr>

          {/* ส่วนหัวเอกสารที่จะไปแสดงทุกหน้า */}
          <tr>
            <th colSpan={5} className="border-0 pb-6 text-center font-normal">
              <h1 className="mb-2 text-2xl font-bold text-black">
                รายการอุปกรณ์
              </h1>
              <p className="text-gray-600">
                ชื่องาน: {eventName} | วันที่
                ........................................................
              </p>
            </th>
          </tr>

          {/* หัวตาราง */}
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
              key={`${item.source}-${item.id}-${index}`}
              className="break-inside-avoid print:break-inside-avoid"
            >
              <td className="border border-gray-800 p-1 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-800 p-1 text-left font-medium text-black">
                {item.name}
              </td>
              <td className="border border-gray-800 p-1 text-center font-bold text-black">
                {item.quantity}
              </td>
              <td className="border border-gray-800 p-1">
                {/* ช่องว่างสำหรับติ๊กตรวจสอบ */}
              </td>
              <td className="border border-gray-800 p-1">
                {/* ช่องว่างสำหรับเขียนหมายเหตุ */}
              </td>
            </tr>
          ))}

          {/* บรรทัดว่างเผื่อเบิกของเพิ่มหน้างานฉุกเฉิน */}
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
            </tr>
          ))}
        </tbody>

        {/* ขอบกระดาษด้านล่างจำลอง (Bottom Margin) */}
        <tfoot className="hidden print:table-footer-group">
          <tr>
            <td colSpan={5} className="h-[1.5cm] border-0 p-0"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
