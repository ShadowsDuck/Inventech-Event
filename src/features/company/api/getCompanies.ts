import { queryOptions } from "@tanstack/react-query";

const getCompanies = async () => {
  const company = await fetch("https://localhost:7268/api/Company");
  return company.json();
};

export const companiesQuery = queryOptions({
  queryKey: ["companies"], // 🔑 Key สำคัญมาก! ใช้ระบุตัวตนของข้อมูลนี้ unique ไม่ซ้ำกับอันอื่น
  queryFn: getCompanies, // ฟังก์ชันยิง API
});
