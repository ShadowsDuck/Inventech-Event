import React, { useMemo } from "react";

import { ChevronDown } from "lucide-react";

const DailyView = () => {
  const today = useMemo(() => new Date(), []);

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // ตอนนี้ยังไม่มี list event เลยตั้งเป็น 0 ไว้ก่อน

  return (
    <div className="mx-auto w-full max-w-[1200px] p-6 font-sans">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{formattedDate}</h1>
          </div>
        </div>
      </div>

      {/* Card รายการ Event */}
      <div className="flex w-full items-center justify-between rounded-[15px] border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        {/* (พื้นที่ด้านซ้ายของการ์ด ใส่รายละเอียด event ทีหลังได้) */}

        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-300 transition-colors hover:bg-gray-100">
          <ChevronDown size={20} />
        </button>
      </div>
    </div>
  );
};

export default DailyView;
