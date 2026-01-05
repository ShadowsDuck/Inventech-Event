import React, { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

const DailyListView = () => {
  const today = useMemo(() => new Date(), []);

  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // ตอนนี้ยังไม่มี list event เลยตั้งเป็น 0 ไว้ก่อน
 

  return (
    <div className="w-full max-w-[1200px] mx-auto p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{formattedDate}</h1>
            
          </div>
        </div>
      </div>

      {/* Card รายการ Event */}
      <div className="w-full bg-white border border-gray-100 rounded-[15px] p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
        {/* (พื้นที่ด้านซ้ายของการ์ด ใส่รายละเอียด event ทีหลังได้) */}

        <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-100 transition-colors">
          <ChevronDown size={20} />
        </button>
      </div>
    </div>
  );
};

export default DailyListView;
