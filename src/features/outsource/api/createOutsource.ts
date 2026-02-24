import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";

import type { OutsourceData } from "../components/outsource-form";

const API_URL = import.meta.env.VITE_API_URL;

const createOutsource = async (newOutsource: OutsourceData): Promise<void> => {
  try {
    await api.post(`${API_URL}/api/outsources`, newOutsource);

    return;
  } catch (error) {
    return handleApiError(error, "Failed to create outsource");
  }
};

export const useCreateOutsource = () =>
  useMutation({
    mutationFn: createOutsource,
    meta: {
      invalidatesQuery: ["outsources", "list"],
      successMessage: "Created outsource successfully",
      errorMessage: "Failed to create outsource",
    },
  });
