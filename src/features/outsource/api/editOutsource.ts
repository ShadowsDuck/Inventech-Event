import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";

import type { OutsourceData } from "../components/outsource-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateOutsourceData = OutsourceData & {
  id: string;
};

const editOutsource = async ({
  id,
  ...data
}: UpdateOutsourceData): Promise<void> => {
  try {
    await api.put(`${API_URL}/api/outsources/${id}`, data);

    return;
  } catch (error) {
    return handleApiError(error, "Failed to update outsource");
  }
};

export const useEditOutsource = () =>
  useMutation({
    mutationFn: editOutsource,
    meta: {
      invalidatesQuery: ["outsources"],
      successMessage: "Updated outsource successfully",
      errorMessage: "Failed to update outsource",
    },
  });
