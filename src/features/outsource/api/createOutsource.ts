import { useMutation } from "@tanstack/react-query";

import type { OutsourceData } from "../components/outsource-form";

const API_URL = import.meta.env.VITE_API_URL;

const createOutsource = async (newOutsource: OutsourceData): Promise<void> => {
  await fetch(`${API_URL}/api/outsources`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newOutsource),
  });

  return;
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
