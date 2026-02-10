import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

// 1. import axios

import type { EquipmentStatusType } from "@/data/constants";
import type { PackageType } from "@/types/package";

const API_URL = import.meta.env.VITE_API_URL;

const getPackage = async (params: {
  equipmentStatus: EquipmentStatusType;
}): Promise<PackageType[]> => {
  // 2. ใช้ axios.get พร้อมระบุ Generic Type <PackageType[]>
  // และส่ง params เข้าไปตรงๆ ได้เลย ไม่ต้องใช้ URLSearchParams เองแล้ว
  const { data } = await axios.get<PackageType[]>(`${API_URL}/api/packages`, {
    params: {
      equipmentStatus: params.equipmentStatus,
    },
  });

  return data;
};

export const packageQuery = (filters?: {
  equipmentStatus: EquipmentStatusType;
}) => {
  return queryOptions({
    queryKey: ["packages", "list", filters],
    queryFn: () => getPackage(filters || { equipmentStatus: "all" }),
  });
};
