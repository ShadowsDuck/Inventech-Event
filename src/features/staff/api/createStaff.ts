import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";

// 1. import axios

import type { StaffData } from "../components/staff-form";

const API_URL = import.meta.env.VITE_API_URL;

const createStaff = async (newStaff: StaffData): Promise<void> => {
  // --- ส่วนเตรียม FormData (Logic เดิมเป๊ะๆ) ---
  const formData = new FormData();

  formData.append("FullName", newStaff.fullName);

  if (newStaff.email) formData.append("Email", newStaff.email);

  if (newStaff.phoneNumber)
    formData.append("PhoneNumber", newStaff.phoneNumber);

  // ตรงนี้คือจุดที่ทำให้ต้องใช้ FormData (ส่งไฟล์)
  if (newStaff.avatar) {
    formData.append("AvatarFile", newStaff.avatar);
  }

  // ส่ง Array ของ Roles
  if (newStaff.staffRoles && newStaff.staffRoles.length > 0) {
    newStaff.staffRoles.forEach((id) => {
      formData.append("StaffRoles", id.toString());
    });
  }
  // ---------------------------------------------

  try {
    // 2. ใช้ axios.post
    // ส่ง formData ไปได้เลย Axios จัดการ Header ให้เอง
    await axios.post(`${API_URL}/api/staff`, formData);

    return;
  } catch (error) {
    // 3. Pattern การจัดการ Error แบบเดียวกับไฟล์อื่น
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to create staff";

      throw new Error(errorMessage);
    }

    throw new Error("Failed to create staff (Network error)");
  }
};

export const useCreateStaff = () =>
  useMutation({
    mutationFn: createStaff,
    meta: {
      invalidatesQuery: ["staff", "list"],
      successMessage: "Created staff successfully",
      errorMessage: "Failed to create staff",
    },
  });
