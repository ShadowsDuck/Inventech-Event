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
    <div className="hidden print:block print:bg-white print:p-12">
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-2xl font-bold text-black">
          ใบเบิกจ่ายและตรวจสอบอุปกรณ์
        </h1>
        <p className="text-gray-600">
          ชื่องาน: {eventName} | วันที่
          ........................................................
        </p>
      </div>

      <table className="w-full border-collapse border border-gray-800 text-sm">
        <thead>
          <tr className="bg-gray-100">
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
        <tbody>
          {equipmentList.map((item, index) => (
            <tr key={`${item.source}-${item.id}-${index}`}>
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
            <tr key={`empty-row-${num}`}>
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
      </table>
    </div>
  );
};
