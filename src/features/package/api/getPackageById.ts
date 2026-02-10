import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

// 1. import axios

import type { PackageType } from "@/types/package";

const API_URL = import.meta.env.VITE_API_URL;

const getPackageById = async (id: string): Promise<PackageType> => {
  // 2. ใช้ axios.get และระบุ Type <PackageType>
  const { data } = await axios.get<PackageType>(
    `${API_URL}/api/packages/${id}`,
  );

  return data; // 3. ส่งข้อมูลกลับได้เลย
};

export const packageByIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["packages", "detail", id],
    queryFn: () => getPackageById(id),
  });
