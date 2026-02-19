import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { api } from "@/lib/axios";

import type { OutsourceData } from "../components/outsource-form";

const API_URL = import.meta.env.VITE_API_URL;

const createOutsource = async (newOutsource: OutsourceData): Promise<void> => {
  try {
    await api.post(`${API_URL}/api/outsources`, newOutsource);

    return;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to create outsource";

      throw new Error(errorMessage);
    }

    throw new Error("Failed to create outsource (Network error)");
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
